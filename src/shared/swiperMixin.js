export const operatorSwiper = {
  data() {
    return {
      // swiper
      swiperOption: {
        centeredSlides: true,
        slidesPerView: "auto",
        allowTouchMove: true,
        noSwipingSelector: "ul",
        slideToClickedSlide: false,
        keyboard: {
          enabled: true,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          renderBullet(index, className) {
            return `<span class="${className} swiper-pagination-bullet-custom">${index +
              1}</span>`;
          },
        },
      },
    };
  },
}

export const editorSwiper = {
  data() {
    return {
      // swiper
      swiperOption: {
        centeredSlides: true,
        slidesPerView: "auto",
        allowTouchMove: true,
        noSwipingSelector: ".list-group-item, input",
        slideToClickedSlide: false,
        onSlideChangeEnd: function() {
          this.onSwipe();
        },
        keyboard: {
          enabled: true,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          renderBullet(index, className) {
            return `<span class="${className} swiper-pagination-bullet-custom">${index +
              1}</span>`;
          },
        },
      },
      // draggable
      drag: false,
      enabled: true,  
    };
  },
}
