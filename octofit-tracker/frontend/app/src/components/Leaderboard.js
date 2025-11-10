
import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const codespaceUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    console.log('Leaderboard API endpoint:', codespaceUrl);
    try {
      const res = await fetch(codespaceUrl);
      const data = await res.json();
      console.log('Fetched leaderboard (raw):', data);
      const results = data.results || data;
      const filtered = query ? results.filter(r => JSON.stringify(r).toLowerCase().includes(query.toLowerCase())) : results;
      setLeaders(filtered);
      console.log('Leaderboard to display:', filtered);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  useEffect(() => { fetchData(); }, []);

  const onRefresh = () => fetchData();
  const openDetails = (item) => { setSelected(item); setShowModal(true); console.log('Open leaderboard item:', item); };

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Leaderboard</h5>
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
                {leaders.length > 0 ? Object.keys(leaders[0]).map((key) => (
                  <th key={key}>{key}</th>
                )) : <th>No data</th>}
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, idx) => (
                <tr key={leader.id || idx} style={{cursor: 'pointer'}} onClick={() => openDetails(leader)}>
                  {Object.values(leader).map((val, i) => (
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
                  <h5 className="modal-title">Leaderboard Item</h5>
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

export default Leaderboard;
