import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function CountryPage() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // The API returns an array, so take the first element
        if (data && data.length > 0) {
          setCountry(data[0]);
        } else {
          setCountry(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch country details', err);
        setError('Could not load country data.');
        setLoading(false);
      });
  }, [code]); // Rerun effect when the country code in the URL changes

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (!country) {
    return (
      <div className="text-center mt-10">
        <p className="mb-4">Country not found.</p>
        <Link to="/" className="text-blue-500 hover:underline">Go to Home Page</Link>
      </div>
    );
  }

  // Helper to get language names
  const getLanguageNames = (languages) => {
    if (!languages) return 'N/A';
    return Object.values(languages).join(', ');
  };

  // Helper to get currency names (v3.1 returns currencies as an object)
   const getCurrencyNames = (currencies) => {
    if (!currencies) return 'N/A';
    return Object.values(currencies).map(currency => currency.name).join(', ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded shadow mb-8">&larr; Back</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={country.flags.png} alt={`Flag of ${country.name.common}`} className="w-full h-auto object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">{country.name.common}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold">Official Name:</span> {country.name.official}</p>
              <p><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
              <p><span className="font-semibold">Region:</span> {country.region}</p>
              <p><span className="font-semibold">Subregion:</span> {country.subregion || 'N/A'}</p>
            </div>
            <div>
              <p><span className="font-semibold">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
              <p><span className="font-semibold">Top Level Domain:</span> {country.tld?.[0] || 'N/A'}</p>
              <p><span className="font-semibold">Currencies:</span> {getCurrencyNames(country.currencies)}</p>
              <p><span className="font-semibold">Languages:</span> {getLanguageNames(country.languages)}</p>
            </div>
          </div>

          {country.borders && country.borders.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Border Countries:</h3>
              <div className="flex flex-wrap gap-2">
                {country.borders.map(borderCode => (
                  // Note: This just displays the code. To show names, you'd need to fetch border country details or look up from a cached list.
                  <span key={borderCode} className="bg-gray-200 text-gray-800 px-3 py-1 rounded shadow text-sm">{borderCode}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CountryPage;
