import Swiper, { Scrollbar, HashNavigation, Mousewheel, Navigation } from 'swiper/core';
Swiper.use([Scrollbar, HashNavigation, Mousewheel, Navigation]);

import 'swiper/swiper.scss';

const worksSwiper = new Swiper('.swiper-container', {
    // Optional parameters
    loop: false,
    slidesPerView: 2,
    hashNavigation: true,
    longSwipes: true,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    mousewheel: {
        forceToAxis: false,
        releaseOnEdges: true,
        eventsTarget: document.getElementById('works'),
    },

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
        hide: false,
    },
});

