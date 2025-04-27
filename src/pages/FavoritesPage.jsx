// src/pages/FavoritesPage.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { getAllCountries } from '../services/api';
import CountryCard from '../components/Country/CountryCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all countries (we need this to display favorite country details)
        const allCountries = await getAllCountries();
        setCountries(allCountries);

        // Fetch user's favorites
        const docRef = doc(db, 'favorites', currentUser.uid);
        console.log(currentUser.uid);
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

  const favoriteCountries = countries.filter(country => 
    favorites.includes(country.cca3)
  );

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
      <h1 className="text-3xl font-bold text-secondary mb-8">Your Favorite Countries</h1>

      {favoriteCountries.length === 0 ? (
        <div className="glass p-8 text-center">
          <p className="text-secondary mb-4">You haven't added any countries to your favorites yet.</p>
          <p className="text-secondary/80">
            Go to the home page and click the star icon on countries you'd like to save.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteCountries.map(country => (
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
