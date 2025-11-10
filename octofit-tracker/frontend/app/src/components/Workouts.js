
import React, { useEffect, useState } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const codespaceUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    console.log('Workouts API endpoint:', codespaceUrl);
    try {
      const res = await fetch(codespaceUrl);
      const data = await res.json();
      console.log('Fetched workouts (raw):', data);
      const results = data.results || data;
      const filtered = query ? results.filter(r => JSON.stringify(r).toLowerCase().includes(query.toLowerCase())) : results;
      setWorkouts(filtered);
      console.log('Workouts to display:', filtered);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  useEffect(() => { fetchData(); }, []);

  const onRefresh = () => fetchData();
  const openDetails = (item) => { setSelected(item); setShowModal(true); console.log('Open workout:', item); };

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Workouts</h5>
        <div className="d-flex align-items-center">
          <form className="d-flex me-2" onSubmit={e => { e.preventDefault(); fetchData(); }}>
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
                {workouts.length > 0 ? Object.keys(workouts[0]).map((key) => (
                  <th key={key}>{key}</th>
                )) : <th>No data</th>}
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout, idx) => (
                <tr key={workout.id || idx} style={{cursor: 'pointer'}} onClick={() => openDetails(workout)}>
                  {Object.values(workout).map((val, i) => (
                    <td key={i}>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Workout Details</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body"><pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(selected, null, 2)}</pre></div>
                <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button></div>
              </div>
            </div>
            <div className="modal-backdrop show"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;
