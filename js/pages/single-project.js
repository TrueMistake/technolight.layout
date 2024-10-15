const initProjectVideo = () => {
    const btns = Array.from(document.querySelectorAll('.project__video'))

    if (btns.length === 0) return

    btns.forEach(el => {
        el.addEventListener('click', function() {
            const iframe = this.querySelector('iframe')
            const poster = this.querySelector('.poster')
            const play = this.querySelector('.button-play')

            if (!iframe) return

            poster.classList.add('unshowing')
            iframe.src = iframe.dataset.src + "&autoplay=true"

            setTimeout(() => {
                poster.classList.add('hide')
                play.classList.add('hide')
            }, 1100)
        })
    })
}

const setNumberToNode = (num, node) => {
    node.innerText = num
}

const initProjectSwiper = () => {
    new Swiper('.project__collage .swiper', {
        loop: false,
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
        spaceBetween: 10,
        // freeMode: true,
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true
        },
        // navigation: {
        //     prevEl: '.project__collage-page_current',
        //     nextEl: '.project__collage-page_all',
        // },
        breakpoints: {
            1440: {
                spaceBetween: 20
            },
        },
        on: {
            init: function () {
                // const nodeAll = document.querySelector('.project__collage-page_all')
                // const nodeCurrent = document.querySelector('.project__collage-page_current')
                // const count = this.slides.length
                // setNumberToNode(count, nodeAll)
                // setNumberToNode(this.realIndex + 1, nodeCurrent)
            },
            // slideChange: function () {
            //     const nodeCurrent = document.querySelector('.project__collage-page_current')
            //     setTimeout(() => {
            //         setNumberToNode(this.realIndex + 1, nodeCurrent)
            //     }, 100)
            // }
        }
    });
}

window.addEventListener('load', () => {
    initProjectVideo()
    initProjectSwiper()

    // Initialazing fancybox gallery
    Fancybox.bind('[data-fancybox="post-collage"]');
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzaW5nbGUtcHJvamVjdC9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaW5pdFByb2plY3RWaWRlbyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9qZWN0X192aWRlbycpKVxyXG5cclxuICAgIGlmIChidG5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb25zdCBpZnJhbWUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2lmcmFtZScpXHJcbiAgICAgICAgICAgIGNvbnN0IHBvc3RlciA9IHRoaXMucXVlcnlTZWxlY3RvcignLnBvc3RlcicpXHJcbiAgICAgICAgICAgIGNvbnN0IHBsYXkgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5idXR0b24tcGxheScpXHJcblxyXG4gICAgICAgICAgICBpZiAoIWlmcmFtZSkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBwb3N0ZXIuY2xhc3NMaXN0LmFkZCgndW5zaG93aW5nJylcclxuICAgICAgICAgICAgaWZyYW1lLnNyYyA9IGlmcmFtZS5kYXRhc2V0LnNyYyArIFwiJmF1dG9wbGF5PXRydWVcIlxyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwb3N0ZXIuY2xhc3NMaXN0LmFkZCgnaGlkZScpXHJcbiAgICAgICAgICAgICAgICBwbGF5LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxyXG4gICAgICAgICAgICB9LCAxMTAwKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBzZXROdW1iZXJUb05vZGUgPSAobnVtLCBub2RlKSA9PiB7XHJcbiAgICBub2RlLmlubmVyVGV4dCA9IG51bVxyXG59XHJcblxyXG5jb25zdCBpbml0UHJvamVjdFN3aXBlciA9ICgpID0+IHtcclxuICAgIG5ldyBTd2lwZXIoJy5wcm9qZWN0X19jb2xsYWdlIC5zd2lwZXInLCB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgIG9ic2VydmVyOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVQYXJlbnRzOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVTbGlkZUNoaWxkcmVuOiB0cnVlLFxyXG4gICAgICAgIHdhdGNoT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiAxMCxcclxuICAgICAgICAvLyBmcmVlTW9kZTogdHJ1ZSxcclxuICAgICAgICBzY3JvbGxiYXI6IHtcclxuICAgICAgICAgICAgZWw6ICcuc3dpcGVyLXNjcm9sbGJhcicsXHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gbmF2aWdhdGlvbjoge1xyXG4gICAgICAgIC8vICAgICBwcmV2RWw6ICcucHJvamVjdF9fY29sbGFnZS1wYWdlX2N1cnJlbnQnLFxyXG4gICAgICAgIC8vICAgICBuZXh0RWw6ICcucHJvamVjdF9fY29sbGFnZS1wYWdlX2FsbCcsXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgICAgICAxNDQwOiB7XHJcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDIwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zdCBub2RlQWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RfX2NvbGxhZ2UtcGFnZV9hbGwnKVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc3Qgbm9kZUN1cnJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdF9fY29sbGFnZS1wYWdlX2N1cnJlbnQnKVxyXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgY291bnQgPSB0aGlzLnNsaWRlcy5sZW5ndGhcclxuICAgICAgICAgICAgICAgIC8vIHNldE51bWJlclRvTm9kZShjb3VudCwgbm9kZUFsbClcclxuICAgICAgICAgICAgICAgIC8vIHNldE51bWJlclRvTm9kZSh0aGlzLnJlYWxJbmRleCArIDEsIG5vZGVDdXJyZW50KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBzbGlkZUNoYW5nZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyAgICAgY29uc3Qgbm9kZUN1cnJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdF9fY29sbGFnZS1wYWdlX2N1cnJlbnQnKVxyXG4gICAgICAgICAgICAvLyAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgc2V0TnVtYmVyVG9Ob2RlKHRoaXMucmVhbEluZGV4ICsgMSwgbm9kZUN1cnJlbnQpXHJcbiAgICAgICAgICAgIC8vICAgICB9LCAxMDApXHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0UHJvamVjdFZpZGVvKClcclxuICAgIGluaXRQcm9qZWN0U3dpcGVyKClcclxuXHJcbiAgICAvLyBJbml0aWFsYXppbmcgZmFuY3lib3ggZ2FsbGVyeVxyXG4gICAgRmFuY3lib3guYmluZCgnW2RhdGEtZmFuY3lib3g9XCJwb3N0LWNvbGxhZ2VcIl0nKTtcclxufSkiXSwiZmlsZSI6InNpbmdsZS1wcm9qZWN0LmpzIn0=
