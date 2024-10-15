// Dap is an abbreviation of the Delivery and payment
const dapTabs = Array.from(document.querySelectorAll('.dap__tabs-item'))
const dapContents = Array.from(document.querySelectorAll('.dap__tabs-content'))

const resetAllDapTabs = () => {
    dapTabs.forEach(tab => tab.classList.remove('dap__tabs-item_active'))
}

const resetAllDapContentExcludingTarget = (target) => {
    dapContents.forEach(el => {
        if (el !== target) {
            el.classList.add('hidden') // during of animation is 100ms
            setTimeout(() => el.classList.add('hide'), 100)
        } else {
            setTimeout(() => target.classList.remove('hide'), 100)
        }
    })
}

const initDapTabs = () => {
    dapTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            if (this.classList.contains('dap__tabs-item_active')) return

            const targetName = this.dataset.target
            const target = document.querySelector(`[data-tab-target="${targetName}"]`)

            resetAllDapTabs()
            resetAllDapContentExcludingTarget(target)
            this.classList.add('dap__tabs-item_active')

            setTimeout(() => {target.classList.remove('hidden')}, 150)
        })
    })
}

window.addEventListener('load', () => {
    initDapTabs()
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkZWxpdmVyeS1hbmQtcGF5bWVudC9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gRGFwIGlzIGFuIGFiYnJldmlhdGlvbiBvZiB0aGUgRGVsaXZlcnkgYW5kIHBheW1lbnRcclxuY29uc3QgZGFwVGFicyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRhcF9fdGFicy1pdGVtJykpXHJcbmNvbnN0IGRhcENvbnRlbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZGFwX190YWJzLWNvbnRlbnQnKSlcclxuXHJcbmNvbnN0IHJlc2V0QWxsRGFwVGFicyA9ICgpID0+IHtcclxuICAgIGRhcFRhYnMuZm9yRWFjaCh0YWIgPT4gdGFiLmNsYXNzTGlzdC5yZW1vdmUoJ2RhcF9fdGFicy1pdGVtX2FjdGl2ZScpKVxyXG59XHJcblxyXG5jb25zdCByZXNldEFsbERhcENvbnRlbnRFeGNsdWRpbmdUYXJnZXQgPSAodGFyZ2V0KSA9PiB7XHJcbiAgICBkYXBDb250ZW50cy5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICBpZiAoZWwgIT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKSAvLyBkdXJpbmcgb2YgYW5pbWF0aW9uIGlzIDEwMG1zXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZWwuY2xhc3NMaXN0LmFkZCgnaGlkZScpLCAxMDApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpLCAxMDApXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgaW5pdERhcFRhYnMgPSAoKSA9PiB7XHJcbiAgICBkYXBUYWJzLmZvckVhY2godGFiID0+IHtcclxuICAgICAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdkYXBfX3RhYnMtaXRlbV9hY3RpdmUnKSkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXROYW1lID0gdGhpcy5kYXRhc2V0LnRhcmdldFxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS10YWItdGFyZ2V0PVwiJHt0YXJnZXROYW1lfVwiXWApXHJcblxyXG4gICAgICAgICAgICByZXNldEFsbERhcFRhYnMoKVxyXG4gICAgICAgICAgICByZXNldEFsbERhcENvbnRlbnRFeGNsdWRpbmdUYXJnZXQodGFyZ2V0KVxyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2RhcF9fdGFicy1pdGVtX2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHt0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyl9LCAxNTApXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaW5pdERhcFRhYnMoKVxyXG59KSJdLCJmaWxlIjoiZGVsaXZlcnktYW5kLXBheW1lbnQuanMifQ==
