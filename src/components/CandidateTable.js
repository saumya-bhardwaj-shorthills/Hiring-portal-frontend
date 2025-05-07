import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { TextInput } from 'flowbite-react';
import * as api from '../api/sharepoint';

export default function CandidateTable({ token }) {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.getAllCandidates(token).then(setData);
  }, [token]);

  const filtered = data.filter(c =>
    `${c.name} ${c.email} ${c.phone} ${JSON.stringify(c.skills)} ${c.profile_summary}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const columns = [
    { name: 'Name', selector: r => r.name, sortable: true, wrap: true },
    { name: 'Email', selector: r => r.email, sortable: true },
    { name: 'Phone', selector: r => r.phone, sortable: true },
    {
      name: 'Skills',
      cell: r => {
        const sk = r.skills || {};
        return Array.isArray(sk)
          ? sk.join(', ')
          : Object.entries(sk)
              .map(([k, v]) => `${k}: ${v.join(', ')}`)
              .join('; ');
      },
      wrap: true,
    },
    {
      name: 'Profile Summary',
      selector: r => r.profile_summary,
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

  const subHeaderComponent = (
    <TextInput
      placeholder="Search candidates..."
      value={filter}
      onChange={e => setFilter(e.target.value)}
      className="max-w-sm mb-4 border-indigo-600"
    />
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
      <h3 className="text-lg font-semibold text-yellow-700 mb-4">Candidates</h3>
      <DataTable
        columns={columns}
        data={filtered}
        pagination
        highlightOnHover
        striped
        subHeader
        subHeaderComponent={subHeaderComponent}
        noHeader
      />
    </div>
  );
}
