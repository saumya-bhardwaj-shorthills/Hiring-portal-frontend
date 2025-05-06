// src/components/FetchPanel.js
import React, { useState } from 'react';
import * as api from '../api/sharepoint';

export default function FetchPanel({ token }) {
  const [siteUrl, setSiteUrl] = useState('');
  const [files, setFiles] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleFetch = async () => {
    setLoading(true);
    setMsg('');
    try {
      const siteId = await api.getSiteId(token, siteUrl);
      const drives = await api.getDrives(token, siteId);
      const drive = drives.find(d => d.name === 'Documents') || drives[0];
      const docs = await api.fetchResumes(token, siteId, drive.id);
      setFiles(docs);
      setMsg(`Fetched ${docs.length} files`);
    } catch {
      setMsg('Error fetching documents');
    }
    setLoading(false);
  };

  const handleParseAll = async () => {
    setMsg('');
    const siteId = await api.getSiteId(token, siteUrl);
    const drives = await api.getDrives(token, siteId);
    const drive = drives.find(d => d.name === 'Documents') || drives[0];
    const newStatus = {};
    for (const file of files) {
      newStatus[file.id] = 'parsing';
      setStatusMap({ ...newStatus });
      try {
        await api.parseResumeApi(token, siteId, drive.id, file.id);
        newStatus[file.id] = 'done';
      } catch {
        newStatus[file.id] = 'error';
      }
      setStatusMap({ ...newStatus });
    }
    setMsg('Parsing complete');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-2">
        <input
          className="flex-1 p-2 border rounded"
          type="text"
          placeholder="https://yourdomain.sharepoint.com/sites/HR"
          value={siteUrl}
          onChange={e => setSiteUrl(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleFetch}
          disabled={loading || !siteUrl}
        >
          Fetch
        </button>
      </div>

      {files.length > 0 && (
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handleParseAll}
          disabled={loading}
        >
          Parse All
        </button>
      )}

      {msg && <p className="text-gray-700">{msg}</p>}

      <ul className="space-y-2">
        {files.map(f => (
          <li key={f.id} className="p-2 border rounded flex justify-between">
            <span>{f.name}</span>
            <span className="italic">
              {statusMap[f.id] || 'idle'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
