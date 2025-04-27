import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCountryByCode } from '../services/api';

export default function CountryPage() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCountry() {
      try {
        const [data] = await getCountryByCode(code);
        setCountry(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch country details');
        console.error('Error fetching country:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCountry();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 text-center">
          <p className="text-red-500 mb-4">{error || 'Country not found'}</p>
          <Link to="/" className="button-glass inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="button-glass inline-flex items-center mb-8">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </Link>

        <div className="glass p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative aspect-video">
              <img
                src={country.flags.png}
                alt={`Flag of ${country.name.common}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-secondary mb-8">
                {country.name.common}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-secondary">
                    <span className="font-medium">Official Name: </span>
                    {country.name.official}
                  </p>
                  <p className="text-secondary">
                    <span className="font-medium">Population: </span>
                    {country.population.toLocaleString()}
                  </p>
                  <p className="text-secondary">
                    <span className="font-medium">Region: </span>
                    {country.region}
                  </p>
                  <p className="text-secondary">
                    <span className="font-medium">Sub Region: </span>
                    {country.subregion || 'N/A'}
                  </p>
                  <p className="text-secondary">
                    <span className="font-medium">Capital: </span>
                    {country.capital?.[0] || 'N/A'}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-secondary">
                    <span className="font-medium">Top Level Domain: </span>
                    {country.tld?.[0] || 'N/A'}
                  </p>
                  <p className="text-secondary">
                    <span className="font-medium">Currencies: </span>
                    {Object.values(country.currencies || {})
                      .map(currency => currency.name)
                      .join(', ') || 'N/A'}
                  </p>
                  <p className="text-secondary">
                    <span className="font-medium">Languages: </span>
                    {Object.values(country.languages || {}).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>

              {country.borders && country.borders.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-secondary mb-4">
                    Border Countries:
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {country.borders.map(border => (
                      <Link
                        key={border}
                        to={`/country/${border}`}
                        className="button-glass text-sm"
                      >
                        {border}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
