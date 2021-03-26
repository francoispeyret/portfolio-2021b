import Swiper, { Scrollbar, HashNavigation, Mousewheel, Navigation } from 'swiper/core';
Swiper.use([Scrollbar, HashNavigation, Mousewheel, Navigation]);

import 'swiper/swiper.scss';

const worksSwiper = new Swiper('.swiper-container', {
    // Optional parameters
    loop: false,
    slidesPerView: 1,
    hashNavigation: true,
    longSwipes: true,
    spaceBetween: 60,

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

