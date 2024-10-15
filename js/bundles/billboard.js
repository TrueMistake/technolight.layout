function initBillboardSlider() {

    const billboardVideoContainers = Array.from(document.querySelectorAll('.billboard__slider .swiper-slide'))

    const activeBillboardVideo = (node) => {
        if (!node.classList.contains('activated')) {
            node.classList.add('activated')
        }
    }

    const toggleBillboardVideo = (video) => {
        if (!video.paused) {
            video.pause()
        } else {
            video.play()
        }
    }

    const setBillboardVideoSource = () => {
        billboardVideoContainers.forEach(node => {

        });
    }

    const swiperBillboard = new Swiper('.billboard__slider .swiper', {
        loop: true,
        slidesPerView: 'auto',
        // speed: 3000,
        // observer: true,
        // observeParents: true,
        // observeSlideChildren: true,
        // watchOverflow: true,
        // grabCursor: true,
        // slideToClickedSlide: true,
        breakpoints: {
            768: {
                spaceBetween: 20,
                centeredSlides: true,
                // initialSlide: 1
            },
        },
        // autoplay: {
        //     delay: 5000,
        //     disableOnInteraction: false
        // },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        // navigation: {
        //     prevEl: '.billboard__page_current',
        //     nextEl: '.billboard__page_all',
        // },
        on: {
            init: function () {
                // Set values to the swiper navigation buttons
                // const nodeAll = document.querySelector('.billboard__page_all')
                // const nodeCurrent = document.querySelector('.billboard__page_current')
                // const count = this.slides.length

                // if (count > 1) {
                //     setCountSlides(count, nodeAll)
                //     setCurrentSlide(this.realIndex + 1, nodeCurrent)
                // }

                // Set video resources
                // setBillboardVideoSource()

                const activeSlide = this.slides[this.activeIndex]
                const activeVideo = activeSlide.querySelector('video')
                if (activeVideo) activeVideo.classList.add('blockedPlay')

                setTimeout(() => document.querySelector('.billboard')
                    .classList.remove('inactive'), 100)
            },
            slideChange: function () {
                // Set values to the swiper navigation buttons
                // const nodeCurrent = document.querySelector('.billboard__page_current')
                // setTimeout(() => {
                //     setCurrentSlide(this.realIndex + 1, nodeCurrent)
                // }, 100)

                // Toggle video playing
                billboardVideoContainers.forEach(node => {
                    const video = node.querySelector('video')
                    if (video) video.pause()
                })
                setTimeout(() => {
                    const activeSlide = this.slides[this.activeIndex]
                    const activeContainer = activeSlide.querySelector('.billboard__container')
                    const activeVideo = activeSlide.querySelector('video')
                    if (activeVideo) {
                        const src = activeVideo.dataset.src
                        if (src) {
                            activeVideo.src = src
                            // activeVideo.load()
                            activeVideo.removeAttribute('data-src')
                            activeVideo.play()
                        }
                        if (!activeVideo.classList.contains('blockedPlay')) {
                            activeBillboardVideo(activeContainer)
                            // activeVideo.play()
                        }
                    }
                    if (activeVideo) activeVideo.classList.remove('blockedPlay')
                }, 100)
            }
        }
    });

    // Actions for the video content at the Billboard Swiper
    const addHandlerToBillboardVideo = () => {
        billboardVideoContainers.forEach(el => {
            el.addEventListener('click', function () {
                const container = el.querySelector('.billboard__container')
                const video = el.querySelector('video')

                const isActiveSlide = container.closest('.swiper-slide')
                    .classList.contains('swiper-slide-active')

                if (!video || !isActiveSlide) return

                activeBillboardVideo(container)
                toggleBillboardVideo(video)
            })
        })
    }
    addHandlerToBillboardVideo()

    window.addEventListener('scroll', e => {
        const billboard = document.querySelector('.billboard')
        const videoArr = Array.from(billboard.querySelectorAll('video'))

        videoArr.forEach(video => video.pause())
    })
}

document.addEventListener('DOMContentLoaded', initBillboardSlider)
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJiaWxsYm9hcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gaW5pdEJpbGxib2FyZFNsaWRlcigpIHtcclxuXHJcbiAgICBjb25zdCBiaWxsYm9hcmRWaWRlb0NvbnRhaW5lcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5iaWxsYm9hcmRfX3NsaWRlciAuc3dpcGVyLXNsaWRlJykpXHJcblxyXG4gICAgY29uc3QgYWN0aXZlQmlsbGJvYXJkVmlkZW8gPSAobm9kZSkgPT4ge1xyXG4gICAgICAgIGlmICghbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2YXRlZCcpKSB7XHJcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZhdGVkJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdG9nZ2xlQmlsbGJvYXJkVmlkZW8gPSAodmlkZW8pID0+IHtcclxuICAgICAgICBpZiAoIXZpZGVvLnBhdXNlZCkge1xyXG4gICAgICAgICAgICB2aWRlby5wYXVzZSgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmlkZW8ucGxheSgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNldEJpbGxib2FyZFZpZGVvU291cmNlID0gKCkgPT4ge1xyXG4gICAgICAgIGJpbGxib2FyZFZpZGVvQ29udGFpbmVycy5mb3JFYWNoKG5vZGUgPT4ge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzd2lwZXJCaWxsYm9hcmQgPSBuZXcgU3dpcGVyKCcuYmlsbGJvYXJkX19zbGlkZXIgLnN3aXBlcicsIHtcclxuICAgICAgICBsb29wOiB0cnVlLFxyXG4gICAgICAgIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgICAgICAvLyBzcGVlZDogMzAwMCxcclxuICAgICAgICAvLyBvYnNlcnZlcjogdHJ1ZSxcclxuICAgICAgICAvLyBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICAgICAgICAvLyBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgICAgICAvLyB3YXRjaE92ZXJmbG93OiB0cnVlLFxyXG4gICAgICAgIC8vIGdyYWJDdXJzb3I6IHRydWUsXHJcbiAgICAgICAgLy8gc2xpZGVUb0NsaWNrZWRTbGlkZTogdHJ1ZSxcclxuICAgICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgICAgICA3Njg6IHtcclxuICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMjAsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJlZFNsaWRlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxTbGlkZTogMVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gYXV0b3BsYXk6IHtcclxuICAgICAgICAvLyAgICAgZGVsYXk6IDUwMDAsXHJcbiAgICAgICAgLy8gICAgIGRpc2FibGVPbkludGVyYWN0aW9uOiBmYWxzZVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgcGFnaW5hdGlvbjoge1xyXG4gICAgICAgICAgICBlbDogJy5zd2lwZXItcGFnaW5hdGlvbicsXHJcbiAgICAgICAgICAgIGNsaWNrYWJsZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIG5hdmlnYXRpb246IHtcclxuICAgICAgICAvLyAgICAgcHJldkVsOiAnLmJpbGxib2FyZF9fcGFnZV9jdXJyZW50JyxcclxuICAgICAgICAvLyAgICAgbmV4dEVsOiAnLmJpbGxib2FyZF9fcGFnZV9hbGwnLFxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gU2V0IHZhbHVlcyB0byB0aGUgc3dpcGVyIG5hdmlnYXRpb24gYnV0dG9uc1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc3Qgbm9kZUFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iaWxsYm9hcmRfX3BhZ2VfYWxsJylcclxuICAgICAgICAgICAgICAgIC8vIGNvbnN0IG5vZGVDdXJyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJpbGxib2FyZF9fcGFnZV9jdXJyZW50JylcclxuICAgICAgICAgICAgICAgIC8vIGNvbnN0IGNvdW50ID0gdGhpcy5zbGlkZXMubGVuZ3RoXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaWYgKGNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHNldENvdW50U2xpZGVzKGNvdW50LCBub2RlQWxsKVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHNldEN1cnJlbnRTbGlkZSh0aGlzLnJlYWxJbmRleCArIDEsIG5vZGVDdXJyZW50KVxyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNldCB2aWRlbyByZXNvdXJjZXNcclxuICAgICAgICAgICAgICAgIC8vIHNldEJpbGxib2FyZFZpZGVvU291cmNlKClcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVTbGlkZSA9IHRoaXMuc2xpZGVzW3RoaXMuYWN0aXZlSW5kZXhdXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVWaWRlbyA9IGFjdGl2ZVNsaWRlLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJylcclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVWaWRlbykgYWN0aXZlVmlkZW8uY2xhc3NMaXN0LmFkZCgnYmxvY2tlZFBsYXknKVxyXG5cclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJpbGxib2FyZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5yZW1vdmUoJ2luYWN0aXZlJyksIDEwMClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2xpZGVDaGFuZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIFNldCB2YWx1ZXMgdG8gdGhlIHN3aXBlciBuYXZpZ2F0aW9uIGJ1dHRvbnNcclxuICAgICAgICAgICAgICAgIC8vIGNvbnN0IG5vZGVDdXJyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJpbGxib2FyZF9fcGFnZV9jdXJyZW50JylcclxuICAgICAgICAgICAgICAgIC8vIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHNldEN1cnJlbnRTbGlkZSh0aGlzLnJlYWxJbmRleCArIDEsIG5vZGVDdXJyZW50KVxyXG4gICAgICAgICAgICAgICAgLy8gfSwgMTAwKVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRvZ2dsZSB2aWRlbyBwbGF5aW5nXHJcbiAgICAgICAgICAgICAgICBiaWxsYm9hcmRWaWRlb0NvbnRhaW5lcnMuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2aWRlbyA9IG5vZGUucXVlcnlTZWxlY3RvcigndmlkZW8nKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2aWRlbykgdmlkZW8ucGF1c2UoKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZVNsaWRlID0gdGhpcy5zbGlkZXNbdGhpcy5hY3RpdmVJbmRleF1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVDb250YWluZXIgPSBhY3RpdmVTbGlkZS5xdWVyeVNlbGVjdG9yKCcuYmlsbGJvYXJkX19jb250YWluZXInKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2ZVZpZGVvID0gYWN0aXZlU2xpZGUucXVlcnlTZWxlY3RvcigndmlkZW8nKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVWaWRlbykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzcmMgPSBhY3RpdmVWaWRlby5kYXRhc2V0LnNyY1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3JjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVWaWRlby5zcmMgPSBzcmNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFjdGl2ZVZpZGVvLmxvYWQoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlVmlkZW8ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNyYycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVWaWRlby5wbGF5KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFjdGl2ZVZpZGVvLmNsYXNzTGlzdC5jb250YWlucygnYmxvY2tlZFBsYXknKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQmlsbGJvYXJkVmlkZW8oYWN0aXZlQ29udGFpbmVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWN0aXZlVmlkZW8ucGxheSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVZpZGVvKSBhY3RpdmVWaWRlby5jbGFzc0xpc3QucmVtb3ZlKCdibG9ja2VkUGxheScpXHJcbiAgICAgICAgICAgICAgICB9LCAxMDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBY3Rpb25zIGZvciB0aGUgdmlkZW8gY29udGVudCBhdCB0aGUgQmlsbGJvYXJkIFN3aXBlclxyXG4gICAgY29uc3QgYWRkSGFuZGxlclRvQmlsbGJvYXJkVmlkZW8gPSAoKSA9PiB7XHJcbiAgICAgICAgYmlsbGJvYXJkVmlkZW9Db250YWluZXJzLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5iaWxsYm9hcmRfX2NvbnRhaW5lcicpXHJcbiAgICAgICAgICAgICAgICBjb25zdCB2aWRlbyA9IGVsLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJylcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc0FjdGl2ZVNsaWRlID0gY29udGFpbmVyLmNsb3Nlc3QoJy5zd2lwZXItc2xpZGUnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jbGFzc0xpc3QuY29udGFpbnMoJ3N3aXBlci1zbGlkZS1hY3RpdmUnKVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdmlkZW8gfHwgIWlzQWN0aXZlU2xpZGUpIHJldHVyblxyXG5cclxuICAgICAgICAgICAgICAgIGFjdGl2ZUJpbGxib2FyZFZpZGVvKGNvbnRhaW5lcilcclxuICAgICAgICAgICAgICAgIHRvZ2dsZUJpbGxib2FyZFZpZGVvKHZpZGVvKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBhZGRIYW5kbGVyVG9CaWxsYm9hcmRWaWRlbygpXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGUgPT4ge1xyXG4gICAgICAgIGNvbnN0IGJpbGxib2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iaWxsYm9hcmQnKVxyXG4gICAgICAgIGNvbnN0IHZpZGVvQXJyID0gQXJyYXkuZnJvbShiaWxsYm9hcmQucXVlcnlTZWxlY3RvckFsbCgndmlkZW8nKSlcclxuXHJcbiAgICAgICAgdmlkZW9BcnIuZm9yRWFjaCh2aWRlbyA9PiB2aWRlby5wYXVzZSgpKVxyXG4gICAgfSlcclxufVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGluaXRCaWxsYm9hcmRTbGlkZXIpIl0sImZpbGUiOiJiaWxsYm9hcmQuanMifQ==
