// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

// Описаний у документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";


const form = document.querySelector(".form");
const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");


let query;

const galleryLightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
    nav: true,
    close: true,
    enableKeyboard: true,
    docClose: true,
});

function searchImages(searchQuery) {
    const searchParams = new URLSearchParams({
    key: "41672793-a8580f18ed6f224a15f8d2674",
    q: searchQuery,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
});

   return fetch(`https://pixabay.com/api/?${searchParams}`) 
    .then((response) => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
    }


form.addEventListener("submit", (event) => {
    event.preventDefault();
    gallery.innerHTML = '';
    loader.classList.remove('visible');
    query = event.target.elements.search.value.trim();

    if (!query) {
        iziToast.error({
        title: "Error",
        message: "Sorry, imput is empty!",
        position: "topRight",
        });
        loader.classList.add('visible');
        return;
    }

    searchImages(query)
    .then(({ hits }) => {
        if (hits.length === 0) {
        iziToast.error({
        title: "Error",
        message: "❌ Sorry, there are no images matching your search query. Please try again!",
        position: "topRight",
        messageColor: "#ffffff",
        titleColor: "#ffffff",
        iconColor: "#ffffff",
        backgroundColor: "#EF4040",
        });   
            return;
        } 

    const renderImages = hits.reduce((html, hit) => {
        return (html + 
        `<li class="gallery-item"> 
        <a class="gallery-link" href="${hit.largeImageURL}">
        <img class="gallery-image" src="${hit.webformatURL}" alt="${hit.tags}"/></a>
        <div class="gallery-info">
        <p>likes: ${hit.likes}</p> 
        <p>views: ${hit.views}</p>
        <p>comments: ${hit.comments}</p>
        <p>downloads: ${hit.downloads}</p>
        </div>
        </li>`);
    }, "")

    gallery.innerHTML = renderImages;
    galleryLightbox.refresh();
        })  

    .catch((error) => console.log(error))
    .finally(() => {
    loader.classList.add('visible');
    });

    event.currentTarget.reset();
    })