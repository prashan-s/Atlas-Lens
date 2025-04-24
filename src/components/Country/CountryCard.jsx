import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function CountryCard({ country, onToggleFavorite, isFavorite }) {
  const { currentUser } = useAuth();

  return (
    <Link to={`/country/${country.cca3}`} className="block">
      <div className="card-glass group">
        <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-secondary mb-2">
              {country.name.common}
            </h3>
            <div className="space-y-1 text-sm text-secondary/80">
              <p><span className="font-medium">Population:</span> {country.population.toLocaleString()}</p>
              <p><span className="font-medium">Region:</span> {country.region}</p>
              <p><span className="font-medium">Capital:</span> {country.capital?.[0]}</p>
            </div>
          </div>
          
          {currentUser && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(country.cca3);
              }}
              className="text-2xl text-secondary hover:text-primary transition-colors"
            >
              {isFavorite ? '★' : '☆'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
} 