import React, { useEffect, useState } from "react";
import BandForm from "./components/BandForm.jsx";
import RecordsTable from "./components/RecordsTable.jsx";
import FilterForm from "./components/FilterForm.jsx";
import ChartView from "./components/ChartView.jsx";
import { fetchRecords } from "./api";

export default function App() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState("");

  async function loadRecords() {
    try {
      const data = await fetchRecords();
      setRecords(data);
    } catch (err) {
      setError(err.message || "Error loading records");
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  function handleNewResult(result) {
    setLastResult(result);
    loadRecords();
  }

  return (
    <div className="app">
      <header>
        <h1>Band Length Calculator</h1>
      </header>

      <main>
        <BandForm onResult={handleNewResult} />

        {lastResult && (
          <div className="card">
            <h2>Last Calculation</h2>
            <p><strong>Brand:</strong> {lastResult.brand}</p>
            <p><strong>Thickness:</strong> {lastResult.thickness} mm</p>
            <p>{lastResult.draw_length_str}</p>
            <p>{lastResult.elongation_str}</p>
            <p>{lastResult.active_length_str}</p>
            <p>{lastResult.extra_info_str}</p>
            <p><strong>{lastResult.band_length_to_cut_str}</strong></p>
          </div>
        )}

        <FilterForm onResults={setFilteredRecords} />

        {filteredRecords.length > 0 && (
          <RecordsTable
            records={filteredRecords}
            title="Filtered Records"
          />
        )}

        <RecordsTable records={records} title="All Records" />

        <ChartView />

        {error && <div className="error global-error">{error}</div>}
      </main>
    </div>
  );
}