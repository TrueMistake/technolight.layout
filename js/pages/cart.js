const updateProductSum = (inputNode, isInc) => {

    const value = parseInt(inputNode.value)
    const calc = inputNode.closest('.cart__calc')

    const sumNode = calc.querySelector('[data-total]')
    const priceNode = calc.querySelector('[data-price]')
    const price = parseFloat(priceNode.innerText.replace(/\s/g, ""))

    const totalNode = document.querySelector('#total')
    const total = parseFloat(totalNode.innerText.replace(/\s/g, ""))

    const totalValue = isInc ? total + price : total - price

    sumNode.innerText = formatNumber(price * value)
    totalNode.innerText = formatNumber(Math.abs(totalValue))
}

const cartRequest = window.throttle(function (code, val) {
    window.setProductToCart({art: code, count: val})
}, 3000)

const dotRequest = window.throttle(function (code, val) {
    window.setDotToCart({id: code, count: val})
}, 3000)

const initCartCounter = () => {
    const btns = Array.from(document.querySelectorAll('.cart__calc-counter button'))

    btns.forEach(el => {
        el.addEventListener('click', function () {
            const isInc = this.dataset.type === 'inc'
            const input = this.parentNode.querySelector('input')
            const decBtn = this.parentNode.querySelector('[data-type="dec"')
            let val = input.value

            val = isInc
                ? parseInt(val) + 1
                : parseInt(val) - 1

            if (val === 0) val++

            decBtn.disabled = !(val > 1)

            input.value = val

            updateProductSum(input, isInc)

            const cartItem = this.closest('.cart__item')
            const cartDot = this.closest('.cart__dot')

            if (!cartItem && !cartDot) return
            if (cartItem) cartRequest(cartItem.dataset.productId, val)
            if (cartDot) dotRequest(cartDot.dataset.productId, val)
        })
    })
}

const getTotalValue = () => {
    const cartTotal = document.getElementById('total')

    if (cartTotal) {
        const total = cartTotal.innerText
        return parseInt(total.replace(/\s/g, ""))
    }

    return 0
}

const updateTotalPrice = (val) => {
    const cartTotal = document.getElementById('total')

    if (cartTotal) {
        cartTotal.innerText = formatNumber(getTotalValue() + val)
    }
}

const resetTotalText = () => {
    const textWrap = document.querySelector('.cart__actions-total')
    textWrap.innerHTML = '<p>В корзине нет товаров</p>'

    const btnWrap = document.querySelector('.cart__actions-buttons')
    const btnSearch = btnWrap.querySelector('.btn_search')
    while (btnWrap.firstChild) btnWrap.removeChild(btnWrap.firstChild)
    btnWrap.appendChild(btnSearch)
}

const checkTotalPrice = () => {
    const total = getTotalValue()
    if (total <= 0) resetTotalText()
}

const delProduct = (el) => {
    let height = el.offsetHeight

    el.style.maxHeight = height + 'px'

    setTimeout(() => el.classList.add('removed'), 10)
    setTimeout(() => el.remove(), 1000)
    setTimeout(() => {
        showAnimElements()
        setAnimationElms()
    }, 300)
}

const initDelProdBtns = () => {
    const btns = Array.from(document.querySelectorAll('.cart__calc .btn_del'))

    btns.forEach(el => el.addEventListener('click', function () {
        const product = el.closest('[data-product]')

        if (!product) return

        const isDot = product.classList.contains('cart__dot')
        const totalText = product.querySelector('[data-total]').innerText
        const total = parseInt(totalText.replace(/\s/g, ""))
        const input = product.querySelector('input')
        const code = product.dataset.productId

        const productName = isDot
            ? product.querySelector('.cart__title').innerText
            : product.querySelector('.cart__subtitle').innerText

        if (isDot) {
            // Удаляем DOT  асинхронно из БД
            window.removeDotFromCart({id: code, count: parseInt(input.value)})
        } else {
            // Удаляем продукт асинхронно из БД
            window.removeProductFromCart({art: code, count: parseInt(input.value)})
        }

        delProduct(product) // Удаляем продукт с экрана
        updateTotalPrice(total * -1)
        checkTotalPrice()
        showModalMsg(productName, 'Удален из корзины')
    }))
}

const setErrorOnController = (inputNode, errorText) => {
    const container = inputNode.parentNode
    const message = container.querySelector('.error-message')

    container.classList.add('has-error')
    message.innerText = errorText

    inputNode.addEventListener('input', () => {
        container.classList.remove('has-error')
    })
}

const resetErrorOnController = (inputNode) => {
    inputNode.parentNode.classList.remove('has-error')
}

const clearCart = () => {
    const products = Array.from(document.querySelectorAll('[data-product]'))
    products.forEach(el => delProduct(el))
    resetTotalText()
}

const initOrderSubmit = () => {
    const form = document.getElementById('setOrderForm')
    {
        if (!form) return
        // Если форма уже была инициализирована, не делаем этого повторно
        if (form.dataset.order === 'init') {
            return
        }
        form.dataset.order = 'init'
    }
    const formValid = {name: true, phone: true, email: true, city: true}
    const phoneNumber = form.querySelector('[name="phone"]')

    // Phone masking
    const phoneMaskOptions = {
        mask: '+{7} (000) 000-00-00',
        lazy: true,
        placeholderChar: '#'
    }
    const phoneMask = IMask(
        phoneNumber,
        phoneMaskOptions
    )

    phoneNumber.addEventListener('focus', () => phoneMask.updateOptions({lazy: false}))
    phoneNumber.addEventListener('blur', () => phoneMask.updateOptions({lazy: true}))

    form.addEventListener('submit', function (e) {
        e.preventDefault()

        clearResponseCities(e.target)

        const name = this.querySelector('[name="name"]')
        const phone = this.querySelector('[name="phone"]')
        const email = this.querySelector('[name="email"]')
        const city = this.querySelector('[name="city"]')
        const cityId = this.querySelector('[name="city-id"]')

        // Check name
        if (name.value === '') {
            setErrorOnController(name, 'Заполните поле ФИО')
            formValid.name = false
        } else {
            resetErrorOnController(name)
            formValid.name = true
        }

        // Check phone
        if (phone.value === '') {
            setErrorOnController(phone, 'Заполните поле Телефон')
            formValid.phone = false
        } else {

            if (window.validatePhone(parseInt(phoneMask.unmaskedValue))) {
                resetErrorOnController(phone)
                formValid.phone = true
            } else {
                setErrorOnController(phone, 'Некорректный номер телефона')
                formValid.phone = false
            }
        }

        // Check email
        if (email.value !== '') {
            if (window.validateEmail(email.value)) {
                resetErrorOnController(email)
                formValid.email = true
            } else {
                setErrorOnController(email, 'Некорректный адрес электронной почты')
                formValid.email = false
            }
        } else {
            resetErrorOnController(email)
            formValid.email = true
        }

        // Check city
        if (!cityId) {
            setErrorOnController(city, 'Некорректно указан Город')
            formValid.city = false
        } else {
            resetErrorOnController(city)
            formValid.city = true
        }

        // Sending form data
        if (formValid.name && formValid.phone && formValid.email) {

            console.log('Send fromData to back -------------------------------------');
            const formData = new FormData(form);
            for (let [name, value] of formData) {
                console.log(`${name}: ${value}`);
            }

            form.reset()
            clearCart()
            toggleModalDialog('#orderSentMsg')
        }
    })
}

const SaveAsPDF = () => {
    const showHiddenElements = () => {
        const animationElms = Array.from(document
            .querySelectorAll('.animation-element'))

        animationElms.forEach(el => el
            .classList.remove('animation-element'))
    }

    const printPage = () => {
        showHiddenElements()
        window.print()
    }

    document.getElementById('SaveAsPDF')
        .addEventListener('click', printPage)

    window.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'p') {
            showHiddenElements()
        }
    })

    window.addEventListener('beforeprint', showHiddenElements)
}

const cityInputHandler = window.throttle(async function (e) {
    const container = e.target.parentNode
    const query = e.target.value.trim()

    const url = window.requestCityLink
    if (!url) {
        console.error('Некорректный URL API запроса города!')
        return
    }

    try {
        if (query === '') {
            clearResponseCities(e.target)
            return
        }

        container.classList.add('loading')

        const res = await fetch(url + `?query=${query}`)

        if (!res.ok) throw new Error('Ошибка запроса к API выбора города!')

        const data = await res.json()

        if (data.length === 0) return

        // Если в пришедших данные есть точно совпадение города, сразу ставим его
        const matchedCity = cityRequestChecker(query, data)

        if (matchedCity) {
            e.target.value = matchedCity.name
            return
        }

        // Если город введен некорректно, показываем список для выбора
        updateResponseCities(e.target, data)

    } catch (error) {
        console.error(error)
    } finally {
        container.classList.remove('loading')
    }
}, 1000)

function cityRequestChecker(query, cities) {
    const match = cities.filter(city =>
        city.name.toLowerCase() === query.toLowerCase())
    return match[0]
}

const initCitySelector = () => {
    {
        const form = document.getElementById('setOrderForm')
        if (!form) return
        // Если форма уже была инициализирована, не делаем этого повторно
        if (form.dataset.city === 'init') {
            return
        }
        form.dataset.city = 'init'
    }
    
    const selectors = document.querySelectorAll('label:has([name="city"])')

    if (selectors.length === 0) return

    selectors.forEach(el => {
        const input = el.querySelector('input')

        input.addEventListener('input', (e) => {
            if (input.value.trim() === '') clearResponseCities(input)
            if (e.isTrusted === false) return
            cityInputHandler(e) // отправляет запрос на сервер
        })
    })
}

function clearResponseCities(inputNode) {
    const container = inputNode.parentNode
    const list = container.querySelector('.city-selector')

    if (!list) return

    list.remove()
}

function updateResponseCities(inputNode, cities) {
    const container = inputNode.parentNode
    const selector = document.createElement('span')
    selector.classList.add('city-selector')

    const wrap = document.createElement('span')
    wrap.classList.add('city-selector__wrap')
    selector.appendChild(wrap)

    const list = document.createElement('span')
    list.classList.add('city-selector__list')
    wrap.appendChild(list)
    cities.forEach(city => {
        const item = document.createElement('span')
        item.classList.add('city-selector__item')
        item.setAttribute('data-id', city.id)
        item.textContent = city.name
        list.appendChild(item)

        item.addEventListener('click', e => cityItemClickHandler(e, inputNode))
    })

    clearResponseCities(inputNode)
    container.appendChild(selector)
}

function cityItemClickHandler(e, inputNode) {
    e.preventDefault()
    e.stopPropagation()

    const city = e.target.innerText
    const id = e.target.dataset.id

    inputNode.value = city
    const event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    inputNode.dispatchEvent(event);
    const container = inputNode.parentNode
    const selector = container.querySelector('.city-selector')
    selector.remove()
}


window.addEventListener('load', () => {
    window.safeCall(initCartCounter)
    window.safeCall(initDelProdBtns)
    window.safeCall(initOrderSubmit)
    window.safeCall(SaveAsPDF)
    window.safeCall(initCitySelector)
})


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjYXJ0L3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB1cGRhdGVQcm9kdWN0U3VtID0gKGlucHV0Tm9kZSwgaXNJbmMpID0+IHtcclxuXHJcbiAgICBjb25zdCB2YWx1ZSA9IHBhcnNlSW50KGlucHV0Tm9kZS52YWx1ZSlcclxuICAgIGNvbnN0IGNhbGMgPSBpbnB1dE5vZGUuY2xvc2VzdCgnLmNhcnRfX2NhbGMnKVxyXG5cclxuICAgIGNvbnN0IHN1bU5vZGUgPSBjYWxjLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRvdGFsXScpXHJcbiAgICBjb25zdCBwcmljZU5vZGUgPSBjYWxjLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXByaWNlXScpXHJcbiAgICBjb25zdCBwcmljZSA9IHBhcnNlRmxvYXQocHJpY2VOb2RlLmlubmVyVGV4dC5yZXBsYWNlKC9cXHMvZywgXCJcIikpXHJcblxyXG4gICAgY29uc3QgdG90YWxOb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RvdGFsJylcclxuICAgIGNvbnN0IHRvdGFsID0gcGFyc2VGbG9hdCh0b3RhbE5vZGUuaW5uZXJUZXh0LnJlcGxhY2UoL1xccy9nLCBcIlwiKSlcclxuXHJcbiAgICBjb25zdCB0b3RhbFZhbHVlID0gaXNJbmMgPyB0b3RhbCArIHByaWNlIDogdG90YWwgLSBwcmljZVxyXG5cclxuICAgIHN1bU5vZGUuaW5uZXJUZXh0ID0gZm9ybWF0TnVtYmVyKHByaWNlICogdmFsdWUpXHJcbiAgICB0b3RhbE5vZGUuaW5uZXJUZXh0ID0gZm9ybWF0TnVtYmVyKE1hdGguYWJzKHRvdGFsVmFsdWUpKVxyXG59XHJcblxyXG5jb25zdCBjYXJ0UmVxdWVzdCA9IHdpbmRvdy50aHJvdHRsZShmdW5jdGlvbiAoY29kZSwgdmFsKSB7XHJcbiAgICB3aW5kb3cuc2V0UHJvZHVjdFRvQ2FydCh7YXJ0OiBjb2RlLCBjb3VudDogdmFsfSlcclxufSwgMzAwMClcclxuXHJcbmNvbnN0IGRvdFJlcXVlc3QgPSB3aW5kb3cudGhyb3R0bGUoZnVuY3Rpb24gKGNvZGUsIHZhbCkge1xyXG4gICAgd2luZG93LnNldERvdFRvQ2FydCh7aWQ6IGNvZGUsIGNvdW50OiB2YWx9KVxyXG59LCAzMDAwKVxyXG5cclxuY29uc3QgaW5pdENhcnRDb3VudGVyID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcnRfX2NhbGMtY291bnRlciBidXR0b24nKSlcclxuXHJcbiAgICBidG5zLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zdCBpc0luYyA9IHRoaXMuZGF0YXNldC50eXBlID09PSAnaW5jJ1xyXG4gICAgICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpXHJcbiAgICAgICAgICAgIGNvbnN0IGRlY0J0biA9IHRoaXMucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCdbZGF0YS10eXBlPVwiZGVjXCInKVxyXG4gICAgICAgICAgICBsZXQgdmFsID0gaW5wdXQudmFsdWVcclxuXHJcbiAgICAgICAgICAgIHZhbCA9IGlzSW5jXHJcbiAgICAgICAgICAgICAgICA/IHBhcnNlSW50KHZhbCkgKyAxXHJcbiAgICAgICAgICAgICAgICA6IHBhcnNlSW50KHZhbCkgLSAxXHJcblxyXG4gICAgICAgICAgICBpZiAodmFsID09PSAwKSB2YWwrK1xyXG5cclxuICAgICAgICAgICAgZGVjQnRuLmRpc2FibGVkID0gISh2YWwgPiAxKVxyXG5cclxuICAgICAgICAgICAgaW5wdXQudmFsdWUgPSB2YWxcclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZVByb2R1Y3RTdW0oaW5wdXQsIGlzSW5jKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgY2FydEl0ZW0gPSB0aGlzLmNsb3Nlc3QoJy5jYXJ0X19pdGVtJylcclxuICAgICAgICAgICAgY29uc3QgY2FydERvdCA9IHRoaXMuY2xvc2VzdCgnLmNhcnRfX2RvdCcpXHJcblxyXG4gICAgICAgICAgICBpZiAoIWNhcnRJdGVtICYmICFjYXJ0RG90KSByZXR1cm5cclxuICAgICAgICAgICAgaWYgKGNhcnRJdGVtKSBjYXJ0UmVxdWVzdChjYXJ0SXRlbS5kYXRhc2V0LnByb2R1Y3RJZCwgdmFsKVxyXG4gICAgICAgICAgICBpZiAoY2FydERvdCkgZG90UmVxdWVzdChjYXJ0RG90LmRhdGFzZXQucHJvZHVjdElkLCB2YWwpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGdldFRvdGFsVmFsdWUgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjYXJ0VG90YWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG90YWwnKVxyXG5cclxuICAgIGlmIChjYXJ0VG90YWwpIHtcclxuICAgICAgICBjb25zdCB0b3RhbCA9IGNhcnRUb3RhbC5pbm5lclRleHRcclxuICAgICAgICByZXR1cm4gcGFyc2VJbnQodG90YWwucmVwbGFjZSgvXFxzL2csIFwiXCIpKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAwXHJcbn1cclxuXHJcbmNvbnN0IHVwZGF0ZVRvdGFsUHJpY2UgPSAodmFsKSA9PiB7XHJcbiAgICBjb25zdCBjYXJ0VG90YWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG90YWwnKVxyXG5cclxuICAgIGlmIChjYXJ0VG90YWwpIHtcclxuICAgICAgICBjYXJ0VG90YWwuaW5uZXJUZXh0ID0gZm9ybWF0TnVtYmVyKGdldFRvdGFsVmFsdWUoKSArIHZhbClcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgcmVzZXRUb3RhbFRleHQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB0ZXh0V3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJ0X19hY3Rpb25zLXRvdGFsJylcclxuICAgIHRleHRXcmFwLmlubmVySFRNTCA9ICc8cD7QkiDQutC+0YDQt9C40L3QtSDQvdC10YIg0YLQvtCy0LDRgNC+0LI8L3A+J1xyXG5cclxuICAgIGNvbnN0IGJ0bldyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FydF9fYWN0aW9ucy1idXR0b25zJylcclxuICAgIGNvbnN0IGJ0blNlYXJjaCA9IGJ0bldyYXAucXVlcnlTZWxlY3RvcignLmJ0bl9zZWFyY2gnKVxyXG4gICAgd2hpbGUgKGJ0bldyYXAuZmlyc3RDaGlsZCkgYnRuV3JhcC5yZW1vdmVDaGlsZChidG5XcmFwLmZpcnN0Q2hpbGQpXHJcbiAgICBidG5XcmFwLmFwcGVuZENoaWxkKGJ0blNlYXJjaClcclxufVxyXG5cclxuY29uc3QgY2hlY2tUb3RhbFByaWNlID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdG90YWwgPSBnZXRUb3RhbFZhbHVlKClcclxuICAgIGlmICh0b3RhbCA8PSAwKSByZXNldFRvdGFsVGV4dCgpXHJcbn1cclxuXHJcbmNvbnN0IGRlbFByb2R1Y3QgPSAoZWwpID0+IHtcclxuICAgIGxldCBoZWlnaHQgPSBlbC5vZmZzZXRIZWlnaHRcclxuXHJcbiAgICBlbC5zdHlsZS5tYXhIZWlnaHQgPSBoZWlnaHQgKyAncHgnXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBlbC5jbGFzc0xpc3QuYWRkKCdyZW1vdmVkJyksIDEwKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBlbC5yZW1vdmUoKSwgMTAwMClcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHNob3dBbmltRWxlbWVudHMoKVxyXG4gICAgICAgIHNldEFuaW1hdGlvbkVsbXMoKVxyXG4gICAgfSwgMzAwKVxyXG59XHJcblxyXG5jb25zdCBpbml0RGVsUHJvZEJ0bnMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FydF9fY2FsYyAuYnRuX2RlbCcpKVxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBwcm9kdWN0ID0gZWwuY2xvc2VzdCgnW2RhdGEtcHJvZHVjdF0nKVxyXG5cclxuICAgICAgICBpZiAoIXByb2R1Y3QpIHJldHVyblxyXG5cclxuICAgICAgICBjb25zdCBpc0RvdCA9IHByb2R1Y3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdjYXJ0X19kb3QnKVxyXG4gICAgICAgIGNvbnN0IHRvdGFsVGV4dCA9IHByb2R1Y3QucXVlcnlTZWxlY3RvcignW2RhdGEtdG90YWxdJykuaW5uZXJUZXh0XHJcbiAgICAgICAgY29uc3QgdG90YWwgPSBwYXJzZUludCh0b3RhbFRleHQucmVwbGFjZSgvXFxzL2csIFwiXCIpKVxyXG4gICAgICAgIGNvbnN0IGlucHV0ID0gcHJvZHVjdC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpXHJcbiAgICAgICAgY29uc3QgY29kZSA9IHByb2R1Y3QuZGF0YXNldC5wcm9kdWN0SWRcclxuXHJcbiAgICAgICAgY29uc3QgcHJvZHVjdE5hbWUgPSBpc0RvdFxyXG4gICAgICAgICAgICA/IHByb2R1Y3QucXVlcnlTZWxlY3RvcignLmNhcnRfX3RpdGxlJykuaW5uZXJUZXh0XHJcbiAgICAgICAgICAgIDogcHJvZHVjdC5xdWVyeVNlbGVjdG9yKCcuY2FydF9fc3VidGl0bGUnKS5pbm5lclRleHRcclxuXHJcbiAgICAgICAgaWYgKGlzRG90KSB7XHJcbiAgICAgICAgICAgIC8vINCj0LTQsNC70Y/QtdC8IERPVCAg0LDRgdC40L3RhdGA0L7QvdC90L4g0LjQtyDQkdCUXHJcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVEb3RGcm9tQ2FydCh7aWQ6IGNvZGUsIGNvdW50OiBwYXJzZUludChpbnB1dC52YWx1ZSl9KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vINCj0LTQsNC70Y/QtdC8INC/0YDQvtC00YPQutGCINCw0YHQuNC90YXRgNC+0L3QvdC+INC40Lcg0JHQlFxyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlUHJvZHVjdEZyb21DYXJ0KHthcnQ6IGNvZGUsIGNvdW50OiBwYXJzZUludChpbnB1dC52YWx1ZSl9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGVsUHJvZHVjdChwcm9kdWN0KSAvLyDQo9C00LDQu9GP0LXQvCDQv9GA0L7QtNGD0LrRgiDRgSDRjdC60YDQsNC90LBcclxuICAgICAgICB1cGRhdGVUb3RhbFByaWNlKHRvdGFsICogLTEpXHJcbiAgICAgICAgY2hlY2tUb3RhbFByaWNlKClcclxuICAgICAgICBzaG93TW9kYWxNc2cocHJvZHVjdE5hbWUsICfQo9C00LDQu9C10L0g0LjQtyDQutC+0YDQt9C40L3RiycpXHJcbiAgICB9KSlcclxufVxyXG5cclxuY29uc3Qgc2V0RXJyb3JPbkNvbnRyb2xsZXIgPSAoaW5wdXROb2RlLCBlcnJvclRleHQpID0+IHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0Tm9kZS5wYXJlbnROb2RlXHJcbiAgICBjb25zdCBtZXNzYWdlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5lcnJvci1tZXNzYWdlJylcclxuXHJcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaGFzLWVycm9yJylcclxuICAgIG1lc3NhZ2UuaW5uZXJUZXh0ID0gZXJyb3JUZXh0XHJcblxyXG4gICAgaW5wdXROb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtZXJyb3InKVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgcmVzZXRFcnJvck9uQ29udHJvbGxlciA9IChpbnB1dE5vZGUpID0+IHtcclxuICAgIGlucHV0Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1lcnJvcicpXHJcbn1cclxuXHJcbmNvbnN0IGNsZWFyQ2FydCA9ICgpID0+IHtcclxuICAgIGNvbnN0IHByb2R1Y3RzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1wcm9kdWN0XScpKVxyXG4gICAgcHJvZHVjdHMuZm9yRWFjaChlbCA9PiBkZWxQcm9kdWN0KGVsKSlcclxuICAgIHJlc2V0VG90YWxUZXh0KClcclxufVxyXG5cclxuY29uc3QgaW5pdE9yZGVyU3VibWl0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZXRPcmRlckZvcm0nKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghZm9ybSkgcmV0dXJuXHJcbiAgICAgICAgLy8g0JXRgdC70Lgg0YTQvtGA0LzQsCDRg9C20LUg0LHRi9C70LAg0LjQvdC40YbQuNCw0LvQuNC30LjRgNC+0LLQsNC90LAsINC90LUg0LTQtdC70LDQtdC8INGN0YLQvtCz0L4g0L/QvtCy0YLQvtGA0L3QvlxyXG4gICAgICAgIGlmIChmb3JtLmRhdGFzZXQub3JkZXIgPT09ICdpbml0Jykge1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9ybS5kYXRhc2V0Lm9yZGVyID0gJ2luaXQnXHJcbiAgICB9XHJcbiAgICBjb25zdCBmb3JtVmFsaWQgPSB7bmFtZTogdHJ1ZSwgcGhvbmU6IHRydWUsIGVtYWlsOiB0cnVlLCBjaXR5OiB0cnVlfVxyXG4gICAgY29uc3QgcGhvbmVOdW1iZXIgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGhvbmVcIl0nKVxyXG5cclxuICAgIC8vIFBob25lIG1hc2tpbmdcclxuICAgIGNvbnN0IHBob25lTWFza09wdGlvbnMgPSB7XHJcbiAgICAgICAgbWFzazogJyt7N30gKDAwMCkgMDAwLTAwLTAwJyxcclxuICAgICAgICBsYXp5OiB0cnVlLFxyXG4gICAgICAgIHBsYWNlaG9sZGVyQ2hhcjogJyMnXHJcbiAgICB9XHJcbiAgICBjb25zdCBwaG9uZU1hc2sgPSBJTWFzayhcclxuICAgICAgICBwaG9uZU51bWJlcixcclxuICAgICAgICBwaG9uZU1hc2tPcHRpb25zXHJcbiAgICApXHJcblxyXG4gICAgcGhvbmVOdW1iZXIuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoKSA9PiBwaG9uZU1hc2sudXBkYXRlT3B0aW9ucyh7bGF6eTogZmFsc2V9KSlcclxuICAgIHBob25lTnVtYmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiBwaG9uZU1hc2sudXBkYXRlT3B0aW9ucyh7bGF6eTogdHJ1ZX0pKVxyXG5cclxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICAgICAgY2xlYXJSZXNwb25zZUNpdGllcyhlLnRhcmdldClcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJuYW1lXCJdJylcclxuICAgICAgICBjb25zdCBwaG9uZSA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJwaG9uZVwiXScpXHJcbiAgICAgICAgY29uc3QgZW1haWwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZW1haWxcIl0nKVxyXG4gICAgICAgIGNvbnN0IGNpdHkgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiY2l0eVwiXScpXHJcbiAgICAgICAgY29uc3QgY2l0eUlkID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImNpdHktaWRcIl0nKVxyXG5cclxuICAgICAgICAvLyBDaGVjayBuYW1lXHJcbiAgICAgICAgaWYgKG5hbWUudmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHNldEVycm9yT25Db250cm9sbGVyKG5hbWUsICfQl9Cw0L/QvtC70L3QuNGC0LUg0L/QvtC70LUg0KTQmNCeJylcclxuICAgICAgICAgICAgZm9ybVZhbGlkLm5hbWUgPSBmYWxzZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc2V0RXJyb3JPbkNvbnRyb2xsZXIobmFtZSlcclxuICAgICAgICAgICAgZm9ybVZhbGlkLm5hbWUgPSB0cnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBwaG9uZVxyXG4gICAgICAgIGlmIChwaG9uZS52YWx1ZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgc2V0RXJyb3JPbkNvbnRyb2xsZXIocGhvbmUsICfQl9Cw0L/QvtC70L3QuNGC0LUg0L/QvtC70LUg0KLQtdC70LXRhNC+0L0nKVxyXG4gICAgICAgICAgICBmb3JtVmFsaWQucGhvbmUgPSBmYWxzZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93LnZhbGlkYXRlUGhvbmUocGFyc2VJbnQocGhvbmVNYXNrLnVubWFza2VkVmFsdWUpKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzZXRFcnJvck9uQ29udHJvbGxlcihwaG9uZSlcclxuICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5waG9uZSA9IHRydWVcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNldEVycm9yT25Db250cm9sbGVyKHBob25lLCAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INC90L7QvNC10YAg0YLQtdC70LXRhNC+0L3QsCcpXHJcbiAgICAgICAgICAgICAgICBmb3JtVmFsaWQucGhvbmUgPSBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBlbWFpbFxyXG4gICAgICAgIGlmIChlbWFpbC52YWx1ZSAhPT0gJycpIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy52YWxpZGF0ZUVtYWlsKGVtYWlsLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzZXRFcnJvck9uQ29udHJvbGxlcihlbWFpbClcclxuICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IHRydWVcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNldEVycm9yT25Db250cm9sbGVyKGVtYWlsLCAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLJylcclxuICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXNldEVycm9yT25Db250cm9sbGVyKGVtYWlsKVxyXG4gICAgICAgICAgICBmb3JtVmFsaWQuZW1haWwgPSB0cnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBjaXR5XHJcbiAgICAgICAgaWYgKCFjaXR5SWQpIHtcclxuICAgICAgICAgICAgc2V0RXJyb3JPbkNvbnRyb2xsZXIoY2l0eSwgJ9Cd0LXQutC+0YDRgNC10LrRgtC90L4g0YPQutCw0LfQsNC9INCT0L7RgNC+0LQnKVxyXG4gICAgICAgICAgICBmb3JtVmFsaWQuY2l0eSA9IGZhbHNlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzZXRFcnJvck9uQ29udHJvbGxlcihjaXR5KVxyXG4gICAgICAgICAgICBmb3JtVmFsaWQuY2l0eSA9IHRydWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNlbmRpbmcgZm9ybSBkYXRhXHJcbiAgICAgICAgaWYgKGZvcm1WYWxpZC5uYW1lICYmIGZvcm1WYWxpZC5waG9uZSAmJiBmb3JtVmFsaWQuZW1haWwpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZW5kIGZyb21EYXRhIHRvIGJhY2sgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgW25hbWUsIHZhbHVlXSBvZiBmb3JtRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7bmFtZX06ICR7dmFsdWV9YCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcm0ucmVzZXQoKVxyXG4gICAgICAgICAgICBjbGVhckNhcnQoKVxyXG4gICAgICAgICAgICB0b2dnbGVNb2RhbERpYWxvZygnI29yZGVyU2VudE1zZycpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgU2F2ZUFzUERGID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgc2hvd0hpZGRlbkVsZW1lbnRzID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGFuaW1hdGlvbkVsbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuYW5pbWF0aW9uLWVsZW1lbnQnKSlcclxuXHJcbiAgICAgICAgYW5pbWF0aW9uRWxtcy5mb3JFYWNoKGVsID0+IGVsXHJcbiAgICAgICAgICAgIC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRpb24tZWxlbWVudCcpKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHByaW50UGFnZSA9ICgpID0+IHtcclxuICAgICAgICBzaG93SGlkZGVuRWxlbWVudHMoKVxyXG4gICAgICAgIHdpbmRvdy5wcmludCgpXHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ1NhdmVBc1BERicpXHJcbiAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcHJpbnRQYWdlKVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XHJcbiAgICAgICAgaWYgKGUuY3RybEtleSAmJiBlLmtleSA9PT0gJ3AnKSB7XHJcbiAgICAgICAgICAgIHNob3dIaWRkZW5FbGVtZW50cygpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JlcHJpbnQnLCBzaG93SGlkZGVuRWxlbWVudHMpXHJcbn1cclxuXHJcbmNvbnN0IGNpdHlJbnB1dEhhbmRsZXIgPSB3aW5kb3cudGhyb3R0bGUoYXN5bmMgZnVuY3Rpb24gKGUpIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGUudGFyZ2V0LnBhcmVudE5vZGVcclxuICAgIGNvbnN0IHF1ZXJ5ID0gZS50YXJnZXQudmFsdWUudHJpbSgpXHJcblxyXG4gICAgY29uc3QgdXJsID0gd2luZG93LnJlcXVlc3RDaXR5TGlua1xyXG4gICAgaWYgKCF1cmwpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfQndC10LrQvtGA0YDQtdC60YLQvdGL0LkgVVJMIEFQSSDQt9Cw0L/RgNC+0YHQsCDQs9C+0YDQvtC00LAhJylcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGlmIChxdWVyeSA9PT0gJycpIHtcclxuICAgICAgICAgICAgY2xlYXJSZXNwb25zZUNpdGllcyhlLnRhcmdldClcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnbG9hZGluZycpXHJcblxyXG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHVybCArIGA/cXVlcnk9JHtxdWVyeX1gKVxyXG5cclxuICAgICAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0LfQsNC/0YDQvtGB0LAg0LogQVBJINCy0YvQsdC+0YDQsCDQs9C+0YDQvtC00LAhJylcclxuXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuXHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICAgICAgLy8g0JXRgdC70Lgg0LIg0L/RgNC40YjQtdC00YjQuNGFINC00LDQvdC90YvQtSDQtdGB0YLRjCDRgtC+0YfQvdC+INGB0L7QstC/0LDQtNC10L3QuNC1INCz0L7RgNC+0LTQsCwg0YHRgNCw0LfRgyDRgdGC0LDQstC40Lwg0LXQs9C+XHJcbiAgICAgICAgY29uc3QgbWF0Y2hlZENpdHkgPSBjaXR5UmVxdWVzdENoZWNrZXIocXVlcnksIGRhdGEpXHJcblxyXG4gICAgICAgIGlmIChtYXRjaGVkQ2l0eSkge1xyXG4gICAgICAgICAgICBlLnRhcmdldC52YWx1ZSA9IG1hdGNoZWRDaXR5Lm5hbWVcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQldGB0LvQuCDQs9C+0YDQvtC0INCy0LLQtdC00LXQvSDQvdC10LrQvtGA0YDQtdC60YLQvdC+LCDQv9C+0LrQsNC30YvQstCw0LXQvCDRgdC/0LjRgdC+0Log0LTQu9GPINCy0YvQsdC+0YDQsFxyXG4gICAgICAgIHVwZGF0ZVJlc3BvbnNlQ2l0aWVzKGUudGFyZ2V0LCBkYXRhKVxyXG5cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2xvYWRpbmcnKVxyXG4gICAgfVxyXG59LCAxMDAwKVxyXG5cclxuZnVuY3Rpb24gY2l0eVJlcXVlc3RDaGVja2VyKHF1ZXJ5LCBjaXRpZXMpIHtcclxuICAgIGNvbnN0IG1hdGNoID0gY2l0aWVzLmZpbHRlcihjaXR5ID0+XHJcbiAgICAgICAgY2l0eS5uYW1lLnRvTG93ZXJDYXNlKCkgPT09IHF1ZXJ5LnRvTG93ZXJDYXNlKCkpXHJcbiAgICByZXR1cm4gbWF0Y2hbMF1cclxufVxyXG5cclxuY29uc3QgaW5pdENpdHlTZWxlY3RvciA9ICgpID0+IHtcclxuICAgIHtcclxuICAgICAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NldE9yZGVyRm9ybScpXHJcbiAgICAgICAgaWYgKCFmb3JtKSByZXR1cm5cclxuICAgICAgICAvLyDQldGB0LvQuCDRhNC+0YDQvNCwINGD0LbQtSDQsdGL0LvQsCDQuNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0L3QsCwg0L3QtSDQtNC10LvQsNC10Lwg0Y3RgtC+0LPQviDQv9C+0LLRgtC+0YDQvdC+XHJcbiAgICAgICAgaWYgKGZvcm0uZGF0YXNldC5jaXR5ID09PSAnaW5pdCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcm0uZGF0YXNldC5jaXR5ID0gJ2luaXQnXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnN0IHNlbGVjdG9ycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xhYmVsOmhhcyhbbmFtZT1cImNpdHlcIl0pJylcclxuXHJcbiAgICBpZiAoc2VsZWN0b3JzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgc2VsZWN0b3JzLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlucHV0ID0gZWwucXVlcnlTZWxlY3RvcignaW5wdXQnKVxyXG5cclxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpbnB1dC52YWx1ZS50cmltKCkgPT09ICcnKSBjbGVhclJlc3BvbnNlQ2l0aWVzKGlucHV0KVxyXG4gICAgICAgICAgICBpZiAoZS5pc1RydXN0ZWQgPT09IGZhbHNlKSByZXR1cm5cclxuICAgICAgICAgICAgY2l0eUlucHV0SGFuZGxlcihlKSAvLyDQvtGC0L/RgNCw0LLQu9GP0LXRgiDQt9Cw0L/RgNC+0YEg0L3QsCDRgdC10YDQstC10YBcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJSZXNwb25zZUNpdGllcyhpbnB1dE5vZGUpIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0Tm9kZS5wYXJlbnROb2RlXHJcbiAgICBjb25zdCBsaXN0ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jaXR5LXNlbGVjdG9yJylcclxuXHJcbiAgICBpZiAoIWxpc3QpIHJldHVyblxyXG5cclxuICAgIGxpc3QucmVtb3ZlKClcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUmVzcG9uc2VDaXRpZXMoaW5wdXROb2RlLCBjaXRpZXMpIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0Tm9kZS5wYXJlbnROb2RlXHJcbiAgICBjb25zdCBzZWxlY3RvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgc2VsZWN0b3IuY2xhc3NMaXN0LmFkZCgnY2l0eS1zZWxlY3RvcicpXHJcblxyXG4gICAgY29uc3Qgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgd3JhcC5jbGFzc0xpc3QuYWRkKCdjaXR5LXNlbGVjdG9yX193cmFwJylcclxuICAgIHNlbGVjdG9yLmFwcGVuZENoaWxkKHdyYXApXHJcblxyXG4gICAgY29uc3QgbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgbGlzdC5jbGFzc0xpc3QuYWRkKCdjaXR5LXNlbGVjdG9yX19saXN0JylcclxuICAgIHdyYXAuYXBwZW5kQ2hpbGQobGlzdClcclxuICAgIGNpdGllcy5mb3JFYWNoKGNpdHkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgICAgICBpdGVtLmNsYXNzTGlzdC5hZGQoJ2NpdHktc2VsZWN0b3JfX2l0ZW0nKVxyXG4gICAgICAgIGl0ZW0uc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgY2l0eS5pZClcclxuICAgICAgICBpdGVtLnRleHRDb250ZW50ID0gY2l0eS5uYW1lXHJcbiAgICAgICAgbGlzdC5hcHBlbmRDaGlsZChpdGVtKVxyXG5cclxuICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiBjaXR5SXRlbUNsaWNrSGFuZGxlcihlLCBpbnB1dE5vZGUpKVxyXG4gICAgfSlcclxuXHJcbiAgICBjbGVhclJlc3BvbnNlQ2l0aWVzKGlucHV0Tm9kZSlcclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWxlY3RvcilcclxufVxyXG5cclxuZnVuY3Rpb24gY2l0eUl0ZW1DbGlja0hhbmRsZXIoZSwgaW5wdXROb2RlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICBjb25zdCBjaXR5ID0gZS50YXJnZXQuaW5uZXJUZXh0XHJcbiAgICBjb25zdCBpZCA9IGUudGFyZ2V0LmRhdGFzZXQuaWRcclxuXHJcbiAgICBpbnB1dE5vZGUudmFsdWUgPSBjaXR5XHJcbiAgICBjb25zdCBldmVudCA9IG5ldyBFdmVudCgnaW5wdXQnLCB7XHJcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICBpbnB1dE5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBpbnB1dE5vZGUucGFyZW50Tm9kZVxyXG4gICAgY29uc3Qgc2VsZWN0b3IgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmNpdHktc2VsZWN0b3InKVxyXG4gICAgc2VsZWN0b3IucmVtb3ZlKClcclxufVxyXG5cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKGluaXRDYXJ0Q291bnRlcilcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChpbml0RGVsUHJvZEJ0bnMpXHJcbiAgICB3aW5kb3cuc2FmZUNhbGwoaW5pdE9yZGVyU3VibWl0KVxyXG4gICAgd2luZG93LnNhZmVDYWxsKFNhdmVBc1BERilcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChpbml0Q2l0eVNlbGVjdG9yKVxyXG59KVxyXG5cclxuIl0sImZpbGUiOiJjYXJ0LmpzIn0=
