import React, { useState, useEffect} from 'react';
import { Settings, Search } from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getNotifications } from '../../api/adminApi';
import '../../styles/admin.css';

function AuditLog() {
  const [logs, setLogs]         = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    getNotifications()
      .then(res => { 
        const data = res.data.data || [];
        setLogs(res.data.data || []);
        setFiltered(data); 
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(logs.filter(l =>
      l.employeeName?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.eventType?.toLowerCase().includes(q)
    ));
  }, [search, logs]);

  const typeBadge = (type) => {
    if (type === 'USER_REGISTERED')     return <span className="tag tag-user">{type.replace(/_/g, ' ')}</span>;
    if (type === 'TIMESHEET_SUBMITTED') return <span className="tag tag-ts">{type.replace(/_/g, ' ')}</span>;
    return <span className="tag tag-lv">{type?.replace(/_/g, ' ')}</span>;
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Audit Log</h1>
        <p className="page-subtitle">Complete history of all system events</p>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', display: 'flex' }}>
              <Search size={15} />
            </span>
            <input
              className="form-input"
              style={{ paddingLeft: '34px' }}
              placeholder="Search by name, email, event..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {filtered.length} event{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
          <div className="empty-state"><Settings size={36} /><p>No audit events found</p></div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Event Type</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{log.employeeName || '—'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{log.email || '—'}</td>
                    <td>{typeBadge(log.eventType)}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : '—'}
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

export default AuditLog;