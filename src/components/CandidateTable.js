// src/components/CandidateTable.js
import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { TextInput } from 'flowbite-react';
import Fuse from 'fuse.js';
import * as api from '../api/sharepoint';

export default function CandidateTable({ token }) {
  const [candidates, setCandidates] = useState([]);
  const [searchText, setSearchText] = useState('');

  // Fetch all candidates once
  useEffect(() => {
    api.getAllCandidates(token).then(setCandidates).catch(console.error);
  }, [token]);

  // Prepare a list with a combined search string per candidate
  const list = useMemo(() => {
    return candidates.map(c => {
      // build a single string containing all searchable fields
      const skills = Array.isArray(c.skills)
        ? c.skills.join(', ')
        : Object.entries(c.skills || {})
            .map(([cat, items]) => items.join(', '))
            .join(' ');
      const summary = c.profile_summary || '';
      const haystack = [
        c.name,
        c.email,
        c.phone,
        skills,
        summary
      ]
        .filter(Boolean)
        .join(' ');
      return { ...c, haystack };
    });
  }, [candidates]);

  // Initialize Fuse on that list
  const fuse = useMemo(() => {
    return new Fuse(list, {
      keys: ['haystack'],
      threshold: 0.3,            // tweak between 0 (strict) and 1 (very fuzzy)
      distance: 100,
      ignoreLocation: true,
    });
  }, [list]);

  // Filtered & sorted result
  const filtered = useMemo(() => {
    if (!searchText.trim()) {
      return candidates;
    }
    const results = fuse.search(searchText.trim());
    return results.map(r => r.item);
  }, [searchText, fuse, candidates]);

  const columns = [
    { name: 'Name', selector: r => r.name || '—', sortable: true, wrap: true },
    { name: 'Email', selector: r => r.email || '—', sortable: true },
    { name: 'Phone', selector: r => r.phone || '—', sortable: true },
    {
      name: 'Skills',
      cell: r => {
        const sk = r.skills ?? [];
        if (Array.isArray(sk)) return sk.join(', ');
        // fallback nested skills object
        return Object.entries(r.parsed_data?.skills || {}).map(
          ([cat, arr]) => `${cat}: ${arr.join(', ')}`
        ).join('; ');
      },
      wrap: true,
    },
    {
      name: 'Profile Summary',
      selector: r => r.profile_summary || r.parsed_data?.profile_summary || '—',
      wrap: true,
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
      button: true,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
      <h3 className="text-xl font-semibold text-yellow-700 mb-4">
        Candidates
      </h3>

      {/* Fuzzy search bar (short width) */}
      <div className="mb-4 max-w-sm">
        <TextInput
          placeholder="Fuzzy search (e.g. node, php, java)..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="border-indigo-600"
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
