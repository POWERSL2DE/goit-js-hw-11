import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { renderImgs } from './js/render-functions';
import { fetchImg } from './js/pixabay-api';

export const setGallery = document.querySelector('ul.gallery');
export let imgset;
export let searchImgs;

// +++++++++++++++++++

const inputfield = document.querySelector('input');
const inputBtn = document.querySelector('button');
const fillForm = document.querySelector('form');

const preloader = document.querySelector('.preloader');

// loader begin==============

const showLoader = () => {
  preloader.style.display = 'flex';
};
const hideLoader = () => {
  preloader.style.display = 'none';
};
const handleLoad = () => {
  document.body.classList.add('loaded');
  document.body.classList.remove('loaded_hiding');
};

window.onload = handleLoad;
// +++++++++++++++++++
// Begin ++++++++++++++++
inputBtn.addEventListener('click', async event => {
  event.preventDefault();

  searchImgs = inputfield.value.trim();

  // control correct fill input

  if (!searchImgs.length) {
    iziToast.error({
      color: 'yellow',
      message: ` Please fill in the field for search query.`,
      position: 'topRight',
    });
    setGallery.innerHTML = '';
  }

  
  showLoader();
  try {

    const images = await fetchImg();

    imgset = images.hits;

    if (!imgset.length) {
      iziToast.error({
        color: 'red',
  
        message: `❌ Sorry, there are no images matching your search query. Please try again!`,
        position: 'topRight',
      });
    }


    renderImgs(images);
  } catch (error) {
    iziToast.error({
      color: 'red',
      message: `❌ Sorry, there was a mistake. Please try again!`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
    handleLoad();
  }
});