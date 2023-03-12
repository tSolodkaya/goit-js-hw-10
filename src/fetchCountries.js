const BASE_URL = 'https://restcountries.com/v3.1';
const FILTER_RESPONSE = 'fields=name,capital,population,flags,languages';
export default function fetchCountries(name) {
  return fetch(`${BASE_URL}/name/${name}?${FILTER_RESPONSE}

  `)
    .then(response => response.json())
    .catch(error => Notiflix.Notify.failure(error.message));
}
