const BASE_URL = 'https://restcountries.com/v3.1';

export async function getAllCountries() {
  const response = await fetch(`${BASE_URL}/all`);
  if (!response.ok) throw new Error('Failed to fetch countries');
  return response.json();
}

export async function getCountryByName(name) {
  const response = await fetch(`${BASE_URL}/name/${name}`);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error('Failed to fetch country by name');
  }
  return response.json();
}

export async function getCountriesByRegion(region) {
  const response = await fetch(`${BASE_URL}/region/${region}`);
  if (!response.ok) throw new Error('Failed to fetch countries by region');
  return response.json();
}

export async function getCountryByCode(code) {
  const response = await fetch(`${BASE_URL}/alpha/${code}`);
  if (!response.ok) throw new Error('Failed to fetch country by code');
  return response.json();
}

export async function getCountriesByCurrency(currency) {
  const response = await fetch(`${BASE_URL}/currency/${currency}`);
  if (!response.ok) throw new Error('Failed to fetch countries by currency');
  return response.json();
}

export async function getCountriesByLanguage(language) {
  const response = await fetch(`${BASE_URL}/lang/${language}`);
  if (!response.ok) throw new Error('Failed to fetch countries by language');
  return response.json();
}

export async function getCountriesByCodes(codes) {
  // codes: array of country codes (e.g., ["FRA", "DEU"])
  const joined = codes.join(",");
  const response = await fetch(`${BASE_URL}/alpha?codes=${joined}`);
  if (!response.ok) throw new Error('Failed to fetch countries by codes');
  return response.json();
} 