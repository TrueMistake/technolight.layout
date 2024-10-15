const initToggleSchemeImg = () => {
    const btns = Array.from(document.querySelectorAll('.products__toggle-scheme'))

    btns.forEach(el => el.addEventListener('click', e => {
        e.stopPropagation()
        e.preventDefault()

        const scheme = el.parentNode.querySelector('.products__scheme')

        el.classList.toggle('close')
        scheme.classList.toggle('visible')
    }))
}

window.addEventListener('load', initToggleSchemeImg)
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwcm9kdWN0cy9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaW5pdFRvZ2dsZVNjaGVtZUltZyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9kdWN0c19fdG9nZ2xlLXNjaGVtZScpKVxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICAgICAgY29uc3Qgc2NoZW1lID0gZWwucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCcucHJvZHVjdHNfX3NjaGVtZScpXHJcblxyXG4gICAgICAgIGVsLmNsYXNzTGlzdC50b2dnbGUoJ2Nsb3NlJylcclxuICAgICAgICBzY2hlbWUuY2xhc3NMaXN0LnRvZ2dsZSgndmlzaWJsZScpXHJcbiAgICB9KSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBpbml0VG9nZ2xlU2NoZW1lSW1nKSJdLCJmaWxlIjoicHJvZHVjdHMuanMifQ==
