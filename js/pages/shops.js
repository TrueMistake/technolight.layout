const initShopsVideo = () => {
    const btns = Array.from(document.querySelectorAll('.shops__video'))

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

const initShopsMap = () => {
    const container = document.getElementById('mapWrapper')

    if (!container) return

    const map = container.querySelector('#map')
    const title = document.createElement('div')

    title.className = 'title'
    title.textContent = 'Для активации карты кликните по ней'
    container.appendChild(title)

    container.addEventListener('click', () => {
        map.removeAttribute('style')
        title.parentElement.removeChild(title)
    })

    container.addEventListener('mousemove', (e) => {
        title.style.display = 'block'
        if(e.offsetY > 10) title.style.top = e.offsetY + 20 + 'px'
        if(e.offsetX > 10) title.style.left = e.offsetX + 20 + 'px'
    })

    container.addEventListener('mouseleave', (e) => {
        title.style.display = 'none'
    })
}

window.addEventListener('load', () => {
    initShopsVideo()
    initShopsMap()
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzaG9wcy9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaW5pdFNob3BzVmlkZW8gPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2hvcHNfX3ZpZGVvJykpXHJcblxyXG4gICAgaWYgKGJ0bnMubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBidG5zLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlmcmFtZSA9IHRoaXMucXVlcnlTZWxlY3RvcignaWZyYW1lJylcclxuICAgICAgICAgICAgY29uc3QgcG9zdGVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcucG9zdGVyJylcclxuICAgICAgICAgICAgY29uc3QgcGxheSA9IHRoaXMucXVlcnlTZWxlY3RvcignLmJ1dHRvbi1wbGF5JylcclxuXHJcbiAgICAgICAgICAgIGlmICghaWZyYW1lKSByZXR1cm5cclxuXHJcbiAgICAgICAgICAgIHBvc3Rlci5jbGFzc0xpc3QuYWRkKCd1bnNob3dpbmcnKVxyXG4gICAgICAgICAgICBpZnJhbWUuc3JjID0gaWZyYW1lLmRhdGFzZXQuc3JjICsgXCImYXV0b3BsYXk9dHJ1ZVwiXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHBvc3Rlci5jbGFzc0xpc3QuYWRkKCdoaWRlJylcclxuICAgICAgICAgICAgICAgIHBsYXkuY2xhc3NMaXN0LmFkZCgnaGlkZScpXHJcbiAgICAgICAgICAgIH0sIDExMDApXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGluaXRTaG9wc01hcCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXBXcmFwcGVyJylcclxuXHJcbiAgICBpZiAoIWNvbnRhaW5lcikgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgbWFwID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNtYXAnKVxyXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG5cclxuICAgIHRpdGxlLmNsYXNzTmFtZSA9ICd0aXRsZSdcclxuICAgIHRpdGxlLnRleHRDb250ZW50ID0gJ9CU0LvRjyDQsNC60YLQuNCy0LDRhtC40Lgg0LrQsNGA0YLRiyDQutC70LjQutC90LjRgtC1INC/0L4g0L3QtdC5J1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKVxyXG5cclxuICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBtYXAucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpXHJcbiAgICAgICAgdGl0bGUucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aXRsZSlcclxuICAgIH0pXHJcblxyXG4gICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB7XHJcbiAgICAgICAgdGl0bGUuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICBpZihlLm9mZnNldFkgPiAxMCkgdGl0bGUuc3R5bGUudG9wID0gZS5vZmZzZXRZICsgMjAgKyAncHgnXHJcbiAgICAgICAgaWYoZS5vZmZzZXRYID4gMTApIHRpdGxlLnN0eWxlLmxlZnQgPSBlLm9mZnNldFggKyAyMCArICdweCdcclxuICAgIH0pXHJcblxyXG4gICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoZSkgPT4ge1xyXG4gICAgICAgIHRpdGxlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaW5pdFNob3BzVmlkZW8oKVxyXG4gICAgaW5pdFNob3BzTWFwKClcclxufSkiXSwiZmlsZSI6InNob3BzLmpzIn0=
