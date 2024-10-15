const articleSlides = Array.from(document.querySelectorAll('.billboard__slider .swiper-slide'))

const initArticleSwiper = () => {
    const nodeAll = document.querySelector('.article__navigation_next')
    const nodeCurrent = document.querySelector('.article__navigation_prev')
    const setCountSlides = (num, node) => node.innerText = num

    new Swiper('.article__swiper', {
        loop: true,
        slidesPerView: '1',
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
        grabCursor: true,
        pagination: {
            el: '.article__pagination',
            bulletClass: 'article__bullet',
            bulletActiveClass: 'article__bullet_active',
            clickable: true,
        },
        // navigation: {
        //     prevEl: '.article__navigation_prev',
        //     nextEl: '.article__navigation_next',
        // },
        on: {
            init: function() {
                const count = this.slides.length
                if (count > 1) {
                    // setCountSlides(count, nodeAll)
                    // setCountSlides(this.realIndex + 1, nodeCurrent)
                } else {
                    this.pagination.destroy()
                    this.el.closest('.article__gallary')
                        .querySelector('.article__pagination-container')
                        .classList.add('hide')
                }
            },
            // slideChange: function() {
            //     setTimeout(() => {
            //         setCountSlides(this.realIndex + 1, nodeCurrent)
            //     }, 100)
            // }
        }
    })
}

const initVideoInstructionsSwiper = () => {
    const nodeAll = document.querySelector('.article__accordion-navigation_next')
    const nodeCurrent = document.querySelector('.article__accordion-navigation_prev')
    const setCountSlides = (num, node) => node.innerText = num

    new Swiper('.article__accordion-video .swiper', {
        loop: false,
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
        grabCursor: true,
        pagination: {
            el: '.article__accordion-pagination',
            bulletClass: 'article__accordion-bullet',
            bulletActiveClass: 'article__accordion-bullet_active',
            clickable: true,
        },
        // navigation: {
        //     prevEl: '.article__accordion-navigation_prev',
        //     nextEl: '.article__accordion-navigation_next',
        // },
        on: {
            init: function() {
                const count = this.slides.length
                if (count > 1) {
                    // setCountSlides(count, nodeAll)
                    // setCountSlides(this.realIndex + 1, nodeCurrent)
                } else {
                    this.pagination.destroy()
                    this.el
                        .querySelector('.article__pagination-container')
                        .classList.add('hide')
                }
            },
            // slideChange: function() {
            //     setTimeout(() => {
            //         setCountSlides(this.realIndex + 1, nodeCurrent)
            //     }, 100)
            // }
        }
    })
}

// Add product to favorites
const initAddArticleToFavorites = () => {
    const btns = Array.from(document
        .querySelectorAll('.article__favorite'))

    btns.forEach(btn => btn.addEventListener(
        'click',
        addToFavoritesClickHandler
    ))
}

const initToggleArticleAccordion = () => {
    const btns = Array.from(document.querySelectorAll('.article__accordion-button'))
    if (btns.length === 0) return

    btns.forEach(el => el.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()

        const dropdown = this.parentNode
            .querySelector('.article__accordion-collapse')

        this.classList.toggle('open')
        dropdown.classList.toggle('open')
    }))
}

const initArticleContentTooltip = () => {
    const btns = Array.from(document.querySelectorAll('.article__content-informer'))
    if (btns.length === 0) return

    const addClickOnHandler = () => {
        btns.forEach(el => el.addEventListener('click', function() {
            this.querySelector('span').classList.toggle('visible')
        }))
    }

    const addClickOutsideHandler = () => {
        document.addEventListener('click', e => {
            const target = e.target
            const isTooltip = target.closest('.article__content-informer')

            if (!isTooltip) {
                btns.forEach(node => node
                    .querySelector('span')
                    .classList
                    .remove('visible'))
            }
        })
    }

    // Only for touchable
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        addClickOnHandler()
        addClickOutsideHandler()
    }
}

// Calc
const initArticleCalc = () => {
    const input = document.querySelector('.article__content-calc input')
    let count = input.value

    const cartRequest = window.debounce(function () {
        const buttonRequest = document.querySelector('.article__add-to-cart')

        const code = document
            .querySelector('[data-product-article]')
            .dataset
            .productArticle

        if (!buttonRequest && code) {
            window.setProductToCart({ art: code, count: count })
            showModalMsg("Изменили количество товара")
        }

    }, 500)

    const updateCount = () => {
        input.value = count
        cartRequest()

        const btn = document.querySelector('.article__content-calc button:has(.dec)')
        if (btn && count === 1) {
            btn.classList.add('disabled')
        } else {
            btn.classList.remove('disabled')
        }
    }

    const setDefaultCount = () => {
        count = 1
        updateCount()
    }

    // Increment
    const incBtn = document.querySelector('.article__content-calc .inc')

    const handleInc = (val) => {
        if (val === '') {
            setDefaultCount()
            return
        }

        count = (typeof val === 'number')
            ? count + 1
            : parseInt(count) + 1

        updateCount()
    }

    incBtn.addEventListener('click', () => handleInc(input.value))

    // Decrement
    const decBtn = document.querySelector('.article__content-calc .dec')

    const handleDec = (val) => {
        if (val === '') {
            setDefaultCount()
            return
        }

        let newCount = typeof val === 'number'
            ? count - 1
            : parseInt(count) - 1

        if (newCount <= 0) newCount = 1

        count = newCount
        updateCount()
    }

    decBtn.addEventListener('click', () => handleDec(input.value))

    // Blur for input
    // const handleBlur = (val) => {
    //     if (val === '' || parseInt(val) === 0) {
    //         setDefaultCount()
    //     }
    // }

    // input.addEventListener('blur', () => {
    //     const val = input.value
    //     handleBlur(val)
    // })

    // Change value into the input
    // const handleChange = e => {
    //     const currentVal = e.target.value

    //     if (currentVal === '') return

    //     const onlyDigits = /^\d+$/.test(currentVal)

    //     if (onlyDigits) {
    //         count = currentVal
    //         updateCount()
    //         return
    //     }

    //     updateCount()
    // }
    // input.addEventListener('input', handleChange)
}

// Add to cart
const initAddArticleToCart = () => {
    const btn = document.querySelector('.article__add-to-cart')

    if (!btn) return

    const handler = (btn) => {
        const val = parseInt(document.querySelector('.article__content-calc input').value)
        const art = btn.dataset.productId
        const title = btn.dataset.title
        const msg = btn.dataset.message

        window.addProductToCart({ art: art, count: val })

        showModalMsg(title, msg)

        // Replace button to link
        const link = document.createElement('a')
        link.classList.add('btn', 'btn_block', 'btn_dark')
        link.href = 'cart.html'
        const text = document.createElement('span')
        text.innerText = 'В корзине'
        link.appendChild(text)
        btn.parentNode.replaceChild(link, btn)
    }

    btn.addEventListener('click', function() {
        handler(this)
    })
}

window.addEventListener('load', () => {
    const isArticlePage = document.querySelector('.page-article')

    // Initialize slider only for Article pages
    if (!isArticlePage) return

    initArticleSwiper()
    initVideoInstructionsSwiper()
    initAddArticleToFavorites()
    initToggleArticleAccordion()
    initArticleContentTooltip()
    initArticleCalc()
    initAddArticleToCart()

    // Initialize fancybox
    Fancybox.bind('[data-fancybox="video-instructions"]')
})

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcnRpY2xlL3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhcnRpY2xlU2xpZGVzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYmlsbGJvYXJkX19zbGlkZXIgLnN3aXBlci1zbGlkZScpKVxyXG5cclxuY29uc3QgaW5pdEFydGljbGVTd2lwZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBub2RlQWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFydGljbGVfX25hdmlnYXRpb25fbmV4dCcpXHJcbiAgICBjb25zdCBub2RlQ3VycmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcnRpY2xlX19uYXZpZ2F0aW9uX3ByZXYnKVxyXG4gICAgY29uc3Qgc2V0Q291bnRTbGlkZXMgPSAobnVtLCBub2RlKSA9PiBub2RlLmlubmVyVGV4dCA9IG51bVxyXG5cclxuICAgIG5ldyBTd2lwZXIoJy5hcnRpY2xlX19zd2lwZXInLCB7XHJcbiAgICAgICAgbG9vcDogdHJ1ZSxcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAnMScsXHJcbiAgICAgICAgb2JzZXJ2ZXI6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVBhcmVudHM6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IHRydWUsXHJcbiAgICAgICAgd2F0Y2hPdmVyZmxvdzogdHJ1ZSxcclxuICAgICAgICBncmFiQ3Vyc29yOiB0cnVlLFxyXG4gICAgICAgIHBhZ2luYXRpb246IHtcclxuICAgICAgICAgICAgZWw6ICcuYXJ0aWNsZV9fcGFnaW5hdGlvbicsXHJcbiAgICAgICAgICAgIGJ1bGxldENsYXNzOiAnYXJ0aWNsZV9fYnVsbGV0JyxcclxuICAgICAgICAgICAgYnVsbGV0QWN0aXZlQ2xhc3M6ICdhcnRpY2xlX19idWxsZXRfYWN0aXZlJyxcclxuICAgICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gbmF2aWdhdGlvbjoge1xyXG4gICAgICAgIC8vICAgICBwcmV2RWw6ICcuYXJ0aWNsZV9fbmF2aWdhdGlvbl9wcmV2JyxcclxuICAgICAgICAvLyAgICAgbmV4dEVsOiAnLmFydGljbGVfX25hdmlnYXRpb25fbmV4dCcsXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gdGhpcy5zbGlkZXMubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0Q291bnRTbGlkZXMoY291bnQsIG5vZGVBbGwpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0Q291bnRTbGlkZXModGhpcy5yZWFsSW5kZXggKyAxLCBub2RlQ3VycmVudClcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdpbmF0aW9uLmRlc3Ryb3koKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWwuY2xvc2VzdCgnLmFydGljbGVfX2dhbGxhcnknKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcignLmFydGljbGVfX3BhZ2luYXRpb24tY29udGFpbmVyJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBzbGlkZUNoYW5nZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgLy8gICAgICAgICBzZXRDb3VudFNsaWRlcyh0aGlzLnJlYWxJbmRleCArIDEsIG5vZGVDdXJyZW50KVxyXG4gICAgICAgICAgICAvLyAgICAgfSwgMTAwKVxyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgaW5pdFZpZGVvSW5zdHJ1Y3Rpb25zU3dpcGVyID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgbm9kZUFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcnRpY2xlX19hY2NvcmRpb24tbmF2aWdhdGlvbl9uZXh0JylcclxuICAgIGNvbnN0IG5vZGVDdXJyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFydGljbGVfX2FjY29yZGlvbi1uYXZpZ2F0aW9uX3ByZXYnKVxyXG4gICAgY29uc3Qgc2V0Q291bnRTbGlkZXMgPSAobnVtLCBub2RlKSA9PiBub2RlLmlubmVyVGV4dCA9IG51bVxyXG5cclxuICAgIG5ldyBTd2lwZXIoJy5hcnRpY2xlX19hY2NvcmRpb24tdmlkZW8gLnN3aXBlcicsIHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgb2JzZXJ2ZXI6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVBhcmVudHM6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IHRydWUsXHJcbiAgICAgICAgd2F0Y2hPdmVyZmxvdzogdHJ1ZSxcclxuICAgICAgICBncmFiQ3Vyc29yOiB0cnVlLFxyXG4gICAgICAgIHBhZ2luYXRpb246IHtcclxuICAgICAgICAgICAgZWw6ICcuYXJ0aWNsZV9fYWNjb3JkaW9uLXBhZ2luYXRpb24nLFxyXG4gICAgICAgICAgICBidWxsZXRDbGFzczogJ2FydGljbGVfX2FjY29yZGlvbi1idWxsZXQnLFxyXG4gICAgICAgICAgICBidWxsZXRBY3RpdmVDbGFzczogJ2FydGljbGVfX2FjY29yZGlvbi1idWxsZXRfYWN0aXZlJyxcclxuICAgICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gbmF2aWdhdGlvbjoge1xyXG4gICAgICAgIC8vICAgICBwcmV2RWw6ICcuYXJ0aWNsZV9fYWNjb3JkaW9uLW5hdmlnYXRpb25fcHJldicsXHJcbiAgICAgICAgLy8gICAgIG5leHRFbDogJy5hcnRpY2xlX19hY2NvcmRpb24tbmF2aWdhdGlvbl9uZXh0JyxcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY291bnQgPSB0aGlzLnNsaWRlcy5sZW5ndGhcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXRDb3VudFNsaWRlcyhjb3VudCwgbm9kZUFsbClcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXRDb3VudFNsaWRlcyh0aGlzLnJlYWxJbmRleCArIDEsIG5vZGVDdXJyZW50KVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2luYXRpb24uZGVzdHJveSgpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcignLmFydGljbGVfX3BhZ2luYXRpb24tY29udGFpbmVyJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyBzbGlkZUNoYW5nZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgLy8gICAgICAgICBzZXRDb3VudFNsaWRlcyh0aGlzLnJlYWxJbmRleCArIDEsIG5vZGVDdXJyZW50KVxyXG4gICAgICAgICAgICAvLyAgICAgfSwgMTAwKVxyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuLy8gQWRkIHByb2R1Y3QgdG8gZmF2b3JpdGVzXHJcbmNvbnN0IGluaXRBZGRBcnRpY2xlVG9GYXZvcml0ZXMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuYXJ0aWNsZV9fZmF2b3JpdGUnKSlcclxuXHJcbiAgICBidG5zLmZvckVhY2goYnRuID0+IGJ0bi5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgICdjbGljaycsXHJcbiAgICAgICAgYWRkVG9GYXZvcml0ZXNDbGlja0hhbmRsZXJcclxuICAgICkpXHJcbn1cclxuXHJcbmNvbnN0IGluaXRUb2dnbGVBcnRpY2xlQWNjb3JkaW9uID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFydGljbGVfX2FjY29yZGlvbi1idXR0b24nKSlcclxuICAgIGlmIChidG5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgICAgY29uc3QgZHJvcGRvd24gPSB0aGlzLnBhcmVudE5vZGVcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJy5hcnRpY2xlX19hY2NvcmRpb24tY29sbGFwc2UnKVxyXG5cclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ29wZW4nKVxyXG4gICAgICAgIGRyb3Bkb3duLmNsYXNzTGlzdC50b2dnbGUoJ29wZW4nKVxyXG4gICAgfSkpXHJcbn1cclxuXHJcbmNvbnN0IGluaXRBcnRpY2xlQ29udGVudFRvb2x0aXAgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYXJ0aWNsZV9fY29udGVudC1pbmZvcm1lcicpKVxyXG4gICAgaWYgKGJ0bnMubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCBhZGRDbGlja09uSGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgICBidG5zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykuY2xhc3NMaXN0LnRvZ2dsZSgndmlzaWJsZScpXHJcbiAgICAgICAgfSkpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWRkQ2xpY2tPdXRzaWRlSGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldFxyXG4gICAgICAgICAgICBjb25zdCBpc1Rvb2x0aXAgPSB0YXJnZXQuY2xvc2VzdCgnLmFydGljbGVfX2NvbnRlbnQtaW5mb3JtZXInKVxyXG5cclxuICAgICAgICAgICAgaWYgKCFpc1Rvb2x0aXApIHtcclxuICAgICAgICAgICAgICAgIGJ0bnMuZm9yRWFjaChub2RlID0+IG5vZGVcclxuICAgICAgICAgICAgICAgICAgICAucXVlcnlTZWxlY3Rvcignc3BhbicpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNsYXNzTGlzdFxyXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoJ3Zpc2libGUnKSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8gT25seSBmb3IgdG91Y2hhYmxlXHJcbiAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8IG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cykge1xyXG4gICAgICAgIGFkZENsaWNrT25IYW5kbGVyKClcclxuICAgICAgICBhZGRDbGlja091dHNpZGVIYW5kbGVyKClcclxuICAgIH1cclxufVxyXG5cclxuLy8gQ2FsY1xyXG5jb25zdCBpbml0QXJ0aWNsZUNhbGMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcnRpY2xlX19jb250ZW50LWNhbGMgaW5wdXQnKVxyXG4gICAgbGV0IGNvdW50ID0gaW5wdXQudmFsdWVcclxuXHJcbiAgICBjb25zdCBjYXJ0UmVxdWVzdCA9IHdpbmRvdy5kZWJvdW5jZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uUmVxdWVzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcnRpY2xlX19hZGQtdG8tY2FydCcpXHJcblxyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBkb2N1bWVudFxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvcignW2RhdGEtcHJvZHVjdC1hcnRpY2xlXScpXHJcbiAgICAgICAgICAgIC5kYXRhc2V0XHJcbiAgICAgICAgICAgIC5wcm9kdWN0QXJ0aWNsZVxyXG5cclxuICAgICAgICBpZiAoIWJ1dHRvblJlcXVlc3QgJiYgY29kZSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuc2V0UHJvZHVjdFRvQ2FydCh7IGFydDogY29kZSwgY291bnQ6IGNvdW50IH0pXHJcbiAgICAgICAgICAgIHNob3dNb2RhbE1zZyhcItCY0LfQvNC10L3QuNC70Lgg0LrQvtC70LjRh9C10YHRgtCy0L4g0YLQvtCy0LDRgNCwXCIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sIDUwMClcclxuXHJcbiAgICBjb25zdCB1cGRhdGVDb3VudCA9ICgpID0+IHtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IGNvdW50XHJcbiAgICAgICAgY2FydFJlcXVlc3QoKVxyXG5cclxuICAgICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXJ0aWNsZV9fY29udGVudC1jYWxjIGJ1dHRvbjpoYXMoLmRlYyknKVxyXG4gICAgICAgIGlmIChidG4gJiYgY291bnQgPT09IDEpIHtcclxuICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBidG4uY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzZXREZWZhdWx0Q291bnQgPSAoKSA9PiB7XHJcbiAgICAgICAgY291bnQgPSAxXHJcbiAgICAgICAgdXBkYXRlQ291bnQoKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEluY3JlbWVudFxyXG4gICAgY29uc3QgaW5jQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFydGljbGVfX2NvbnRlbnQtY2FsYyAuaW5jJylcclxuXHJcbiAgICBjb25zdCBoYW5kbGVJbmMgPSAodmFsKSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbCA9PT0gJycpIHtcclxuICAgICAgICAgICAgc2V0RGVmYXVsdENvdW50KClcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb3VudCA9ICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJylcclxuICAgICAgICAgICAgPyBjb3VudCArIDFcclxuICAgICAgICAgICAgOiBwYXJzZUludChjb3VudCkgKyAxXHJcblxyXG4gICAgICAgIHVwZGF0ZUNvdW50KClcclxuICAgIH1cclxuXHJcbiAgICBpbmNCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBoYW5kbGVJbmMoaW5wdXQudmFsdWUpKVxyXG5cclxuICAgIC8vIERlY3JlbWVudFxyXG4gICAgY29uc3QgZGVjQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFydGljbGVfX2NvbnRlbnQtY2FsYyAuZGVjJylcclxuXHJcbiAgICBjb25zdCBoYW5kbGVEZWMgPSAodmFsKSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbCA9PT0gJycpIHtcclxuICAgICAgICAgICAgc2V0RGVmYXVsdENvdW50KClcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbmV3Q291bnQgPSB0eXBlb2YgdmFsID09PSAnbnVtYmVyJ1xyXG4gICAgICAgICAgICA/IGNvdW50IC0gMVxyXG4gICAgICAgICAgICA6IHBhcnNlSW50KGNvdW50KSAtIDFcclxuXHJcbiAgICAgICAgaWYgKG5ld0NvdW50IDw9IDApIG5ld0NvdW50ID0gMVxyXG5cclxuICAgICAgICBjb3VudCA9IG5ld0NvdW50XHJcbiAgICAgICAgdXBkYXRlQ291bnQoKVxyXG4gICAgfVxyXG5cclxuICAgIGRlY0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGhhbmRsZURlYyhpbnB1dC52YWx1ZSkpXHJcblxyXG4gICAgLy8gQmx1ciBmb3IgaW5wdXRcclxuICAgIC8vIGNvbnN0IGhhbmRsZUJsdXIgPSAodmFsKSA9PiB7XHJcbiAgICAvLyAgICAgaWYgKHZhbCA9PT0gJycgfHwgcGFyc2VJbnQodmFsKSA9PT0gMCkge1xyXG4gICAgLy8gICAgICAgICBzZXREZWZhdWx0Q291bnQoKVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4ge1xyXG4gICAgLy8gICAgIGNvbnN0IHZhbCA9IGlucHV0LnZhbHVlXHJcbiAgICAvLyAgICAgaGFuZGxlQmx1cih2YWwpXHJcbiAgICAvLyB9KVxyXG5cclxuICAgIC8vIENoYW5nZSB2YWx1ZSBpbnRvIHRoZSBpbnB1dFxyXG4gICAgLy8gY29uc3QgaGFuZGxlQ2hhbmdlID0gZSA9PiB7XHJcbiAgICAvLyAgICAgY29uc3QgY3VycmVudFZhbCA9IGUudGFyZ2V0LnZhbHVlXHJcblxyXG4gICAgLy8gICAgIGlmIChjdXJyZW50VmFsID09PSAnJykgcmV0dXJuXHJcblxyXG4gICAgLy8gICAgIGNvbnN0IG9ubHlEaWdpdHMgPSAvXlxcZCskLy50ZXN0KGN1cnJlbnRWYWwpXHJcblxyXG4gICAgLy8gICAgIGlmIChvbmx5RGlnaXRzKSB7XHJcbiAgICAvLyAgICAgICAgIGNvdW50ID0gY3VycmVudFZhbFxyXG4gICAgLy8gICAgICAgICB1cGRhdGVDb3VudCgpXHJcbiAgICAvLyAgICAgICAgIHJldHVyblxyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgdXBkYXRlQ291bnQoKVxyXG4gICAgLy8gfVxyXG4gICAgLy8gaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBoYW5kbGVDaGFuZ2UpXHJcbn1cclxuXHJcbi8vIEFkZCB0byBjYXJ0XHJcbmNvbnN0IGluaXRBZGRBcnRpY2xlVG9DYXJ0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFydGljbGVfX2FkZC10by1jYXJ0JylcclxuXHJcbiAgICBpZiAoIWJ0bikgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgaGFuZGxlciA9IChidG4pID0+IHtcclxuICAgICAgICBjb25zdCB2YWwgPSBwYXJzZUludChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXJ0aWNsZV9fY29udGVudC1jYWxjIGlucHV0JykudmFsdWUpXHJcbiAgICAgICAgY29uc3QgYXJ0ID0gYnRuLmRhdGFzZXQucHJvZHVjdElkXHJcbiAgICAgICAgY29uc3QgdGl0bGUgPSBidG4uZGF0YXNldC50aXRsZVxyXG4gICAgICAgIGNvbnN0IG1zZyA9IGJ0bi5kYXRhc2V0Lm1lc3NhZ2VcclxuXHJcbiAgICAgICAgd2luZG93LmFkZFByb2R1Y3RUb0NhcnQoeyBhcnQ6IGFydCwgY291bnQ6IHZhbCB9KVxyXG5cclxuICAgICAgICBzaG93TW9kYWxNc2codGl0bGUsIG1zZylcclxuXHJcbiAgICAgICAgLy8gUmVwbGFjZSBidXR0b24gdG8gbGlua1xyXG4gICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcclxuICAgICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoJ2J0bicsICdidG5fYmxvY2snLCAnYnRuX2RhcmsnKVxyXG4gICAgICAgIGxpbmsuaHJlZiA9ICdjYXJ0Lmh0bWwnXHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgIHRleHQuaW5uZXJUZXh0ID0gJ9CSINC60L7RgNC30LjQvdC1J1xyXG4gICAgICAgIGxpbmsuYXBwZW5kQ2hpbGQodGV4dClcclxuICAgICAgICBidG4ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobGluaywgYnRuKVxyXG4gICAgfVxyXG5cclxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGhhbmRsZXIodGhpcylcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgaXNBcnRpY2xlUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWFydGljbGUnKVxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgc2xpZGVyIG9ubHkgZm9yIEFydGljbGUgcGFnZXNcclxuICAgIGlmICghaXNBcnRpY2xlUGFnZSkgcmV0dXJuXHJcblxyXG4gICAgaW5pdEFydGljbGVTd2lwZXIoKVxyXG4gICAgaW5pdFZpZGVvSW5zdHJ1Y3Rpb25zU3dpcGVyKClcclxuICAgIGluaXRBZGRBcnRpY2xlVG9GYXZvcml0ZXMoKVxyXG4gICAgaW5pdFRvZ2dsZUFydGljbGVBY2NvcmRpb24oKVxyXG4gICAgaW5pdEFydGljbGVDb250ZW50VG9vbHRpcCgpXHJcbiAgICBpbml0QXJ0aWNsZUNhbGMoKVxyXG4gICAgaW5pdEFkZEFydGljbGVUb0NhcnQoKVxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgZmFuY3lib3hcclxuICAgIEZhbmN5Ym94LmJpbmQoJ1tkYXRhLWZhbmN5Ym94PVwidmlkZW8taW5zdHJ1Y3Rpb25zXCJdJylcclxufSlcclxuIl0sImZpbGUiOiJhcnRpY2xlLmpzIn0=
