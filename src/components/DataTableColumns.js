// src/components/DataTableColumns.js
import React from 'react';

const DataTableColumns = (searchText) => [
  { name: 'Name', selector: r => r.name || '—', sortable: true, wrap: true },
  { name: 'Email', selector: r => r.email || '—', sortable: true },
  { name: 'Phone', selector: r => r.phone || '—', sortable: true },
  { name: 'Skills', selector: r => r.skills || '—', wrap: true },
  { name: 'Domains', selector: r => r.domains || '—', wrap: true },
  { name: 'Experience', selector: r => r.experience || '—', sortable: true, wrap: true },
  { name: 'Profile Summary', selector: r => r.profile_summary || '—', wrap: true },
];

export default DataTableColumns;
