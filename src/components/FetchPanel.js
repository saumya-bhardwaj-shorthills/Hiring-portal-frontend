// src/components/FetchPanel.js
import React, { useState, useEffect } from 'react';
import * as api from '../api/sharepoint';

export default function FetchPanel({ token }) {
  const [sites, setSites] = useState([]);
  const [selected, setSelected] = useState('');   // '' | 'new' | sitePk
  const [newUrl, setNewUrl] = useState('');
  const [files, setFiles] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // load saved sites on mount
  useEffect(() => {
    api.listSites(token).then(setSites);
  }, [token]);

  // handle selecting an existing site
  useEffect(() => {
    if (selected && selected !== 'new') {
      setFiles([]); setStatusMap({}); setMsg('');
      setLoading(true);
      api.fetchSiteResumes(token, selected)
        .then(fs => {
          setFiles(fs);
          setMsg(`Found ${fs.length} unparsed resumes`);
        })
        .catch(() => setMsg('Error fetching resumes'))
        .finally(() => setLoading(false));
    }
  }, [selected, token]);

  const handleAddSite = async () => {
    if (!newUrl.trim()) return;
    setLoading(true); setMsg('');
    try {
      const site = await api.addSite(token, newUrl);
      setSites(prev => [...prev, site]);
      setSelected(site.id.toString());
      setNewUrl('');
    } catch {
      setMsg('Error adding site');
    } finally {
      setLoading(false);
    }
  };

  const handleParseAll = async () => {
    if (!selected || selected === 'new') return;
    setLoading(true);
    const site = sites.find(s => s.id.toString() === selected);
    const newStatus = {};
    for (const f of files) {
      newStatus[f.id] = 'parsing';
      setStatusMap({ ...newStatus });
      try {
        // reuse your existing parseResumeApi
        await api.parseResumeApi(token, site.site_id, site.drive_id, f.id);
        newStatus[f.id] = 'done';
      } catch {
        newStatus[f.id] = 'error';
      }
      setStatusMap({ ...newStatus });
    }
    setMsg('Parsing complete');
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">

      {/* Site selector */}
      <div className="flex items-center space-x-2">
        <select
          className="p-2 border flex-1"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">-- Choose site --</option>
          <option value="new">+ Add new site</option>
          {sites.map(s => (
            <option key={s.id} value={s.id}>{s.site_url}</option>
          ))}
        </select>

        {selected === 'new' && (
          <>
            <input
              className="flex-1 p-2 border"
              type="text"
              placeholder="Paste SharePoint URL"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
            />
            <button
              onClick={handleAddSite}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Save Site
            </button>
          </>
        )}
      </div>

      {/* Parse All button */}
      {selected && selected !== 'new' && files.length > 0 && (
        <button
          onClick={handleParseAll}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Parse All
        </button>
      )}

      {msg && <p className="text-gray-700">{msg}</p>}

      {/* Resume list */}
      <ul className="space-y-2">
        {files.map(f => (
          <li key={f.id} className="p-2 border rounded flex justify-between">
            <span>{f.name}</span>
            <span className="italic">{statusMap[f.id] || 'idle'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
