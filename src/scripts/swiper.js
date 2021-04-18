import Swiper, { Scrollbar, HashNavigation, Mousewheel, Navigation } from 'swiper/core';
Swiper.use([Scrollbar, HashNavigation, Mousewheel, Navigation]);

import 'swiper/swiper.scss';

const swiperEls = document.querySelectorAll('.swiper-container');

for(let swiper of swiperEls) {
    const slidesPerView = parseFloat(swiper.getAttribute('data-slide-per-view') || 1);
    new Swiper(swiper, {
        // Optional parameters
        loop: false,
        direction: 'horizontal',
        slidesPerView: 1,
        spaceBetween: 20,

        breakpoints: {
            769: {
                slidesPerView: slidesPerView,
                spaceBetween: 60,
            }
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
            hide: false,
        },
    });

}
