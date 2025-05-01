import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCountryByCode, getCountriesByCodes } from '../services/api';

export default function CountryPage() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [borderLoading, setBorderLoading] = useState(false);

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

  useEffect(() => {
    async function fetchBorders() {
      if (!country || !country.borders || country.borders.length === 0) {
        setBorderCountries([]);
        return;
      }
      setBorderLoading(true);
      try {
        const data = await getCountriesByCodes(country.borders);
        setBorderCountries(data);
      } catch (err) {
        setBorderCountries([]);
      } finally {
        setBorderLoading(false);
      }
    }
    fetchBorders();
  }, [country]);

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
                  <div className="flex flex-row flex-wrap gap-4">
                    {(borderLoading || borderCountries.length < country.borders.length)
                      ? country.borders.map((border, idx) => {
                          const borderCountry = borderCountries.find(c => c.cca3 === border);
                          return borderCountry ? (
                            <Link
                              key={border}
                              to={`/country/${border}`}
                              className="block min-w-[140px] max-w-[180px] border border-primary/20 rounded-lg p-2 bg-white/60 shadow hover:shadow-md transition"
                            >
                              <div className="flex flex-col items-center">
                                <img
                                  src={borderCountry.flags.png}
                                  alt={`Flag of ${borderCountry.name.common}`}
                                  className="w-12 h-8 object-cover rounded mb-2"
                                />
                                <div className="text-xs font-semibold text-secondary text-center">
                                  {borderCountry.name.common}
                                </div>
                                <div className="text-[10px] text-secondary/70 text-center">
                                  Pop: {borderCountry.population.toLocaleString()}
                                </div>
                              </div>
                            </Link>
                          ) : (
                            <div
                              key={border}
                              className="block min-w-[140px] max-w-[180px] border border-primary/20 rounded-lg p-2 bg-white/60 shadow animate-pulse flex flex-col items-center justify-center"
                            >
                              <div className="w-12 h-8 bg-gray-300 rounded mb-2 shimmer" />
                              <div className="h-4 w-20 bg-gray-300 rounded mb-1 shimmer" />
                              <div className="h-3 w-16 bg-gray-200 rounded shimmer" />
                            </div>
                          );
                        })
                      : borderCountries.map(borderCountry => (
                          <Link
                            key={borderCountry.cca3}
                            to={`/country/${borderCountry.cca3}`}
                            className="block min-w-[140px] max-w-[180px] border border-primary/20 rounded-lg p-2 bg-white/60 shadow hover:shadow-md transition"
                          >
                            <div className="flex flex-col items-center">
                              <img
                                src={borderCountry.flags.png}
                                alt={`Flag of ${borderCountry.name.common}`}
                                className="w-12 h-8 object-cover rounded mb-2"
                              />
                              <div className="text-xs font-semibold text-secondary text-center">
                                {borderCountry.name.common}
                              </div>
                              <div className="text-[10px] text-secondary/70 text-center">
                                Pop: {borderCountry.population.toLocaleString()}
                              </div>
                            </div>
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

<style>{`
  .shimmer {
    position: relative;
    overflow: hidden;
  }
  .shimmer::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
    animation: shimmer 1.2s infinite;
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`}</style>
