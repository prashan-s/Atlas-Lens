import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('name');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query, type);
    }, 400);
    return () => clearTimeout(handler);
  }, [query, type, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, type);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-0">
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="input-glass rounded-r-none border-r-0 px-4 py-3 h-12 focus:z-10"
        >
          <option value="name">Name</option>
          <option value="code">Country Code</option>
          <option value="currency">Currency</option>
          <option value="language">Language</option>
        </select>
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search by ${type}...`}
            className="input-glass rounded-l-none pl-10 pr-4 py-3 h-12 w-full"
          />
        </div>
      </div>
    </form>
  );
} 