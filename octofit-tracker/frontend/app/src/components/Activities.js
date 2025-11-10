
import React, { useEffect, useState } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const codespaceUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
    console.log('Activities API endpoint:', codespaceUrl);
    try {
      const res = await fetch(codespaceUrl);
      const data = await res.json();
      console.log('Fetched activities (raw):', data);
      const results = data.results || data;
      // Optionally apply simple client-side filter by JSON-string match
      const filtered = query ? results.filter(r => JSON.stringify(r).toLowerCase().includes(query.toLowerCase())) : results;
      setActivities(filtered);
      console.log('Activities to display:', filtered);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = () => fetchData();

  const openDetails = (item) => {
    setSelected(item);
    setShowModal(true);
    console.log('Open details for item:', item);
  };

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Activities</h5>
        <div className="d-flex align-items-center">
          <form className="d-flex me-2" onSubmit={(e) => { e.preventDefault(); fetchData(); }}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="form-control form-control-sm" placeholder="Search..." />
          </form>
          <button className="btn btn-sm btn-primary" onClick={onRefresh} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
        </div>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                {activities.length > 0 ? Object.keys(activities[0]).map((key) => (
                  <th key={key}>{key}</th>
                )) : <th>No data</th>}
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, idx) => (
                <tr key={activity.id || idx} style={{cursor: 'pointer'}} onClick={() => openDetails(activity)}>
                  {Object.values(activity).map((val, i) => (
                    <td key={i}>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Simple controlled Bootstrap-style modal (CSS-only) */}
        {showModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Activity Details</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(selected, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                </div>
              </div>
            </div>
            <div className="modal-backdrop show"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
