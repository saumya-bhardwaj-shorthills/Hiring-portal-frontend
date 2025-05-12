// src/components/FilterTags.js
import React from 'react';
import { Button } from 'flowbite-react';

const FilterTags = ({ filters, setFilters }) => {
  const removeFilter = (type, value) => {
    setFilters(prev => {
      if (type === 'skills') {
        return { ...prev, skills: prev.skills.filter(s => s !== value) };
      }
      if (type === 'domains') {
        return { ...prev, domains: prev.domains.filter(d => d !== value) };
      }
      if (type === 'experience') {
        return { ...prev, experience: '' };
      }
      return prev;
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.skills.map(skill => (
        <div key={skill} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center space-x-2">
          <span>{skill}</span>
          <Button size="xs" color="red" onClick={() => removeFilter('skills', skill)}>❌</Button>
        </div>
      ))}
      {filters.domains.map(domain => (
        <div key={domain} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center space-x-2">
          <span>{domain}</span>
          <Button size="xs" color="red" onClick={() => removeFilter('domains', domain)}>❌</Button>
        </div>
      ))}
      {filters.experience && (
        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center space-x-2">
          <span>{filters.experience}</span>
          <Button size="xs" color="red" onClick={() => removeFilter('experience', filters.experience)}>❌</Button>
        </div>
      )}
    </div>
  );
};

export default FilterTags;
