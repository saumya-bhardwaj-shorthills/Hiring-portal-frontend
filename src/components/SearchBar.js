// src/components/SearchBar.js
import React from 'react';
import { TextInput } from 'flowbite-react';

const SearchBar = ({ searchText, setSearchText }) => {
  return (
    <div className="mb-4 max-w-sm">
      <TextInput
        placeholder="Type to search..."
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        className="border-indigo-600"
      />
    </div>
  );
};

export default SearchBar;
