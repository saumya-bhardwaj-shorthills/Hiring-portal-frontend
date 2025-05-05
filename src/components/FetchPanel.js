import React, { useState } from 'react';
import * as api from '../api/sharepoint';

export default function FetchPanel({ token }) {
  const [siteUrl, setSiteUrl] = useState('');
  const [files, setFiles] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

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
    } finally {
      setLoading(false);
    }
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
    <div>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Enter SharePoint Site URL"
          value={siteUrl}
          onChange={e => setSiteUrl(e.target.value)}
          style={{ width: '60%', padding: 8, marginRight: 8 }}
        />
        <button onClick={handleFetch} disabled={loading || !siteUrl}>
          Fetch Documents
        </button>
      </div>

      {files.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={handleParseAll} disabled={loading}>
            Parse All
          </button>
        </div>
      )}

      {msg && <p>{msg}</p>}

      <ul>
        {files.map(file => (
          <li key={file.id} style={{ marginBottom: 8 }}>
            {file.name} — <em>{statusMap[file.id] || 'idle'}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
