window.addEventListener('load', () => {
    // Life section Swipers
    const setCountSlides = (num, node) => {
        node.innerText = num
    }

    const setCurrentSlide = (num, node) => {
        node.innerText = num
    }

    const lifeSwiperCommonProps = {
        loop: false,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
    }

    const lifeSwiperContent = new Swiper('.life__content .swiper', {
        ...lifeSwiperCommonProps,
        parallax: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            prevEl: '.life__page_current',
            nextEl: '.life__page_all',
        },
        on: {
            init: function () {
                const nodeAll = document.querySelector('.life__page_all')
                const nodeCurrent = document.querySelector('.life__page_current')
                const count = this.slides.length
                setCountSlides(count, nodeAll)
                setCurrentSlide(this.realIndex + 1, nodeCurrent)
            },
            slideChange: function () {
                const nodeCurrent = document.querySelector('.life__page_current')
                setTimeout(() => {
                    setCurrentSlide(this.realIndex + 1, nodeCurrent)
                }, 100)
            }
        }
    });

    const lifeSwiperBillboard = new Swiper('.life__billboard .swiper', {
        ...lifeSwiperCommonProps,
        // grabCursor: true,
    });

    // Life section swipers mutual controlling
    lifeSwiperContent.controller.control = lifeSwiperBillboard
    lifeSwiperBillboard.controller.control = lifeSwiperContent
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJob21lL3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIC8vIExpZmUgc2VjdGlvbiBTd2lwZXJzXHJcbiAgICBjb25zdCBzZXRDb3VudFNsaWRlcyA9IChudW0sIG5vZGUpID0+IHtcclxuICAgICAgICBub2RlLmlubmVyVGV4dCA9IG51bVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNldEN1cnJlbnRTbGlkZSA9IChudW0sIG5vZGUpID0+IHtcclxuICAgICAgICBub2RlLmlubmVyVGV4dCA9IG51bVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxpZmVTd2lwZXJDb21tb25Qcm9wcyA9IHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICBvYnNlcnZlcjogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgICAgICB3YXRjaE92ZXJmbG93OiB0cnVlLFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxpZmVTd2lwZXJDb250ZW50ID0gbmV3IFN3aXBlcignLmxpZmVfX2NvbnRlbnQgLnN3aXBlcicsIHtcclxuICAgICAgICAuLi5saWZlU3dpcGVyQ29tbW9uUHJvcHMsXHJcbiAgICAgICAgcGFyYWxsYXg6IHRydWUsXHJcbiAgICAgICAgcGFnaW5hdGlvbjoge1xyXG4gICAgICAgICAgICBlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXHJcbiAgICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIG5hdmlnYXRpb246IHtcclxuICAgICAgICAgICAgcHJldkVsOiAnLmxpZmVfX3BhZ2VfY3VycmVudCcsXHJcbiAgICAgICAgICAgIG5leHRFbDogJy5saWZlX19wYWdlX2FsbCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlQWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpZmVfX3BhZ2VfYWxsJylcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVDdXJyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpZmVfX3BhZ2VfY3VycmVudCcpXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb3VudCA9IHRoaXMuc2xpZGVzLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgc2V0Q291bnRTbGlkZXMoY291bnQsIG5vZGVBbGwpXHJcbiAgICAgICAgICAgICAgICBzZXRDdXJyZW50U2xpZGUodGhpcy5yZWFsSW5kZXggKyAxLCBub2RlQ3VycmVudClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2xpZGVDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGVDdXJyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpZmVfX3BhZ2VfY3VycmVudCcpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRDdXJyZW50U2xpZGUodGhpcy5yZWFsSW5kZXggKyAxLCBub2RlQ3VycmVudClcclxuICAgICAgICAgICAgICAgIH0sIDEwMClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGxpZmVTd2lwZXJCaWxsYm9hcmQgPSBuZXcgU3dpcGVyKCcubGlmZV9fYmlsbGJvYXJkIC5zd2lwZXInLCB7XHJcbiAgICAgICAgLi4ubGlmZVN3aXBlckNvbW1vblByb3BzLFxyXG4gICAgICAgIC8vIGdyYWJDdXJzb3I6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBMaWZlIHNlY3Rpb24gc3dpcGVycyBtdXR1YWwgY29udHJvbGxpbmdcclxuICAgIGxpZmVTd2lwZXJDb250ZW50LmNvbnRyb2xsZXIuY29udHJvbCA9IGxpZmVTd2lwZXJCaWxsYm9hcmRcclxuICAgIGxpZmVTd2lwZXJCaWxsYm9hcmQuY29udHJvbGxlci5jb250cm9sID0gbGlmZVN3aXBlckNvbnRlbnRcclxufSkiXSwiZmlsZSI6ImhvbWUuanMifQ==
