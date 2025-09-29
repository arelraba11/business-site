import React from "react";

export default function AppointmentsSection({ appointments, handleUpdate }) {
  return (
    <div className="dashboard-section appointments">
      <h3 className="section-title">Appointments</h3>
      <table className="appointments-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>{a.client?.username || "N/A"}</td>
              <td>{a.client?.email || "N/A"}</td>
              <td>{a.service}</td>
              <td>{new Date(a.dateTime).toLocaleDateString()}</td>
              <td>{new Date(a.dateTime).toLocaleTimeString()}</td>
              <td>{a.status}</td>
              <td className="table-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleUpdate(a._id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleUpdate(a._id, "rejected")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}