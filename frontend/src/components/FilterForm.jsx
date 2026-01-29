import React, { useState } from "react";
import { filterRecords } from "../api";

export default function FilterForm({ onResults }) {
  const [brand, setBrand] = useState("");
  const [thickness, setThickness] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const params = {
        brand: brand || undefined,
        thickness: thickness ? parseFloat(thickness) : undefined
      };
      const results = await filterRecords(params);
      onResults(results);
    } catch (err) {
      setError(err.message || "Error filtering");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Filter Records</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Brand
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </label>

        <label>
          Thickness (mm)
          <input
            type="number"
            step="0.01"
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Filtering..." : "Apply Filter"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
    </div>
  );
}