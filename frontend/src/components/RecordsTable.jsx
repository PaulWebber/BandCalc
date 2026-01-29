import React from "react";

export default function RecordsTable({ records, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {records.length === 0 ? (
        <p>No records.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Brand</th>
                <th>Thickness</th>
                <th>Draw</th>
                <th>Elongation</th>
                <th>Active</th>
                <th>Cut Length</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.brand}</td>
                  <td>{r.thickness}</td>
                  <td>{r.draw_length}</td>
                  <td>{r.elongation}</td>
                  <td>{r.active_length}</td>
                  <td>{r.band_length_to_cut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}