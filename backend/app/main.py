from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse

from .db import Base, engine, SessionLocal
from .models import BandRecord

import io
import matplotlib.pyplot as plt

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Adjust origins as needed (e.g., your React dev server)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class BandInput(BaseModel):
    fltDrawLengthCM: float
    fltElongationCM: float
    brand: str
    thickness: float

    @field_validator("fltElongationCM")
    @classmethod
    def elongation_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Elongation must be greater than zero.")
        return v


class BandRecordOut(BaseModel):
    id: int
    brand: str
    thickness: float
    draw_length: float
    elongation: float
    active_length: float
    band_length_to_cut: float

    class Config:
        from_attributes = True


def compute_band(data: BandInput) -> dict:
    draw_length = data.fltDrawLengthCM
    elongation = data.fltElongationCM

    active_length = draw_length / elongation
    band_length_to_cut = active_length + 3  # 1.5 + 1.5

    return {
        "draw_length": draw_length,
        "elongation": elongation,
        "active_length": active_length,
        "band_length_to_cut": band_length_to_cut,
        "brand": data.brand,
        "thickness": data.thickness,
        "draw_length_str": f"Draw length is {draw_length}cm.",
        "elongation_str": f"Elongation is {elongation}cm.",
        "active_length_str": f"Active Length is {active_length}cm",
        "extra_info_str": "Adding 3cm. 1.5cm for pouch tying and 1.5 for frame tying",
        "band_length_to_cut_str": f"Band length to cut is {band_length_to_cut}cm",
    }


@app.post("/calculate")
def calculate_band_data(data: BandInput, db: Session = Depends(get_db)):
    result = compute_band(data)

    record = BandRecord(
        brand=result["brand"],
        thickness=result["thickness"],
        draw_length=result["draw_length"],
        elongation=result["elongation"],
        active_length=result["active_length"],
        band_length_to_cut=result["band_length_to_cut"],
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    result["id"] = record.id
    return result


@app.get("/records", response_model=list[BandRecordOut])
def list_records(db: Session = Depends(get_db)):
    records = db.query(BandRecord).all()
    return records


@app.get("/filter", response_model=list[BandRecordOut])
def filter_records(
    brand: str | None = None,
    thickness: float | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(BandRecord)

    if brand:
        query = query.filter(BandRecord.brand == brand)

    if thickness is not None:
        query = query.filter(BandRecord.thickness == thickness)

    results = query.all()
    return results


@app.get("/chart/active-vs-thickness")
def chart_active_vs_thickness(db: Session = Depends(get_db)):
    records = db.query(BandRecord).all()
    if not records:
        raise HTTPException(status_code=404, detail="No records to chart")

    thicknesses = [r.thickness for r in records]
    active_lengths = [r.active_length for r in records]

    plt.figure(figsize=(6, 4))
    plt.scatter(thicknesses, active_lengths, color="blue")
    plt.title("Active Length vs Thickness")
    plt.xlabel("Thickness (mm)")
    plt.ylabel("Active Length (cm)")
    plt.grid(True)

    buf = io.BytesIO()
    plt.savefig(buf, format="png", dpi=120)
    plt.close()
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")