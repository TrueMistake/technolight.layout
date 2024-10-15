const initContactsVideo = () => {
    const btn = document.querySelector('.contacts__card_video .contacts__poster')
    const iframe = document.querySelector('.contacts__card_video iframe')

    if (!iframe) return

    btn.addEventListener('click', () => {
        btn.classList.add('unshowing')
        iframe.src = iframe.dataset.src + "&autoplay=true"

        setTimeout(() => btn.classList.add('hide'), 1100)
    })
}

const initContactsMap = () => {
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
    initContactsVideo()
    initContactsMap()
})

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250YWN0cy9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaW5pdENvbnRhY3RzVmlkZW8gPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFjdHNfX2NhcmRfdmlkZW8gLmNvbnRhY3RzX19wb3N0ZXInKVxyXG4gICAgY29uc3QgaWZyYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhY3RzX19jYXJkX3ZpZGVvIGlmcmFtZScpXHJcblxyXG4gICAgaWYgKCFpZnJhbWUpIHJldHVyblxyXG5cclxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBidG4uY2xhc3NMaXN0LmFkZCgndW5zaG93aW5nJylcclxuICAgICAgICBpZnJhbWUuc3JjID0gaWZyYW1lLmRhdGFzZXQuc3JjICsgXCImYXV0b3BsYXk9dHJ1ZVwiXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gYnRuLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKSwgMTEwMClcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGluaXRDb250YWN0c01hcCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXBXcmFwcGVyJylcclxuXHJcbiAgICBpZiAoIWNvbnRhaW5lcikgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgbWFwID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNtYXAnKVxyXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG5cclxuICAgIHRpdGxlLmNsYXNzTmFtZSA9ICd0aXRsZSdcclxuICAgIHRpdGxlLnRleHRDb250ZW50ID0gJ9CU0LvRjyDQsNC60YLQuNCy0LDRhtC40Lgg0LrQsNGA0YLRiyDQutC70LjQutC90LjRgtC1INC/0L4g0L3QtdC5J1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKVxyXG5cclxuICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBtYXAucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpXHJcbiAgICAgICAgdGl0bGUucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aXRsZSlcclxuICAgIH0pXHJcblxyXG4gICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB7XHJcbiAgICAgICAgdGl0bGUuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuICAgICAgICBpZihlLm9mZnNldFkgPiAxMCkgdGl0bGUuc3R5bGUudG9wID0gZS5vZmZzZXRZICsgMjAgKyAncHgnXHJcbiAgICAgICAgaWYoZS5vZmZzZXRYID4gMTApIHRpdGxlLnN0eWxlLmxlZnQgPSBlLm9mZnNldFggKyAyMCArICdweCdcclxuICAgIH0pXHJcblxyXG4gICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoZSkgPT4ge1xyXG4gICAgICAgIHRpdGxlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaW5pdENvbnRhY3RzVmlkZW8oKVxyXG4gICAgaW5pdENvbnRhY3RzTWFwKClcclxufSlcclxuIl0sImZpbGUiOiJjb250YWN0cy5qcyJ9
