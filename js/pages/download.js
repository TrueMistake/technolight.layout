// Tabs
const resetAllDownTabs = () => {
    const downTabs = Array.from(document.querySelectorAll('.download__tabs-item'))
    downTabs.forEach(tab => tab.classList.remove('active'))
}

const resetAllDownContentExcludingTarget = (target) => {
    const downContents = Array.from(document.querySelectorAll('.download__tabs-content'))
    downContents.forEach(el => {
        if (el !== target) {
            el.classList.add('hidden') // during of animation is 100ms
            setTimeout(() => el.classList.add('hide'), 100)
        } else {
            setTimeout(() => target.classList.remove('hide'), 100)
        }
    })
}

const initDownTabsHandlers = () => {
    const downTabs = Array.from(document.querySelectorAll('.download__tabs-item'))
    downTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            if (this.classList.contains('active')) return

            const targetName = this.dataset.target
            const target = document.querySelector(`[data-tab-target="${targetName}"]`)

            resetAllDownTabs()
            resetAllDownContentExcludingTarget(target)
            this.classList.add('active')

            setTimeout(() => {target.classList.remove('hidden')}, 150)
        })
    })
}

// Getting and setting data
const initDownData = async () => {

    if (!window.DownloadFilesDataLink) {
        console.warn('Не указана API URL файлы для скачивания window.DownloadFilesDataLink')
        return
    }

    (async () => {
        window.spinner.show()

        try {
            const res = await fetch(window.DownloadFilesDataLink)
            if (!res.ok) {
                throw new Error('Сетевая ошибка при запросе даннах файлов для скачивания!')
            }
            const data = await res.json()
            setDownData(data)
        } catch (error) {
            console.error(error)
        }
    })()

    const setDownData = (data) => {
        const normalizedData = {}

        data.forEach(el => {
            const category = el.category

            if (!normalizedData[category]) normalizedData[category] = []

            normalizedData[category].push(el)
        })

        setTimeout(() => {
            window.spinner.hide()
            setDownCaption()
            setDownTabs(normalizedData)
            setDownFiles(normalizedData)
            showAnimElements()
            initDownTabsHandlers()
        }, 100)
    }
}

const setDownCaption = () => {
    const target = document.getElementById('DownloadCaption')

    const insertHtml = `
        <div class="container container_caption animation-element">
            <div class="row">
                <div class="col col-xl-8">
                    <h2 class="container_caption-text">Скачать</h2>
                </div>
            </div>
        </div>
    `

    if (target) target.innerHTML = insertHtml
}

const setDownTabs = (data) => {
    const categories = Object.keys(data)
    const target = document.getElementById('DownloadTabsList')

    let insertHtml = `
        <div class="container">
            <div class="download__tabs animation-element">
                <ul class="download__tabs-list">
    `

    insertHtml += `
                    <li class="download__tabs-item active" data-target="${data['Каталоги'][0].category_id}">
                        <button type="button"><span>Каталоги</span></button>
                    </li>
    `

    categories.forEach((category) => {
        if (category === 'Каталоги') return

        insertHtml += `
                    <li class="download__tabs-item" data-target="${data[category][0].category_id}">
                        <button type="button"><span>${category}</span></button>
                    </li>
        `
    })

    insertHtml += `
                </ul>
            </div>
        </div>
    `

    if (target) target.innerHTML = insertHtml
}

const setDownFiles = (data) => {
    const categories = Object.keys(data)
    const target = document.getElementById('DownloadFilesList')

    let insertHtml = ''

    // Первым рендерим Каталоги
    const catalogs = data['Каталоги']

    if (catalogs && catalogs.length > 0) {
        insertHtml += `
            <div class="download__tabs-content animation-element" data-tab-target="${data['Каталоги'][0].category_id}">
                <div class="container container_caption">
                    <div class="row">
                        <div class="col col-xl-8">
                            <h2 class="container_caption-text">Каталоги</h2>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="row">
        `

        catalogs.forEach(catalog => {
            insertHtml += `
                        <div class="col-12 col-md-6 col-xl-4">
                            <div class="download__content">
                                <div class="download__card">
                                    <div class="download__poster">
                                        <img src="${catalog.preview}" alt="" />
                                    </div>
                                    <div class="download_description">
                                        <h4 class="download__name">${catalog.name}</h4>
                                        <span class="download__text">Каталог</span>
                                        <span class="download__text uppercase">${catalog.extension} - ${catalog.size_human}</span>
                                    </div>
                                </div>
                                <div class="download__button">
                                    <a class="btn btn_block btn_dark btn_download" href="${catalog.download}" download="download">
                                        <i></i>
                                        <span>Скачать каталог</span>
                                    </a>
                                </div>
                            </div>
                        </div>
            `
        })

        insertHtml += `
                    </div>
                </div>
            </div>
        `
    }

    // Остальные файлы для скачивания
    categories.forEach((category) => {
        if (category === 'Каталоги') return

        insertHtml += `<div class="download__tabs-content hide hidden" data-tab-target="${data[category][0].category_id}">`

        if (data[category].length > 0) {
            const sections = getDataFilesSections(data[category])

            for (const fileSection in sections) {
                insertHtml += `
                    <div class="container container_caption">
                        <div class="row">
                            <div class="col col-xl-8">
                                <h2 class="container_caption-text">${fileSection}</h2>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <div class="download__wrap">
                                    <table class="download__table">
                `

                sections[fileSection].forEach(el => {
                    insertHtml += `
                                        <tr>
                                            <td><a href="${el.download}" download>${el.name}</a></td>
                                            <td>${el.extension} - ${el.size_human}</td> <!-- ${category} -->
                                            <td><a class="btn btn_dark btn_download" href="${el.download}" download><i></i></a></td>
                                        </tr>
                    `
                })

                insertHtml += `
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }
        }

        insertHtml += '</div>'
    })

    if (target) target.innerHTML = insertHtml
}

const getDataFilesSections = (data) => {
    const normalizedData = {}

    data.forEach(el => {
        const tag = el.tags.length > 0 ? el.tags[0] : ''

        if (!normalizedData[tag]) normalizedData[tag] = []

        normalizedData[tag].push(el)
    })

    return normalizedData
}

window.addEventListener('load', initDownData)
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkb3dubG9hZC9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGFic1xyXG5jb25zdCByZXNldEFsbERvd25UYWJzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZG93blRhYnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kb3dubG9hZF9fdGFicy1pdGVtJykpXHJcbiAgICBkb3duVGFicy5mb3JFYWNoKHRhYiA9PiB0YWIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpXHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0QWxsRG93bkNvbnRlbnRFeGNsdWRpbmdUYXJnZXQgPSAodGFyZ2V0KSA9PiB7XHJcbiAgICBjb25zdCBkb3duQ29udGVudHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kb3dubG9hZF9fdGFicy1jb250ZW50JykpXHJcbiAgICBkb3duQ29udGVudHMuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgaWYgKGVsICE9PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJykgLy8gZHVyaW5nIG9mIGFuaW1hdGlvbiBpcyAxMDBtc1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGVsLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKSwgMTAwKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSwgMTAwKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGluaXREb3duVGFic0hhbmRsZXJzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZG93blRhYnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kb3dubG9hZF9fdGFicy1pdGVtJykpXHJcbiAgICBkb3duVGFicy5mb3JFYWNoKHRhYiA9PiB7XHJcbiAgICAgICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHJldHVyblxyXG5cclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0TmFtZSA9IHRoaXMuZGF0YXNldC50YXJnZXRcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtdGFiLXRhcmdldD1cIiR7dGFyZ2V0TmFtZX1cIl1gKVxyXG5cclxuICAgICAgICAgICAgcmVzZXRBbGxEb3duVGFicygpXHJcbiAgICAgICAgICAgIHJlc2V0QWxsRG93bkNvbnRlbnRFeGNsdWRpbmdUYXJnZXQodGFyZ2V0KVxyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHt0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyl9LCAxNTApXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbi8vIEdldHRpbmcgYW5kIHNldHRpbmcgZGF0YVxyXG5jb25zdCBpbml0RG93bkRhdGEgPSBhc3luYyAoKSA9PiB7XHJcblxyXG4gICAgaWYgKCF3aW5kb3cuRG93bmxvYWRGaWxlc0RhdGFMaW5rKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCfQndC1INGD0LrQsNC30LDQvdCwIEFQSSBVUkwg0YTQsNC50LvRiyDQtNC70Y8g0YHQutCw0YfQuNCy0LDQvdC40Y8gd2luZG93LkRvd25sb2FkRmlsZXNEYXRhTGluaycpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgICB3aW5kb3cuc3Bpbm5lci5zaG93KClcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2god2luZG93LkRvd25sb2FkRmlsZXNEYXRhTGluaylcclxuICAgICAgICAgICAgaWYgKCFyZXMub2spIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcign0KHQtdGC0LXQstCw0Y8g0L7RiNC40LHQutCwINC/0YDQuCDQt9Cw0L/RgNC+0YHQtSDQtNCw0L3QvdCw0YUg0YTQsNC50LvQvtCyINC00LvRjyDRgdC60LDRh9C40LLQsNC90LjRjyEnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgICAgIHNldERvd25EYXRhKGRhdGEpXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICAgICAgICB9XHJcbiAgICB9KSgpXHJcblxyXG4gICAgY29uc3Qgc2V0RG93bkRhdGEgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWREYXRhID0ge31cclxuXHJcbiAgICAgICAgZGF0YS5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSBlbC5jYXRlZ29yeVxyXG5cclxuICAgICAgICAgICAgaWYgKCFub3JtYWxpemVkRGF0YVtjYXRlZ29yeV0pIG5vcm1hbGl6ZWREYXRhW2NhdGVnb3J5XSA9IFtdXHJcblxyXG4gICAgICAgICAgICBub3JtYWxpemVkRGF0YVtjYXRlZ29yeV0ucHVzaChlbClcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgd2luZG93LnNwaW5uZXIuaGlkZSgpXHJcbiAgICAgICAgICAgIHNldERvd25DYXB0aW9uKClcclxuICAgICAgICAgICAgc2V0RG93blRhYnMobm9ybWFsaXplZERhdGEpXHJcbiAgICAgICAgICAgIHNldERvd25GaWxlcyhub3JtYWxpemVkRGF0YSlcclxuICAgICAgICAgICAgc2hvd0FuaW1FbGVtZW50cygpXHJcbiAgICAgICAgICAgIGluaXREb3duVGFic0hhbmRsZXJzKClcclxuICAgICAgICB9LCAxMDApXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHNldERvd25DYXB0aW9uID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0Rvd25sb2FkQ2FwdGlvbicpXHJcblxyXG4gICAgY29uc3QgaW5zZXJ0SHRtbCA9IGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGNvbnRhaW5lcl9jYXB0aW9uIGFuaW1hdGlvbi1lbGVtZW50XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wgY29sLXhsLThcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJjb250YWluZXJfY2FwdGlvbi10ZXh0XCI+0KHQutCw0YfQsNGC0Yw8L2gyPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgYFxyXG5cclxuICAgIGlmICh0YXJnZXQpIHRhcmdldC5pbm5lckhUTUwgPSBpbnNlcnRIdG1sXHJcbn1cclxuXHJcbmNvbnN0IHNldERvd25UYWJzID0gKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBPYmplY3Qua2V5cyhkYXRhKVxyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0Rvd25sb2FkVGFic0xpc3QnKVxyXG5cclxuICAgIGxldCBpbnNlcnRIdG1sID0gYFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRvd25sb2FkX190YWJzIGFuaW1hdGlvbi1lbGVtZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkb3dubG9hZF9fdGFicy1saXN0XCI+XHJcbiAgICBgXHJcblxyXG4gICAgaW5zZXJ0SHRtbCArPSBgXHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZG93bmxvYWRfX3RhYnMtaXRlbSBhY3RpdmVcIiBkYXRhLXRhcmdldD1cIiR7ZGF0YVsn0JrQsNGC0LDQu9C+0LPQuCddWzBdLmNhdGVnb3J5X2lkfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIj48c3Bhbj7QmtCw0YLQsNC70L7Qs9C4PC9zcGFuPjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICBgXHJcblxyXG4gICAgY2F0ZWdvcmllcy5mb3JFYWNoKChjYXRlZ29yeSkgPT4ge1xyXG4gICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ9Ca0LDRgtCw0LvQvtCz0LgnKSByZXR1cm5cclxuXHJcbiAgICAgICAgaW5zZXJ0SHRtbCArPSBgXHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZG93bmxvYWRfX3RhYnMtaXRlbVwiIGRhdGEtdGFyZ2V0PVwiJHtkYXRhW2NhdGVnb3J5XVswXS5jYXRlZ29yeV9pZH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCI+PHNwYW4+JHtjYXRlZ29yeX08L3NwYW4+PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICBgXHJcbiAgICB9KVxyXG5cclxuICAgIGluc2VydEh0bWwgKz0gYFxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICBgXHJcblxyXG4gICAgaWYgKHRhcmdldCkgdGFyZ2V0LmlubmVySFRNTCA9IGluc2VydEh0bWxcclxufVxyXG5cclxuY29uc3Qgc2V0RG93bkZpbGVzID0gKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBPYmplY3Qua2V5cyhkYXRhKVxyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0Rvd25sb2FkRmlsZXNMaXN0JylcclxuXHJcbiAgICBsZXQgaW5zZXJ0SHRtbCA9ICcnXHJcblxyXG4gICAgLy8g0J/QtdGA0LLRi9C8INGA0LXQvdC00LXRgNC40Lwg0JrQsNGC0LDQu9C+0LPQuFxyXG4gICAgY29uc3QgY2F0YWxvZ3MgPSBkYXRhWyfQmtCw0YLQsNC70L7Qs9C4J11cclxuXHJcbiAgICBpZiAoY2F0YWxvZ3MgJiYgY2F0YWxvZ3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGluc2VydEh0bWwgKz0gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG93bmxvYWRfX3RhYnMtY29udGVudCBhbmltYXRpb24tZWxlbWVudFwiIGRhdGEtdGFiLXRhcmdldD1cIiR7ZGF0YVsn0JrQsNGC0LDQu9C+0LPQuCddWzBdLmNhdGVnb3J5X2lkfVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBjb250YWluZXJfY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbCBjb2wteGwtOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzPVwiY29udGFpbmVyX2NhcHRpb24tdGV4dFwiPtCa0LDRgtCw0LvQvtCz0Lg8L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICBgXHJcblxyXG4gICAgICAgIGNhdGFsb2dzLmZvckVhY2goY2F0YWxvZyA9PiB7XHJcbiAgICAgICAgICAgIGluc2VydEh0bWwgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1tZC02IGNvbC14bC00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG93bmxvYWRfX2NvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG93bmxvYWRfX2NhcmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRvd25sb2FkX19wb3N0ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtjYXRhbG9nLnByZXZpZXd9XCIgYWx0PVwiXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3dubG9hZF9kZXNjcmlwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwiZG93bmxvYWRfX25hbWVcIj4ke2NhdGFsb2cubmFtZX08L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkb3dubG9hZF9fdGV4dFwiPtCa0LDRgtCw0LvQvtCzPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkb3dubG9hZF9fdGV4dCB1cHBlcmNhc2VcIj4ke2NhdGFsb2cuZXh0ZW5zaW9ufSAtICR7Y2F0YWxvZy5zaXplX2h1bWFufTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRvd25sb2FkX19idXR0b25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuX2Jsb2NrIGJ0bl9kYXJrIGJ0bl9kb3dubG9hZFwiIGhyZWY9XCIke2NhdGFsb2cuZG93bmxvYWR9XCIgZG93bmxvYWQ9XCJkb3dubG9hZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGk+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+0KHQutCw0YfQsNGC0Ywg0LrQsNGC0LDQu9C+0LM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgYFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGluc2VydEh0bWwgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGBcclxuICAgIH1cclxuXHJcbiAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YTQsNC50LvRiyDQtNC70Y8g0YHQutCw0YfQuNCy0LDQvdC40Y9cclxuICAgIGNhdGVnb3JpZXMuZm9yRWFjaCgoY2F0ZWdvcnkpID0+IHtcclxuICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICfQmtCw0YLQsNC70L7Qs9C4JykgcmV0dXJuXHJcblxyXG4gICAgICAgIGluc2VydEh0bWwgKz0gYDxkaXYgY2xhc3M9XCJkb3dubG9hZF9fdGFicy1jb250ZW50IGhpZGUgaGlkZGVuXCIgZGF0YS10YWItdGFyZ2V0PVwiJHtkYXRhW2NhdGVnb3J5XVswXS5jYXRlZ29yeV9pZH1cIj5gXHJcblxyXG4gICAgICAgIGlmIChkYXRhW2NhdGVnb3J5XS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb25zID0gZ2V0RGF0YUZpbGVzU2VjdGlvbnMoZGF0YVtjYXRlZ29yeV0pXHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZpbGVTZWN0aW9uIGluIHNlY3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBpbnNlcnRIdG1sICs9IGBcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGNvbnRhaW5lcl9jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wgY29sLXhsLThcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJjb250YWluZXJfY2FwdGlvbi10ZXh0XCI+JHtmaWxlU2VjdGlvbn08L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3dubG9hZF9fd3JhcFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJkb3dubG9hZF9fdGFibGVcIj5cclxuICAgICAgICAgICAgICAgIGBcclxuXHJcbiAgICAgICAgICAgICAgICBzZWN0aW9uc1tmaWxlU2VjdGlvbl0uZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0SHRtbCArPSBgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxhIGhyZWY9XCIke2VsLmRvd25sb2FkfVwiIGRvd25sb2FkPiR7ZWwubmFtZX08L2E+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+JHtlbC5leHRlbnNpb259IC0gJHtlbC5zaXplX2h1bWFufTwvdGQ+IDwhLS0gJHtjYXRlZ29yeX0gLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxhIGNsYXNzPVwiYnRuIGJ0bl9kYXJrIGJ0bl9kb3dubG9hZFwiIGhyZWY9XCIke2VsLmRvd25sb2FkfVwiIGRvd25sb2FkPjxpPjwvaT48L2E+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBpbnNlcnRIdG1sICs9IGBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5zZXJ0SHRtbCArPSAnPC9kaXY+J1xyXG4gICAgfSlcclxuXHJcbiAgICBpZiAodGFyZ2V0KSB0YXJnZXQuaW5uZXJIVE1MID0gaW5zZXJ0SHRtbFxyXG59XHJcblxyXG5jb25zdCBnZXREYXRhRmlsZXNTZWN0aW9ucyA9IChkYXRhKSA9PiB7XHJcbiAgICBjb25zdCBub3JtYWxpemVkRGF0YSA9IHt9XHJcblxyXG4gICAgZGF0YS5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICBjb25zdCB0YWcgPSBlbC50YWdzLmxlbmd0aCA+IDAgPyBlbC50YWdzWzBdIDogJydcclxuXHJcbiAgICAgICAgaWYgKCFub3JtYWxpemVkRGF0YVt0YWddKSBub3JtYWxpemVkRGF0YVt0YWddID0gW11cclxuXHJcbiAgICAgICAgbm9ybWFsaXplZERhdGFbdGFnXS5wdXNoKGVsKVxyXG4gICAgfSlcclxuXHJcbiAgICByZXR1cm4gbm9ybWFsaXplZERhdGFcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBpbml0RG93bkRhdGEpIl0sImZpbGUiOiJkb3dubG9hZC5qcyJ9
