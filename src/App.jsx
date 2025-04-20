import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import Tailwind CSS

function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('https://restcountries.com/v3.1/all')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setCountries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch countries', err);
        setError('Could not load country data.');
        setLoading(false);
      });
  }, []);

  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  // Hardcoded a few common languages for demonstration
  const commonLanguages = [
    { name: 'English', code: 'eng' },
    { name: 'Spanish', code: 'spa' },
    { name: 'French', code: 'fra' },
    { name: 'German', code: 'deu' },
    { name: 'Mandarin Chinese', code: 'zho' },
  ];

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.common.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter ? country.region === regionFilter : true;
    
    // Language filtering: check if any of the country's language codes match the filter
    const matchesLanguage = languageFilter 
      ? Object.values(country.languages || {}).some(lang => lang.toLowerCase().includes(languageFilter.toLowerCase()))
      : true;

    return matchesSearch && matchesRegion && matchesLanguage;
  });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">Countries Explorer</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by country name..."
          className="shadow appearance-none border rounded w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="shadow border rounded w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        >
          <option value="">Filter by Region</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>

         <select
          className="shadow border rounded w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        >
          <option value="">Filter by Language</option>
          {commonLanguages.map(lang => (
            <option key={lang.code} value={lang.name}>{lang.name}</option>
          ))}
        </select>

      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && filteredCountries.length === 0 && (searchQuery || regionFilter || languageFilter) && (
        <p className="text-center">No countries found matching your criteria.</p>
      )}

      {!loading && !error && filteredCountries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCountries.map(country => (
            <Link to={`/country/${country.cca3}`} key={country.cca3} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer">
              <img src={country.flags.png} alt={`Flag of ${country.name.common}`} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{country.name.common}</h2>
                <p className="text-gray-700">Capital: {country.capital?.[0] || 'N/A'}</p>
                <p className="text-gray-700">Region: {country.region}</p>
                <p className="text-gray-700">Population: {country.population.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
