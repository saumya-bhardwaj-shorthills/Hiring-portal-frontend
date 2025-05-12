// src/components/CandidateTable.js
import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { TextInput } from 'flowbite-react';
import Fuse from 'fuse.js';
import * as api from '../api/sharepoint';

export default function CandidateTable({ token }) {
  const [candidates, setCandidates] = useState([]);
  const [searchText, setSearchText] = useState('');

  // 🚀 Fetch all candidates once
  useEffect(() => {
  api.getAllCandidates(token)
    .then((data) => {
      console.log("API Response:", data); // ✅ Log the API response
      setCandidates(data);
    })
    .catch(console.error);
}, [token]);


  // 🚀 Prepare a list with a combined search string per candidate
  const list = useMemo(() => {
  return candidates.map(c => {
    // 🔹 Skills as a flat list
    const skills = Array.isArray(c.skills) ? c.skills.join(', ') : '';
    
    // 🔹 Domains classification (fix here)
    const domains = Array.isArray(c.domain_classification)
      ? c.domain_classification.join(', ')
      : '';
    
    // 🔹 Experience (convert to string if it's a float or number)
    const experience = (!isNaN(parseFloat(c.total_years_of_experience)))
      ? `${parseFloat(c.total_years_of_experience).toFixed(1)} years`
      : '0.0 years';
    
    // 🔹 Profile Summary
    const summary = c.profile_summary || '';

    // 🔹 Combined search string
    const haystack = [
      c.name,
      c.email,
      c.phone,
      skills,
      domains,
      experience,
      summary
    ]
      .filter(Boolean)
      .join(' ');
    return { ...c, haystack, experience, domains };
  });
}, [candidates]);


  const fuse = useMemo(() => {
    return new Fuse(list, {
      keys: ['haystack'],
      threshold: 0.3,
      distance: 100,
      ignoreLocation: true,
    });
  }, [list]);

  // 🚀 Filtered & sorted result
  const filtered = useMemo(() => {
  if (!searchText.trim()) {
    return list; // ✅ Now, it returns the fully formatted list
  }
  const results = fuse.search(searchText.trim());
  return results.map(r => r.item);
}, [searchText, fuse, list]);


  // 🚀 Table Columns
  const columns = [
  { name: 'Name', selector: r => r.name || '—', sortable: true, wrap: true },
  { name: 'Email', selector: r => r.email || '—', sortable: true },
  { name: 'Phone', selector: r => r.phone || '—', sortable: true },
  {
    name: 'Skills',
    selector: r => (Array.isArray(r.skills) ? r.skills.join(', ') : '—'),
    wrap: true,
  },
  {
    name: 'Domains',
    selector: r => (Array.isArray(r.domain_classification) ? r.domain_classification.join(', ') : '—'),
    wrap: true,
  },
  {
    name: 'Experience',
    selector: r => r.experience || '—',
    sortable: true,
    wrap: true,
  },
  {
    name: 'Profile Summary',
    selector: r => r.profile_summary || '—',
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

      {/* 🚀 Fuzzy search bar */}
      <div className="mb-4 max-w-sm">
        <TextInput
          placeholder="Fuzzy search (e.g. node, php, java, frontend, data engineer)..."
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
