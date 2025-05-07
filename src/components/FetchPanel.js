import React, { useEffect, useState } from 'react';
import { Button, TextInput, Label } from 'flowbite-react';
import * as api from '../api/sharepoint';

export default function FetchPanel({ token }) {
  const [sites, setSites] = useState([]);
  const [adding, setAdding] = useState(false);
  const [url, setUrl] = useState('');
  const [selected, setSelected] = useState(null);
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.listSites(token).then(setSites);
  }, [token]);

  const addSite = async () => {
    try {
      const s = await api.addSite(token, url);
      setSites(prev => [...prev, s]);
      setUrl(''); setAdding(false);
    } catch {
      setMsg('Error saving site');
    }
  };

  const selectSite = async s => {
    setSelected(s); setFiles([]); setStatus({}); setMsg('');
    try {
      const fs = await api.fetchSiteResumes(token, s.id);
      setFiles(fs);
      setMsg(`Found ${fs.length} resumes`);
    } catch {
      setMsg('Error fetching resumes');
    }
  };

  const parseAll = async () => {
    if (!selected) return;
    const m = {};
    for (let f of files) {
      m[f.id] = 'parsing'; setStatus({ ...m });
      try {
        await api.parseResumeApi(token, selected.site_id, selected.drive_id, f.id);
        m[f.id] = 'done';
      } catch {
        m[f.id] = 'error';
      }
      setStatus({ ...m });
    }
    setMsg('Parsing complete');
  };

  return (
    <div className="space-y-8">
      {/* SHAREPOINT SITES */}
      <div className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-600">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-indigo-800">SharePoint Sites</h3>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => setAdding(a => !a)}
          >
            {adding ? 'Cancel' : 'Add New Site'}
          </Button>
        </div>

        {adding && (
          <div className="flex items-end space-x-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="site-url" value="Site URL" />
              <TextInput
                id="site-url"
                placeholder="https://…/sites/HR"
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={addSite}
            >
              Save
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {sites.map(s => (
            <Button
              key={s.id}
              size="sm"
              outline={selected?.id !== s.id}
              className={`
                ${selected?.id === s.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-indigo-700 hover:bg-indigo-50'}
              `}
              onClick={() => selectSite(s)}
            >
              {s.site_url}
            </Button>
          ))}
        </div>
      </div>

      {/* RESUME LIST */}
      {selected && (
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-green-800">
              Resumes in {selected.site_url}
            </h3>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={parseAll}
            >
              Parse All
            </Button>
          </div>
          {msg && <p className="text-gray-600 mb-2">{msg}</p>}
          <ul className="space-y-2">
            {files.map(f => (
              <li key={f.id} className="flex justify-between text-gray-700">
                <span>{f.name}</span>
                <span className="italic">{status[f.id]||'idle'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
