// src/components/CandidateTable.js
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useMsal } from '@azure/msal-react';
import * as api from '../api/sharepoint';

export default function CandidateTable({ token, searchResults }) {
  const { instance, accounts } = useMsal();
  const [data, setData] = useState([]);

  const columns = [
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Phone', selector: row => row.phone, sortable: true },
    {
      name: 'Resume',
      cell: row => (
        row.resume_url
          ? (
            <a
              href={row.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Resume
            </a>
          )
          : '—'
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  useEffect(() => {
    if (Array.isArray(searchResults)) {
      setData(searchResults);
    } else if (token) {
      api.getAllCandidates(token).then(setData);
    }
  }, [searchResults, token, instance, accounts]);

  return (
    <div className="p-4">
      <DataTable
        title={searchResults ? `Search Results (${data.length})` : `All Candidates (${data.length})`}
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
}
