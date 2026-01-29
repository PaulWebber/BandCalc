import React, { useState } from "react";
import { calculateBand } from "../api";

export default function BandForm({ onResult }) {
  const [drawLength, setDrawLength] = useState("");
  const [elongation, setElongation] = useState("");
  const [brand, setBrand] = useState("");
  const [thickness, setThickness] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        fltDrawLengthCM: parseFloat(drawLength),
        fltElongationCM: parseFloat(elongation),
        brand,
        thickness: parseFloat(thickness)
      };
      const result = await calculateBand(payload);
      onResult(result);
    } catch (err) {
      setError(err.message || "Error calculating");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>New Calculation</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Draw Length (cm)
          <input
            type="number"
            step="0.01"
            value={drawLength}
            onChange={(e) => setDrawLength(e.target.value)}
            required
          />
        </label>

        <label>
          Elongation (ratio)
          <input
            type="number"
            step="0.01"
            value={elongation}
            onChange={(e) => setElongation(e.target.value)}
            required
          />
        </label>

        <label>
          Brand
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </label>

        <label>
          Thickness (mm)
          <input
            type="number"
            step="0.01"
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
    </div>
  );
}