const initVIVideo = () => {
    const btns = Array.from(document.querySelectorAll('.video-instructions__video'))

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

window.addEventListener('load', () => {
    initVIVideo()
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ2aWRlby1pbnN0cnVjdGlvbnMvc2NyaXB0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGluaXRWSVZpZGVvID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnZpZGVvLWluc3RydWN0aW9uc19fdmlkZW8nKSlcclxuXHJcbiAgICBpZiAoYnRucy5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY29uc3QgaWZyYW1lID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdpZnJhbWUnKVxyXG4gICAgICAgICAgICBjb25zdCBwb3N0ZXIgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5wb3N0ZXInKVxyXG4gICAgICAgICAgICBjb25zdCBwbGF5ID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcuYnV0dG9uLXBsYXknKVxyXG5cclxuICAgICAgICAgICAgaWYgKCFpZnJhbWUpIHJldHVyblxyXG5cclxuICAgICAgICAgICAgcG9zdGVyLmNsYXNzTGlzdC5hZGQoJ3Vuc2hvd2luZycpXHJcbiAgICAgICAgICAgIGlmcmFtZS5zcmMgPSBpZnJhbWUuZGF0YXNldC5zcmMgKyBcIiZhdXRvcGxheT10cnVlXCJcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcG9zdGVyLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxyXG4gICAgICAgICAgICAgICAgcGxheS5jbGFzc0xpc3QuYWRkKCdoaWRlJylcclxuICAgICAgICAgICAgfSwgMTEwMClcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0VklWaWRlbygpXHJcbn0pIl0sImZpbGUiOiJ2aWRlby1pbnN0cnVjdGlvbnMuanMifQ==
