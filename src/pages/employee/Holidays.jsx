import React, { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getHolidays } from "../../api/leaveApi";

function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHolidays()
      .then((res) => setHolidays(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Company Holidays</h1>
        <p className="page-subtitle">Official holidays for the current year</p>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : holidays.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={36} />
            <p>No holidays listed for this year</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Holiday</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((h) => (
                  <tr
                    key={h.id}
                    style={{ opacity: h.holidayDate < today ? 0.5 : 1 }}
                  >
                    <td style={{ fontWeight: 500 }}>
                      {new Date(h.holidayDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>{h.holidayName}</td>
                    <td>
                      <span
                        className={`badge ${h.isOptional ? "badge-submitted" : "badge-approved"}`}
                      >
                        {h.isOptional ? "Optional" : "Mandatory"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Holidays;
