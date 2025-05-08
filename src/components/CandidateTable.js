// src/components/CandidateTable.js
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { TextInput } from 'flowbite-react';
import * as api from '../api/sharepoint';

export default function CandidateTable({ token }) {
  const [candidates, setCandidates] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    api.getAllCandidates(token)
      .then(setCandidates)
      .catch(console.error);
  }, [token]);

  const keywords = searchText
    .split(/[,\s]+/)
    .map(k => k.trim().toLowerCase())
    .filter(k => k);

  const filtered = React.useMemo(() => {
    if (!keywords.length) return candidates;

    return candidates
      .map(c => {
        const hay = [
          c.name,
          c.email,
          c.phone,
          JSON.stringify(c.skills || c.parsed_data?.skills || {}),
          c.profile_summary || c.parsed_data?.profile_summary || ''
        ].join(' ').toLowerCase();

        const score = keywords.reduce(
          (cnt, kw) => (hay.includes(kw) ? cnt + 1 : cnt),
          0
        );
        return { c, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.c);
  }, [candidates, keywords]);

  const columns = [
    { name: 'Name', selector: r => r.name || '—', sortable: true, wrap: true },
    { name: 'Email', selector: r => r.email || '—', sortable: true },
    { name: 'Phone', selector: r => r.phone || '—', sortable: true },
    {
      name: 'Skills',
      cell: r => {
        const sk = r.skills ?? r.parsed_data?.skills ?? {};
        if (Array.isArray(sk)) return sk.join(', ');
        return Object.entries(sk)
          .map(([cat, list]) => `${cat}: ${list.join(', ')}`)
          .join('; ');
      },
      wrap: true
    },
    {
      name: 'Profile Summary',
      selector: r => r.profile_summary || r.parsed_data?.profile_summary || '—',
      wrap: true
    },
    {
      name: 'Resume',
      cell: r =>
        r.resume_url ? (
          <a
            href={r.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            View
          </a>
        ) : (
          '—'
        ),
      ignoreRowClick: true,
      button: true
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
      <h3 className="text-xl font-semibold text-yellow-700 mb-4">Candidates</h3>

      {/* Shorter search bar */}
      <div className="mb-4">
        <TextInput
          placeholder="Search (e.g. node, php, java)..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="border-indigo-600 max-w-sm"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        pagination
        highlightOnHover
        striped
        noHeader
      />
    </div>
  );
}
