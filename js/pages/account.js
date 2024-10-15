// Для всех страниц кабнета добавляем один файл скрптов - account.js

// Change user password --- START
const initChangePassFormToggles = () => {
    let btns = document.querySelectorAll('#changePasswordForm .account__form-toggle-pass')
    btns = Array.from(btns)

    btns.forEach(el => el.addEventListener('click', function() {
        const input = this.parentNode.querySelector('input')

        if (input.type === 'text') {
            input.type = 'password'
            this.classList.remove('pass-visible')
        } else {
            input.type = 'text'
            this.classList.add('pass-visible')
        }
    }))
}

const blockChangePassForm = () => {
    let button = document.querySelector('#changePasswordForm .account__form-button button')
    button.disabled = true

    setTimeout(() => button.disabled = false, 5000)
}

const changePasswordFormData = {
    currentLength: true,
    newLength: true,
    isEqual: true
}

const resetAllErrorsPasswordForm = () => {
    let controllers = document.querySelectorAll('#changePasswordForm .account__form-controller')
    controllers = Array.from(controllers)
    controllers.forEach(el => el.classList.remove('has-error'))
}

const checkPassLength = (value) => {
    return value.length >= 8
}

const addInputPassHandler = (input) => {
    input.addEventListener('input', () => {
        const container = input.closest('.account__form-controller')
        container.classList.remove('has-error')
    })
}

const checkChangePassForm = (currentInput, newInput) => {
    const isFormValid = changePasswordFormData.currentLength
        && changePasswordFormData.newLength
        && changePasswordFormData.isEqual

    const controllerCurrent = currentInput.closest('.account__form-controller')
    const currentError = controllerCurrent.querySelector('.account__form-error')

    const controllerNew = newInput.closest('.account__form-controller')
    const newError = controllerNew.querySelector('.account__form-error')

    if (!changePasswordFormData.currentLength) {
        currentError.innerText = 'Пароль должен содержать минимум 8 символов'
        controllerCurrent.classList.add('has-error')
    }

    if (!changePasswordFormData.newLength) {
        newError.innerText = 'Пароль должен содержать минимум 8 символов'
        controllerNew.classList.add('has-error')
    } else {
        if(!changePasswordFormData.isEqual) {
            newError.innerText = 'Пароли должны совпадать'
            controllerNew.classList.add('has-error')
        }
    }

    changePasswordFormData.currentLength = true
    changePasswordFormData.newLength = true
    changePasswordFormData.isEqual = true

    return isFormValid
}

const initChangePasswordForm = () => {
    const form = document.querySelector('#changePasswordForm')

    if (!form) return

    const currentPass = form.querySelector('#currentPass')
    const newPass = form.querySelector('#newPass')

    // Handlers
    addInputPassHandler(currentPass)
    addInputPassHandler(newPass)

    form.addEventListener('submit', function(e) {

        // Check value length
        changePasswordFormData.currentLength = checkPassLength(currentPass.value)
        changePasswordFormData.newLength= checkPassLength(newPass.value)
        changePasswordFormData.isEqual = currentPass.value === newPass.value

        // Check form
        if (checkChangePassForm(currentPass, newPass)) {
            resetAllErrorsPasswordForm()
            console.log('Fetching request for updating user password');

            window.showModalMsg('Изменение пароля', 'Пароль был успешно изменен')
            blockChangePassForm()
        }
    })
}
// Change user password --- FINISH

// Update user data --- START
const setErrorOnUserDataController = (inputNode, errorText) => {
    const container = inputNode.closest('.account__form-controller')
    const message = container.querySelector('.account__form-error')

    container.classList.add('has-error')
    message.innerText = errorText

    inputNode.addEventListener('input', () => {
        container.classList.remove('has-error')
    })
}

const resetErrorOnUserDataController = (inputNode) => {
    const container = inputNode.closest('.account__form-controller')
    container.classList.remove('has-error')
}

const blockUserDataForm = () => {
    let button = document.querySelector('#changeUserDataForm .account__form-button button')
    button.disabled = true

    setTimeout(() => button.disabled = false, 5000)
}

const initChangeUserDataForm = () => {
    const form = document.getElementById('changeUserDataForm')

    if (!form) return

    const formValid = {name: true, phone: true, email: true}
    
    
    
    
    // const phoneNumber = form.querySelector('[name="phone"]')

    // // Phone masking
    // const phoneMaskOptions = {
    //     mask: '+{7} (000) 000-00-00',
    //     lazy: true,
    //     placeholderChar: '#'
    // }
    // const phoneMask = IMask(
    //     phoneNumber,
    //     phoneMaskOptions
    // )

    // phoneNumber.addEventListener('focus', () => phoneMask.updateOptions({lazy: false}))
    // phoneNumber.addEventListener('blur', () => phoneMask.updateOptions({lazy: true}))







    form.addEventListener('submit', function(e) {

        const name  = this.querySelector('[name="name"]')
        const phone = this.querySelector('[name="phone"]')
        const email = this.querySelector('[name="email"]')

        // Check name
        if (name.value === '') {
            setErrorOnUserDataController(name, 'Заполните поле ФИО')
            formValid.name = false
        } else {
            resetErrorOnUserDataController(name)
            formValid.name = true
        }

        // Check phone
        if (phone.value === '') {
            setErrorOnUserDataController(phone, 'Заполните поле Телефон')
            formValid.phone = false
        } else {
            if (window.validatePhone(window.clearPhone(phone.value))) {
                resetErrorOnUserDataController(phone)
                formValid.phone = true
            } else {
                setErrorOnUserDataController(phone, 'Некорректный номер телефона')
                formValid.phone = false
            }
        }

        // Check email
        if (email.value !== '') {
            if (window.validateEmail(email.value)) {
                resetErrorOnUserDataController(email)
                formValid.email = true
            } else {
                setErrorOnUserDataController(email, 'Некорректный адрес электронной почты')
                formValid.email = false
            }
        } else {
            resetErrorOnUserDataController(email)
            formValid.email = true
        }

        // Senging form data
        if (formValid.name && formValid.phone && formValid.email) {

            const formData = new FormData(form);

            // Обязательно удалить после внедрения
            for (let [name, value] of formData) {
                console.log(`${name}: ${value}`);
            }

            console.log('Fetching request for updating user data');

            window.showModalMsg('Личные данные', 'Личные данные изменены')
            blockUserDataForm()
        }
    })
}
// Update user data --- FINISH

window.addEventListener('load', () => {
    // Change user password
    initChangePassFormToggles()
    initChangePasswordForm()

    // Update user data
    initChangeUserDataForm()
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhY2NvdW50L3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyDQlNC70Y8g0LLRgdC10YUg0YHRgtGA0LDQvdC40YYg0LrQsNCx0L3QtdGC0LAg0LTQvtCx0LDQstC70Y/QtdC8INC+0LTQuNC9INGE0LDQudC7INGB0LrRgNC/0YLQvtCyIC0gYWNjb3VudC5qc1xyXG5cclxuLy8gQ2hhbmdlIHVzZXIgcGFzc3dvcmQgLS0tIFNUQVJUXHJcbmNvbnN0IGluaXRDaGFuZ2VQYXNzRm9ybVRvZ2dsZXMgPSAoKSA9PiB7XHJcbiAgICBsZXQgYnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNjaGFuZ2VQYXNzd29yZEZvcm0gLmFjY291bnRfX2Zvcm0tdG9nZ2xlLXBhc3MnKVxyXG4gICAgYnRucyA9IEFycmF5LmZyb20oYnRucylcclxuXHJcbiAgICBidG5zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpXHJcblxyXG4gICAgICAgIGlmIChpbnB1dC50eXBlID09PSAndGV4dCcpIHtcclxuICAgICAgICAgICAgaW5wdXQudHlwZSA9ICdwYXNzd29yZCdcclxuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdwYXNzLXZpc2libGUnKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlucHV0LnR5cGUgPSAndGV4dCdcclxuICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdwYXNzLXZpc2libGUnKVxyXG4gICAgICAgIH1cclxuICAgIH0pKVxyXG59XHJcblxyXG5jb25zdCBibG9ja0NoYW5nZVBhc3NGb3JtID0gKCkgPT4ge1xyXG4gICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaGFuZ2VQYXNzd29yZEZvcm0gLmFjY291bnRfX2Zvcm0tYnV0dG9uIGJ1dHRvbicpXHJcbiAgICBidXR0b24uZGlzYWJsZWQgPSB0cnVlXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBidXR0b24uZGlzYWJsZWQgPSBmYWxzZSwgNTAwMClcclxufVxyXG5cclxuY29uc3QgY2hhbmdlUGFzc3dvcmRGb3JtRGF0YSA9IHtcclxuICAgIGN1cnJlbnRMZW5ndGg6IHRydWUsXHJcbiAgICBuZXdMZW5ndGg6IHRydWUsXHJcbiAgICBpc0VxdWFsOiB0cnVlXHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0QWxsRXJyb3JzUGFzc3dvcmRGb3JtID0gKCkgPT4ge1xyXG4gICAgbGV0IGNvbnRyb2xsZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnI2NoYW5nZVBhc3N3b3JkRm9ybSAuYWNjb3VudF9fZm9ybS1jb250cm9sbGVyJylcclxuICAgIGNvbnRyb2xsZXJzID0gQXJyYXkuZnJvbShjb250cm9sbGVycylcclxuICAgIGNvbnRyb2xsZXJzLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLWVycm9yJykpXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrUGFzc0xlbmd0aCA9ICh2YWx1ZSkgPT4ge1xyXG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+PSA4XHJcbn1cclxuXHJcbmNvbnN0IGFkZElucHV0UGFzc0hhbmRsZXIgPSAoaW5wdXQpID0+IHtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0LmNsb3Nlc3QoJy5hY2NvdW50X19mb3JtLWNvbnRyb2xsZXInKVxyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtZXJyb3InKVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgY2hlY2tDaGFuZ2VQYXNzRm9ybSA9IChjdXJyZW50SW5wdXQsIG5ld0lucHV0KSA9PiB7XHJcbiAgICBjb25zdCBpc0Zvcm1WYWxpZCA9IGNoYW5nZVBhc3N3b3JkRm9ybURhdGEuY3VycmVudExlbmd0aFxyXG4gICAgICAgICYmIGNoYW5nZVBhc3N3b3JkRm9ybURhdGEubmV3TGVuZ3RoXHJcbiAgICAgICAgJiYgY2hhbmdlUGFzc3dvcmRGb3JtRGF0YS5pc0VxdWFsXHJcblxyXG4gICAgY29uc3QgY29udHJvbGxlckN1cnJlbnQgPSBjdXJyZW50SW5wdXQuY2xvc2VzdCgnLmFjY291bnRfX2Zvcm0tY29udHJvbGxlcicpXHJcbiAgICBjb25zdCBjdXJyZW50RXJyb3IgPSBjb250cm9sbGVyQ3VycmVudC5xdWVyeVNlbGVjdG9yKCcuYWNjb3VudF9fZm9ybS1lcnJvcicpXHJcblxyXG4gICAgY29uc3QgY29udHJvbGxlck5ldyA9IG5ld0lucHV0LmNsb3Nlc3QoJy5hY2NvdW50X19mb3JtLWNvbnRyb2xsZXInKVxyXG4gICAgY29uc3QgbmV3RXJyb3IgPSBjb250cm9sbGVyTmV3LnF1ZXJ5U2VsZWN0b3IoJy5hY2NvdW50X19mb3JtLWVycm9yJylcclxuXHJcbiAgICBpZiAoIWNoYW5nZVBhc3N3b3JkRm9ybURhdGEuY3VycmVudExlbmd0aCkge1xyXG4gICAgICAgIGN1cnJlbnRFcnJvci5pbm5lclRleHQgPSAn0J/QsNGA0L7Qu9GMINC00L7Qu9C20LXQvSDRgdC+0LTQtdGA0LbQsNGC0Ywg0LzQuNC90LjQvNGD0LwgOCDRgdC40LzQstC+0LvQvtCyJ1xyXG4gICAgICAgIGNvbnRyb2xsZXJDdXJyZW50LmNsYXNzTGlzdC5hZGQoJ2hhcy1lcnJvcicpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFjaGFuZ2VQYXNzd29yZEZvcm1EYXRhLm5ld0xlbmd0aCkge1xyXG4gICAgICAgIG5ld0Vycm9yLmlubmVyVGV4dCA9ICfQn9Cw0YDQvtC70Ywg0LTQvtC70LbQtdC9INGB0L7QtNC10YDQttCw0YLRjCDQvNC40L3QuNC80YPQvCA4INGB0LjQvNCy0L7Qu9C+0LInXHJcbiAgICAgICAgY29udHJvbGxlck5ldy5jbGFzc0xpc3QuYWRkKCdoYXMtZXJyb3InKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBpZighY2hhbmdlUGFzc3dvcmRGb3JtRGF0YS5pc0VxdWFsKSB7XHJcbiAgICAgICAgICAgIG5ld0Vycm9yLmlubmVyVGV4dCA9ICfQn9Cw0YDQvtC70Lgg0LTQvtC70LbQvdGLINGB0L7QstC/0LDQtNCw0YLRjCdcclxuICAgICAgICAgICAgY29udHJvbGxlck5ldy5jbGFzc0xpc3QuYWRkKCdoYXMtZXJyb3InKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VQYXNzd29yZEZvcm1EYXRhLmN1cnJlbnRMZW5ndGggPSB0cnVlXHJcbiAgICBjaGFuZ2VQYXNzd29yZEZvcm1EYXRhLm5ld0xlbmd0aCA9IHRydWVcclxuICAgIGNoYW5nZVBhc3N3b3JkRm9ybURhdGEuaXNFcXVhbCA9IHRydWVcclxuXHJcbiAgICByZXR1cm4gaXNGb3JtVmFsaWRcclxufVxyXG5cclxuY29uc3QgaW5pdENoYW5nZVBhc3N3b3JkRm9ybSA9ICgpID0+IHtcclxuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2hhbmdlUGFzc3dvcmRGb3JtJylcclxuXHJcbiAgICBpZiAoIWZvcm0pIHJldHVyblxyXG5cclxuICAgIGNvbnN0IGN1cnJlbnRQYXNzID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcjY3VycmVudFBhc3MnKVxyXG4gICAgY29uc3QgbmV3UGFzcyA9IGZvcm0ucXVlcnlTZWxlY3RvcignI25ld1Bhc3MnKVxyXG5cclxuICAgIC8vIEhhbmRsZXJzXHJcbiAgICBhZGRJbnB1dFBhc3NIYW5kbGVyKGN1cnJlbnRQYXNzKVxyXG4gICAgYWRkSW5wdXRQYXNzSGFuZGxlcihuZXdQYXNzKVxyXG5cclxuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG5cclxuICAgICAgICAvLyBDaGVjayB2YWx1ZSBsZW5ndGhcclxuICAgICAgICBjaGFuZ2VQYXNzd29yZEZvcm1EYXRhLmN1cnJlbnRMZW5ndGggPSBjaGVja1Bhc3NMZW5ndGgoY3VycmVudFBhc3MudmFsdWUpXHJcbiAgICAgICAgY2hhbmdlUGFzc3dvcmRGb3JtRGF0YS5uZXdMZW5ndGg9IGNoZWNrUGFzc0xlbmd0aChuZXdQYXNzLnZhbHVlKVxyXG4gICAgICAgIGNoYW5nZVBhc3N3b3JkRm9ybURhdGEuaXNFcXVhbCA9IGN1cnJlbnRQYXNzLnZhbHVlID09PSBuZXdQYXNzLnZhbHVlXHJcblxyXG4gICAgICAgIC8vIENoZWNrIGZvcm1cclxuICAgICAgICBpZiAoY2hlY2tDaGFuZ2VQYXNzRm9ybShjdXJyZW50UGFzcywgbmV3UGFzcykpIHtcclxuICAgICAgICAgICAgcmVzZXRBbGxFcnJvcnNQYXNzd29yZEZvcm0oKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmV0Y2hpbmcgcmVxdWVzdCBmb3IgdXBkYXRpbmcgdXNlciBwYXNzd29yZCcpO1xyXG5cclxuICAgICAgICAgICAgd2luZG93LnNob3dNb2RhbE1zZygn0JjQt9C80LXQvdC10L3QuNC1INC/0LDRgNC+0LvRjycsICfQn9Cw0YDQvtC70Ywg0LHRi9C7INGD0YHQv9C10YjQvdC+INC40LfQvNC10L3QtdC9JylcclxuICAgICAgICAgICAgYmxvY2tDaGFuZ2VQYXNzRm9ybSgpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG4vLyBDaGFuZ2UgdXNlciBwYXNzd29yZCAtLS0gRklOSVNIXHJcblxyXG4vLyBVcGRhdGUgdXNlciBkYXRhIC0tLSBTVEFSVFxyXG5jb25zdCBzZXRFcnJvck9uVXNlckRhdGFDb250cm9sbGVyID0gKGlucHV0Tm9kZSwgZXJyb3JUZXh0KSA9PiB7XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBpbnB1dE5vZGUuY2xvc2VzdCgnLmFjY291bnRfX2Zvcm0tY29udHJvbGxlcicpXHJcbiAgICBjb25zdCBtZXNzYWdlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5hY2NvdW50X19mb3JtLWVycm9yJylcclxuXHJcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaGFzLWVycm9yJylcclxuICAgIG1lc3NhZ2UuaW5uZXJUZXh0ID0gZXJyb3JUZXh0XHJcblxyXG4gICAgaW5wdXROb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtZXJyb3InKVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgcmVzZXRFcnJvck9uVXNlckRhdGFDb250cm9sbGVyID0gKGlucHV0Tm9kZSkgPT4ge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gaW5wdXROb2RlLmNsb3Nlc3QoJy5hY2NvdW50X19mb3JtLWNvbnRyb2xsZXInKVxyXG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1lcnJvcicpXHJcbn1cclxuXHJcbmNvbnN0IGJsb2NrVXNlckRhdGFGb3JtID0gKCkgPT4ge1xyXG4gICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaGFuZ2VVc2VyRGF0YUZvcm0gLmFjY291bnRfX2Zvcm0tYnV0dG9uIGJ1dHRvbicpXHJcbiAgICBidXR0b24uZGlzYWJsZWQgPSB0cnVlXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBidXR0b24uZGlzYWJsZWQgPSBmYWxzZSwgNTAwMClcclxufVxyXG5cclxuY29uc3QgaW5pdENoYW5nZVVzZXJEYXRhRm9ybSA9ICgpID0+IHtcclxuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhbmdlVXNlckRhdGFGb3JtJylcclxuXHJcbiAgICBpZiAoIWZvcm0pIHJldHVyblxyXG5cclxuICAgIGNvbnN0IGZvcm1WYWxpZCA9IHtuYW1lOiB0cnVlLCBwaG9uZTogdHJ1ZSwgZW1haWw6IHRydWV9XHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbiAgICBcclxuICAgIC8vIGNvbnN0IHBob25lTnVtYmVyID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cInBob25lXCJdJylcclxuXHJcbiAgICAvLyAvLyBQaG9uZSBtYXNraW5nXHJcbiAgICAvLyBjb25zdCBwaG9uZU1hc2tPcHRpb25zID0ge1xyXG4gICAgLy8gICAgIG1hc2s6ICcrezd9ICgwMDApIDAwMC0wMC0wMCcsXHJcbiAgICAvLyAgICAgbGF6eTogdHJ1ZSxcclxuICAgIC8vICAgICBwbGFjZWhvbGRlckNoYXI6ICcjJ1xyXG4gICAgLy8gfVxyXG4gICAgLy8gY29uc3QgcGhvbmVNYXNrID0gSU1hc2soXHJcbiAgICAvLyAgICAgcGhvbmVOdW1iZXIsXHJcbiAgICAvLyAgICAgcGhvbmVNYXNrT3B0aW9uc1xyXG4gICAgLy8gKVxyXG5cclxuICAgIC8vIHBob25lTnVtYmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4gcGhvbmVNYXNrLnVwZGF0ZU9wdGlvbnMoe2xhenk6IGZhbHNlfSkpXHJcbiAgICAvLyBwaG9uZU51bWJlci5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4gcGhvbmVNYXNrLnVwZGF0ZU9wdGlvbnMoe2xhenk6IHRydWV9KSlcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZSAgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwibmFtZVwiXScpXHJcbiAgICAgICAgY29uc3QgcGhvbmUgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGhvbmVcIl0nKVxyXG4gICAgICAgIGNvbnN0IGVtYWlsID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImVtYWlsXCJdJylcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgbmFtZVxyXG4gICAgICAgIGlmIChuYW1lLnZhbHVlID09PSAnJykge1xyXG4gICAgICAgICAgICBzZXRFcnJvck9uVXNlckRhdGFDb250cm9sbGVyKG5hbWUsICfQl9Cw0L/QvtC70L3QuNGC0LUg0L/QvtC70LUg0KTQmNCeJylcclxuICAgICAgICAgICAgZm9ybVZhbGlkLm5hbWUgPSBmYWxzZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc2V0RXJyb3JPblVzZXJEYXRhQ29udHJvbGxlcihuYW1lKVxyXG4gICAgICAgICAgICBmb3JtVmFsaWQubmFtZSA9IHRydWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIHBob25lXHJcbiAgICAgICAgaWYgKHBob25lLnZhbHVlID09PSAnJykge1xyXG4gICAgICAgICAgICBzZXRFcnJvck9uVXNlckRhdGFDb250cm9sbGVyKHBob25lLCAn0JfQsNC/0L7Qu9C90LjRgtC1INC/0L7Qu9C1INCi0LXQu9C10YTQvtC9JylcclxuICAgICAgICAgICAgZm9ybVZhbGlkLnBob25lID0gZmFsc2VcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAod2luZG93LnZhbGlkYXRlUGhvbmUod2luZG93LmNsZWFyUGhvbmUocGhvbmUudmFsdWUpKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzZXRFcnJvck9uVXNlckRhdGFDb250cm9sbGVyKHBob25lKVxyXG4gICAgICAgICAgICAgICAgZm9ybVZhbGlkLnBob25lID0gdHJ1ZVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2V0RXJyb3JPblVzZXJEYXRhQ29udHJvbGxlcihwaG9uZSwgJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQvdC+0LzQtdGAINGC0LXQu9C10YTQvtC90LAnKVxyXG4gICAgICAgICAgICAgICAgZm9ybVZhbGlkLnBob25lID0gZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgZW1haWxcclxuICAgICAgICBpZiAoZW1haWwudmFsdWUgIT09ICcnKSB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cudmFsaWRhdGVFbWFpbChlbWFpbC52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc2V0RXJyb3JPblVzZXJEYXRhQ29udHJvbGxlcihlbWFpbClcclxuICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IHRydWVcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNldEVycm9yT25Vc2VyRGF0YUNvbnRyb2xsZXIoZW1haWwsICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YsnKVxyXG4gICAgICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc2V0RXJyb3JPblVzZXJEYXRhQ29udHJvbGxlcihlbWFpbClcclxuICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2VuZ2luZyBmb3JtIGRhdGFcclxuICAgICAgICBpZiAoZm9ybVZhbGlkLm5hbWUgJiYgZm9ybVZhbGlkLnBob25lICYmIGZvcm1WYWxpZC5lbWFpbCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XHJcblxyXG4gICAgICAgICAgICAvLyDQntCx0Y/Qt9Cw0YLQtdC70YzQvdC+INGD0LTQsNC70LjRgtGMINC/0L7RgdC70LUg0LLQvdC10LTRgNC10L3QuNGPXHJcbiAgICAgICAgICAgIGZvciAobGV0IFtuYW1lLCB2YWx1ZV0gb2YgZm9ybURhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke25hbWV9OiAke3ZhbHVlfWApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmV0Y2hpbmcgcmVxdWVzdCBmb3IgdXBkYXRpbmcgdXNlciBkYXRhJyk7XHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuc2hvd01vZGFsTXNnKCfQm9C40YfQvdGL0LUg0LTQsNC90L3Ri9C1JywgJ9Cb0LjRh9C90YvQtSDQtNCw0L3QvdGL0LUg0LjQt9C80LXQvdC10L3RiycpXHJcbiAgICAgICAgICAgIGJsb2NrVXNlckRhdGFGb3JtKClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcbi8vIFVwZGF0ZSB1c2VyIGRhdGEgLS0tIEZJTklTSFxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAvLyBDaGFuZ2UgdXNlciBwYXNzd29yZFxyXG4gICAgaW5pdENoYW5nZVBhc3NGb3JtVG9nZ2xlcygpXHJcbiAgICBpbml0Q2hhbmdlUGFzc3dvcmRGb3JtKClcclxuXHJcbiAgICAvLyBVcGRhdGUgdXNlciBkYXRhXHJcbiAgICBpbml0Q2hhbmdlVXNlckRhdGFGb3JtKClcclxufSkiXSwiZmlsZSI6ImFjY291bnQuanMifQ==
