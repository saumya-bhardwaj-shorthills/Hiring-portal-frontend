// src/components/Filters.js
import React, { useEffect, useState } from 'react';
import { Checkbox, TextInput, Button } from 'flowbite-react';

const Filters = ({ onApply, appliedFilters }) => {
  const [skills, setSkills] = useState([]);
  const [domains, setDomains] = useState([]);
  const [experience, setExperience] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [domainSearch, setDomainSearch] = useState('');

  // Common lists for skills and domains
  const commonSkills = ["Python", "JavaScript", "SQL", "React"];
  const commonDomains = [
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "Data Engineer",
  ];

  const experienceRanges = ["0-1 years", "1-3 years", "3+ years"];

  // 🚀 Sync with parent component's state
  useEffect(() => {
    setSkills(appliedFilters.skills);
    setDomains(appliedFilters.domains);
    setExperience(appliedFilters.experience);
  }, [appliedFilters]);

  // 🚀 Normalize Text Function (For flexible search matching)
  const normalizeText = (text) => {
    return text.toLowerCase().replace(/[\s-]+/g, ' ').trim();
  };

  // 🚀 Handle Skill Change (Real-time Update)
  const handleSkillChange = (skill) => {
    const updatedSkills = skills.includes(skill)
      ? skills.filter(s => s !== skill)
      : [...skills, skill];
    setSkills(updatedSkills);
    onApply({ skills: updatedSkills, domains, experience });
  };

  // 🚀 Handle Domain Change (Real-time Update)
  const handleDomainChange = (domain) => {
    const updatedDomains = domains.includes(domain)
      ? domains.filter(d => d !== domain)
      : [...domains, domain];
    setDomains(updatedDomains);
    onApply({ skills, domains: updatedDomains, experience });
  };

  // 🚀 Handle Experience Change (Real-time Update)
  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
    onApply({ skills, domains, experience: e.target.value });
  };

  // 🚀 Add a new Skill from Search Bar
  const addNewSkill = () => {
    if (skillSearch.trim() !== '' && !skills.includes(skillSearch.trim())) {
      const updatedSkills = [...skills, skillSearch.trim()];
      setSkills(updatedSkills);
      onApply({ skills: updatedSkills, domains, experience });
      setSkillSearch(''); // Clear the search bar
    }
  };

  // 🚀 Trigger add skill if user presses Enter
  const handleSkillEnter = (e) => {
    if (e.key === 'Enter') {
      addNewSkill();
    }
  };

  // 🚀 Flexible Search Logic for Skills and Domains
  const filteredSkills = commonSkills.filter(skill => 
    normalizeText(skill).includes(normalizeText(skillSearch))
  );

  const filteredDomains = commonDomains.filter(domain =>
    normalizeText(domain).includes(normalizeText(domainSearch))
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 space-y-4">
      <h4 className="text-lg font-semibold mb-2">Filters</h4>

      {/* 🚀 Skills Filter */}
      <div>
        <h5 className="font-medium mb-1">Skills</h5>
        <div className="flex gap-2">
          <TextInput
            placeholder="Search or add skill..."
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            onKeyDown={handleSkillEnter}
            className="mb-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {filteredSkills.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={skills.includes(skill)}
                onChange={() => handleSkillChange(skill)}
                className="mr-2"
              />
              <label htmlFor={skill} className="text-sm">{skill}</label>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 Domains Filter */}
      <div>
        <h5 className="font-medium mb-1">Domains</h5>
        <TextInput
          placeholder="Search domains..."
          value={domainSearch}
          onChange={(e) => setDomainSearch(e.target.value)}
          className="mb-2"
        />
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {filteredDomains.map((domain) => (
            <div key={domain} className="flex items-center space-x-2">
              <Checkbox
                id={domain}
                checked={domains.includes(domain)}
                onChange={() => handleDomainChange(domain)}
                className="mr-2"
              />
              <label htmlFor={domain} className="text-sm">{domain}</label>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 Experience Filter */}
      <div>
        <h5 className="font-medium mb-1">Experience</h5>
        <select
          className="border p-2 rounded w-full"
          onChange={handleExperienceChange}
          value={experience}
        >
          <option value="">Select Experience Range</option>
          {experienceRanges.map((range, index) => (
            <option key={index} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
