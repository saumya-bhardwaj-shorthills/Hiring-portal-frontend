import React, { useState } from 'react';
import * as api from '../api/sharepoint';

export default function SearchPanel({ token }) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setMsg('');
    try {
      const res = await api.searchCandidatesApi(token, keyword);
      setResults(res);
      setMsg(`Found ${res.length} candidates`);
    } catch {
      setMsg('Search error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search keyword (e.g., php)"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ width: '40%', padding: 8, marginRight: 8 }}
        />
        <button onClick={handleSearch} disabled={loading || !keyword}>
          Search
        </button>
      </div>

      {msg && <p>{msg}</p>}

      <ul>
        {results.map((c, idx) => (
          <li
            key={idx}
            style={{
              marginBottom: 16,
              padding: 12,
              background: '#f5f5f5',
              borderRadius: 4
            }}
          >
            <h4>{c.name}</h4>
            <p><strong>Email:</strong> {c.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {c.phone || 'N/A'}</p>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                background: '#fff',
                padding: 8,
                maxHeight: 200,
                overflowY: 'auto',
                border: '1px solid #ddd'
              }}
            >{JSON.stringify(c.parsed_data, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
