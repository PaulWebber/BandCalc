from sqlalchemy import Column, Integer, Float, String
from .db import Base

class BandRecord(Base):
    __tablename__ = "band_records"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, index=True)
    thickness = Column(Float)
    draw_length = Column(Float)
    elongation = Column(Float)
    active_length = Column(Float)
    band_length_to_cut = Column(Float)