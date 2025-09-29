import React from "react";

export default function BusinessInfo({
  businessName,
  setBusinessName,
  openingHours,
  setOpeningHours,
  handleBusinessInfoSubmit,
  timeOptions,
}) {
  return (
    <div className="dashboard-section business-info">
      <h3 className="section-title">Business Info</h3>
      <form onSubmit={handleBusinessInfoSubmit} className="business-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            Save Info
          </button>
        </div>

        <div className="opening-hours">
          <h4>Opening Hours</h4>
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => {
            const current = openingHours?.[day] || "";
            const [open, close] = current.includes("-")
              ? current.split("-")
              : ["", ""];
            return (
              <div key={day} className="opening-hours-row">
                <label className="day-label">{day}</label>

                <select
                  value={open}
                  onChange={(e) =>
                    setOpeningHours((prev) => ({
                      ...prev,
                      [day]: `${e.target.value}-${close || ""}`,
                    }))
                  }
                >
                  <option value="">Closed</option>
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <span className="to-label">to</span>

                <select
                  value={close}
                  onChange={(e) =>
                    setOpeningHours((prev) => ({
                      ...prev,
                      [day]: `${open || ""}-${e.target.value}`,
                    }))
                  }
                >
                  <option value="">Closed</option>
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
}