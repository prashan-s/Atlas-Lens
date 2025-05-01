import { useState, useEffect } from 'react';
import { getAllCountries, getCountriesByCurrency } from '../services/api';
import SearchBar from '../components/UI/SearchBar';
import CountryCard from '../components/Country/CountryCard';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSubregion, setSelectedSubregion] = useState('');
  const [favorites, setFavorites] = useState([]);
  const { currentUser } = useAuth();
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchType, setSearchType] = useState('name');

  useEffect(() => {
    fetchCountries();
    if (currentUser) {
      fetchFavorites();
    }
  }, [currentUser]);

  useEffect(() => {
    setFilteredCountries(countries);
  }, [countries]);

  async function fetchCountries() {
    try {
      const data = await getAllCountries();
      setCountries(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch countries');
      console.error('Error fetching countries:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFavorites() {
    if (!currentUser) return;
    try {
      const docRef = doc(db, 'favorites', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFavorites(docSnap.data().countryCodes || []);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  }

  async function handleToggleFavorite(countryCode) {
    if (!currentUser) return;
    
    try {
      const newFavorites = favorites.includes(countryCode)
        ? favorites.filter(code => code !== countryCode)
        : [...favorites, countryCode];
      
      await setDoc(doc(db, 'favorites', currentUser.uid), {
        countryCodes: newFavorites
      });
      
      setFavorites(newFavorites);
    } catch (err) {
      console.error('Error updating favorites:', err);
    }
  }

  async function handleSearch(query, type = 'name') {
    setSearchQuery(query);
    setSearchType(type);
    if (!query) {
      setFilteredCountries(countries);
      return;
    }
    let results = [];
    if (type === 'name') {
      results = countries.filter(c =>
        c.name.common.toLowerCase().includes(query.toLowerCase())
      );
    } else if (type === 'code') {
      results = countries.filter(c =>
        c.cca3.toLowerCase() === query.toLowerCase() ||
        c.cca2.toLowerCase() === query.toLowerCase()
      );
    } else if (type === 'currency') {
      // Try to filter from cached data first
      results = countries.filter(c =>
        c.currencies && Object.entries(c.currencies).some(
          ([code, curr]) =>
            code.toLowerCase() === query.toLowerCase() ||
            curr.name.toLowerCase().includes(query.toLowerCase()) ||
            (curr.symbol && curr.symbol.toLowerCase() === query.toLowerCase())
        )
      );
      // If not found, fallback to API
      if (results.length === 0) {
        try {
          results = await getCountriesByCurrency(query);
        } catch (err) {
          // ignore error, will show no results
        }
      }
    }
    setFilteredCountries(results);
  }

  const regions = [...new Set(countries.map(country => country.region))];
  const subregions = selectedRegion
    ? [...new Set(countries.filter(c => c.region === selectedRegion).map(c => c.subregion).filter(Boolean))]
    : [...new Set(countries.map(c => c.subregion).filter(Boolean))];

  const regionFilteredCountries = filteredCountries.filter(country => {
    const matchesRegion = !selectedRegion || country.region === selectedRegion;
    const matchesSubregion = !selectedSubregion || country.subregion === selectedSubregion;
    return matchesRegion && matchesSubregion;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchCountries} className="button-glass">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="mb-8 space-y-4">
        <SearchBar onSearch={handleSearch} />
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedSubregion('');
            }}
            className="input-glass"
          >
            <option value="">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <select
            value={selectedSubregion}
            onChange={(e) => setSelectedSubregion(e.target.value)}
            className="input-glass"
          >
            <option value="">All Subregions</option>
            {subregions.map(subregion => (
              <option key={subregion} value={subregion}>
                {subregion}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {regionFilteredCountries.map(country => (
          <CountryCard
            key={country.cca3}
            country={country}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.includes(country.cca3)}
          />
        ))}
      </div>

      {regionFilteredCountries.length === 0 && (
        <div className="glass p-8 text-center">
          <p className="text-secondary">No countries found matching your criteria.</p>
        </div>
      )}
    </div>
  );
} 