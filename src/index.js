import './css/styles.css';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  clearInfo();

  const countryForSearch = event.target.value.toLowerCase().trim();

  if (countryForSearch === '') {
    return;
  }

  fetchCountries(countryForSearch)
    .then(data => {
      if (data.status === 404) {
        return Promise.reject('Oops, there is no country with that name');
      }

      if (data.length === 1) {
        return renderMarkupCountryInfo(data);
      }

      if (data.length > 1 && data.length <= 10) {
        return renderMarkupCountryList(data);
      }

      if (data.length > 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => Notiflix.Notify.failure(error));
}

function renderMarkupCountryInfo(dataForMarkup) {
  dataForMarkup.map(({ flags, name, capital, population, languages }) => {
    const lang = Object.values(languages).join(', ');
    countryInfo.innerHTML = ` <div class="country-name-official"><img class="flag" src="${flags.svg}"  alt="${flags.alt}" width = 80>
    <p> ${name.official}</p></div>
      <p class="capital"><span>Country capital:</span> ${capital[0]}</p>
      <p class="population"><span>Population:</span> ${population}</p>
      <p class="languages"><span>Languages:</span> ${lang}</p>`;
  });
}

function renderMarkupCountryList(dataForMarkup) {
  dataForMarkup.map(({ flags, name }) => {
    countryList.insertAdjacentHTML(
      'afterbegin',
      `
    <li><img src="${flags.svg}" width = 80>
    <p class="country-name">${name.official}</p><li>
   `
    );
  });
}

function clearInfo() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
