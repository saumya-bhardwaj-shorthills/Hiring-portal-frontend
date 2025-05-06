import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useMsal } from '@azure/msal-react';
import * as api from '../api/sharepoint';

const columns = [
  { name: 'Name', selector: row => row.name, sortable: true },
  { name: 'Email', selector: row => row.email, sortable: true },
  { name: 'Phone', selector: row => row.phone, sortable: true },
];

export default function CandidateTable({ token, searchResults }) {
  const { instance, accounts } = useMsal();
  const [data, setData] = useState([]);

  // Whenever searchResults changes, use it.
  // Otherwise, fetch all candidates once we have a token.
  useEffect(() => {
    if (Array.isArray(searchResults)) {
      setData(searchResults);
    } else if (token) {
      api.getAllCandidates(token).then(setData);
    }
  }, [searchResults, token]);

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
