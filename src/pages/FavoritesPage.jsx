import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { getAllCountries, getCountriesByCurrency, getCountriesByLanguage } from '../services/api';
import CountryCard from '../components/Country/CountryCard';

export default function FavoritesPage({ onSearchRef }) {
  const [favorites, setFavorites] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const allCountries = await getAllCountries();
        setCountries(allCountries);
        const docRef = doc(db, 'favorites', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFavorites(docSnap.data().countryCodes || []);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch favorites');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    setFilteredCountries(countries.filter(country => favorites.includes(country.cca3)));
  }, [countries, favorites]);

  async function handleToggleFavorite(countryCode) {
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

  // Search/filter handler for the search bar
  const handleSearch = async (query, type = 'name') => {
    let favCountries = countries.filter(country => favorites.includes(country.cca3));
    if (!query) {
      setFilteredCountries(favCountries);
      return;
    }
    let results = [];
    if (type === 'name') {
      results = favCountries.filter(c =>
        c.name.common.toLowerCase().includes(query.toLowerCase())
      );
    } else if (type === 'code') {
      results = favCountries.filter(c =>
        c.cca3.toLowerCase() === query.toLowerCase() ||
        c.cca2.toLowerCase() === query.toLowerCase()
      );
    } else if (type === 'currency') {
      results = favCountries.filter(c =>
        c.currencies && Object.entries(c.currencies).some(
          ([code, curr]) =>
            code.toLowerCase() === query.toLowerCase() ||
            curr.name.toLowerCase().includes(query.toLowerCase()) ||
            (curr.symbol && curr.symbol.toLowerCase() === query.toLowerCase())
        )
      );
      if (results.length === 0) {
        try {
          results = (await getCountriesByCurrency(query)).filter(c => favorites.includes(c.cca3));
        } catch (err) {}
      }
    } else if (type === 'language') {
      results = favCountries.filter(c =>
        c.languages && Object.entries(c.languages).some(
          ([code, lang]) =>
            code.toLowerCase() === query.toLowerCase() ||
            lang.toLowerCase().includes(query.toLowerCase())
        )
      );
      if (results.length === 0) {
        try {
          results = (await getCountriesByLanguage(query)).filter(c => favorites.includes(c.cca3));
        } catch (err) {}
      }
    }
    setFilteredCountries(results);
  };

  // Expose the search handler via ref
  useEffect(() => {
    if (onSearchRef) {
      onSearchRef.current = handleSearch;
      return () => {
        onSearchRef.current = null;
      };
    }
  }, [onSearchRef, handleSearch]);

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
          <button onClick={() => window.location.reload()} className="button-glass">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <h1 className="text-3xl font-bold text-secondary mb-8 mt-10">Your Favorite Countries</h1>
      {filteredCountries.length === 0 ? (
        <div className="glass p-8 text-center">
          <p className="text-secondary mb-4">You haven't added any countries to your favorites yet.</p>
          <p className="text-secondary/80">
            Go to the home page and click the star icon on countries you'd like to save.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCountries.map(country => (
            <CountryCard
              key={country.cca3}
              country={country}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
