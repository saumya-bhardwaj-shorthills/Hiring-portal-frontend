// src/components/CandidateTable.js
import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import Filters from './Filter';
import SearchBar from './SearchBar';
import FilterTags from './FilterTags';
import DataTableColumns from './DataTableColumns';
import Fuse from 'fuse.js';
import * as api from '../api/sharepoint';

export default function CandidateTable({ token }) {
  const [candidates, setCandidates] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({ skills: [], domains: [], experience: '' });

  // 🚀 Fetch all candidates once
  useEffect(() => {
    api.getAllCandidates(token)
      .then((data) => {
        console.log("API Response:", data);
        setCandidates(data);
      })
      .catch(console.error);
  }, [token]);

  // 🚀 Prepare a list with a combined search string per candidate
  const list = useMemo(() => {
    return candidates.map(c => {
      const skills = Array.isArray(c.skills) ? c.skills.join(', ') : '';
      const domains = Array.isArray(c.domain_classification)
        ? c.domain_classification.join(', ')
        : '';
      const experience = (!isNaN(parseFloat(c.total_years_of_experience)))
        ? `${parseFloat(c.total_years_of_experience).toFixed(1)} years`
        : '0.0 years';

      const summary = c.profile_summary || '';
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

      return { ...c, haystack, experience, domains, skills };
    });
  }, [candidates]);

  // 🚀 Fuzzy search configuration
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
    let result = list;

    if (searchText.trim()) {
      const searchTerms = searchText.split(/[ ,]+/).filter(Boolean);
      const results = [];
      searchTerms.forEach(term => {
        const fuseResults = fuse.search(term.trim());
        fuseResults.forEach(r => {
          if (!results.some(res => res.id === r.item.id)) {
            results.push(r.item);
          }
        });
      });
      result = results;
    }

    if (filters.skills.length > 0) {
      result = result.filter(c => 
        filters.skills.some(skill => c.skills.includes(skill))
      );
    }

    if (filters.domains.length > 0) {
      result = result.filter(c => 
        filters.domains.some(domain => c.domains.includes(domain))
      );
    }

    if (filters.experience) {
      if (filters.experience === '0-1 years') result = result.filter(c => parseFloat(c.total_years_of_experience) <= 1);
      if (filters.experience === '1-3 years') result = result.filter(c => parseFloat(c.total_years_of_experience) > 1 && parseFloat(c.total_years_of_experience) <= 3);
      if (filters.experience === '3+ years') result = result.filter(c => parseFloat(c.total_years_of_experience) > 3);
    }

    return result;
  }, [searchText, fuse, list, filters]);

  // 🚀 Real-time update for Filters
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
      <Filters onApply={handleFiltersChange} appliedFilters={filters} />
      <FilterTags filters={filters} setFilters={setFilters} />
      <SearchBar searchText={searchText} setSearchText={setSearchText} />
      <DataTable
        columns={DataTableColumns(searchText)}
        data={filtered}
        pagination
        highlightOnHover
        striped
        noHeader
      />
    </div>
  );
}
