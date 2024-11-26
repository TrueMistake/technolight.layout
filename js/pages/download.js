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
    const urls = [];

    if (!window.DownloadFilesDataLink) {
        console.warn('Не указана API URL файлы для скачивания window.DownloadFilesDataLink')
    } else {
        urls.push(window.DownloadFilesDataLink)
    }

    if (!window.DownloadVideosDataLink) {
        console.warn('Не указана API URL файлы для видео window.DownloadVideosDataLink')
    } else {
        urls.push(window.DownloadVideosDataLink)
    }

    if (urls.length === 0) {
        console.warn('Нет доступных API URL для загрузки');
        return;
    }

    const fetchData = async (url) => {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Network error while fetching data from ${url}`);
            }
            return await res.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    (async () => {
        window.spinner.show();

        const results = [];
        for (const url of urls) {
            try {
                const data = await fetchData(url);
                if (data) {
                    results.push(data);
                }

            } catch (error) {
                console.error(error);
            }
        }

        if (results.length > 0) {
            setDownData(results.flat());
        }

        window.spinner.hide();
    })();

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
    if (data['Каталоги']) {
        insertHtml += `
                    <li class="download__tabs-item active" data-target="${data['Каталоги'][0].category_id}">
                        <button type="button"><span>Каталоги</span></button>
                    </li>
    `}

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
                                <table class="download__table${category !== 'Видео' ? '' : ' download__video'}">
            `

                sections[fileSection].forEach(el => {
                    if (category !== 'Видео') {
                        insertHtml += `
                                    <tr>
                                        <td><a href="${el.download}" download>${el.name}</a></td>
                                        <td>${el.extension} - ${el.size_human}</td> <!-- ${category} -->
                                        <td><a class="btn btn_dark btn_download" href="${el.download}" download><i></i></a></td>
                                    </tr>
                `
                    } else {
                        insertHtml += `
                                    <tr>
                                        <td>${el.name}</td>
                                        <td>
                                            <div class="download__table-preview" 
                                            data-id="${el.id}"
                                            data-video="${el.link}" 
                                            data-modal 
                                            data-modal-target="#modalVideo" 
                                            data-modal-action="show">
                                                <img src="${el.preview}" alt="${el.name}" />
                                                <div class="play"></div>
                                            </div>
                                        </td>
                                    </tr>
                `
                    }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkb3dubG9hZC9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGFic1xyXG5jb25zdCByZXNldEFsbERvd25UYWJzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZG93blRhYnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kb3dubG9hZF9fdGFicy1pdGVtJykpXHJcbiAgICBkb3duVGFicy5mb3JFYWNoKHRhYiA9PiB0YWIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpXHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0QWxsRG93bkNvbnRlbnRFeGNsdWRpbmdUYXJnZXQgPSAodGFyZ2V0KSA9PiB7XHJcbiAgICBjb25zdCBkb3duQ29udGVudHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kb3dubG9hZF9fdGFicy1jb250ZW50JykpXHJcbiAgICBkb3duQ29udGVudHMuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgaWYgKGVsICE9PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJykgLy8gZHVyaW5nIG9mIGFuaW1hdGlvbiBpcyAxMDBtc1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGVsLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKSwgMTAwKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSwgMTAwKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGluaXREb3duVGFic0hhbmRsZXJzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZG93blRhYnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kb3dubG9hZF9fdGFicy1pdGVtJykpXHJcbiAgICBkb3duVGFicy5mb3JFYWNoKHRhYiA9PiB7XHJcbiAgICAgICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHJldHVyblxyXG5cclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0TmFtZSA9IHRoaXMuZGF0YXNldC50YXJnZXRcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtdGFiLXRhcmdldD1cIiR7dGFyZ2V0TmFtZX1cIl1gKVxyXG5cclxuICAgICAgICAgICAgcmVzZXRBbGxEb3duVGFicygpXHJcbiAgICAgICAgICAgIHJlc2V0QWxsRG93bkNvbnRlbnRFeGNsdWRpbmdUYXJnZXQodGFyZ2V0KVxyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHt0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyl9LCAxNTApXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbi8vIEdldHRpbmcgYW5kIHNldHRpbmcgZGF0YVxyXG5jb25zdCBpbml0RG93bkRhdGEgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCB1cmxzID0gW107XHJcblxyXG4gICAgaWYgKCF3aW5kb3cuRG93bmxvYWRGaWxlc0RhdGFMaW5rKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCfQndC1INGD0LrQsNC30LDQvdCwIEFQSSBVUkwg0YTQsNC50LvRiyDQtNC70Y8g0YHQutCw0YfQuNCy0LDQvdC40Y8gd2luZG93LkRvd25sb2FkRmlsZXNEYXRhTGluaycpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHVybHMucHVzaCh3aW5kb3cuRG93bmxvYWRGaWxlc0RhdGFMaW5rKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghd2luZG93LkRvd25sb2FkVmlkZW9zRGF0YUxpbmspIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ9Cd0LUg0YPQutCw0LfQsNC90LAgQVBJIFVSTCDRhNCw0LnQu9GLINC00LvRjyDQstC40LTQtdC+IHdpbmRvdy5Eb3dubG9hZFZpZGVvc0RhdGFMaW5rJylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdXJscy5wdXNoKHdpbmRvdy5Eb3dubG9hZFZpZGVvc0RhdGFMaW5rKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh1cmxzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGNvbnNvbGUud2Fybign0J3QtdGCINC00L7RgdGC0YPQv9C90YvRhSBBUEkgVVJMINC00LvRjyDQt9Cw0LPRgNGD0LfQutC4Jyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZldGNoRGF0YSA9IGFzeW5jICh1cmwpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG4gICAgICAgICAgICBpZiAoIXJlcy5vaykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBOZXR3b3JrIGVycm9yIHdoaWxlIGZldGNoaW5nIGRhdGEgZnJvbSAke3VybH1gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgcmVzLmpzb24oKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5zcGlubmVyLnNob3coKTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3QgdXJsIG9mIHVybHMpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBmZXRjaERhdGEodXJsKTtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVzdWx0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHNldERvd25EYXRhKHJlc3VsdHMuZmxhdCgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdpbmRvdy5zcGlubmVyLmhpZGUoKTtcclxuICAgIH0pKCk7XHJcblxyXG4gICAgY29uc3Qgc2V0RG93bkRhdGEgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWREYXRhID0ge31cclxuXHJcbiAgICAgICAgZGF0YS5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSBlbC5jYXRlZ29yeVxyXG5cclxuICAgICAgICAgICAgaWYgKCFub3JtYWxpemVkRGF0YVtjYXRlZ29yeV0pIG5vcm1hbGl6ZWREYXRhW2NhdGVnb3J5XSA9IFtdXHJcblxyXG4gICAgICAgICAgICBub3JtYWxpemVkRGF0YVtjYXRlZ29yeV0ucHVzaChlbClcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgd2luZG93LnNwaW5uZXIuaGlkZSgpXHJcbiAgICAgICAgICAgIHNldERvd25DYXB0aW9uKClcclxuICAgICAgICAgICAgc2V0RG93blRhYnMobm9ybWFsaXplZERhdGEpXHJcbiAgICAgICAgICAgIHNldERvd25GaWxlcyhub3JtYWxpemVkRGF0YSlcclxuICAgICAgICAgICAgc2hvd0FuaW1FbGVtZW50cygpXHJcbiAgICAgICAgICAgIGluaXREb3duVGFic0hhbmRsZXJzKClcclxuICAgICAgICB9LCAxMDApXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHNldERvd25DYXB0aW9uID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0Rvd25sb2FkQ2FwdGlvbicpXHJcblxyXG4gICAgY29uc3QgaW5zZXJ0SHRtbCA9IGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGNvbnRhaW5lcl9jYXB0aW9uIGFuaW1hdGlvbi1lbGVtZW50XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wgY29sLXhsLThcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJjb250YWluZXJfY2FwdGlvbi10ZXh0XCI+0KHQutCw0YfQsNGC0Yw8L2gyPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgYFxyXG5cclxuICAgIGlmICh0YXJnZXQpIHRhcmdldC5pbm5lckhUTUwgPSBpbnNlcnRIdG1sXHJcbn1cclxuXHJcbmNvbnN0IHNldERvd25UYWJzID0gKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBPYmplY3Qua2V5cyhkYXRhKVxyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0Rvd25sb2FkVGFic0xpc3QnKVxyXG5cclxuICAgIGxldCBpbnNlcnRIdG1sID0gYFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRvd25sb2FkX190YWJzIGFuaW1hdGlvbi1lbGVtZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkb3dubG9hZF9fdGFicy1saXN0XCI+XHJcbiAgICBgXHJcbiAgICBpZiAoZGF0YVsn0JrQsNGC0LDQu9C+0LPQuCddKSB7XHJcbiAgICAgICAgaW5zZXJ0SHRtbCArPSBgXHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZG93bmxvYWRfX3RhYnMtaXRlbSBhY3RpdmVcIiBkYXRhLXRhcmdldD1cIiR7ZGF0YVsn0JrQsNGC0LDQu9C+0LPQuCddWzBdLmNhdGVnb3J5X2lkfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIj48c3Bhbj7QmtCw0YLQsNC70L7Qs9C4PC9zcGFuPjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICBgfVxyXG5cclxuICAgIGNhdGVnb3JpZXMuZm9yRWFjaCgoY2F0ZWdvcnkpID0+IHtcclxuICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICfQmtCw0YLQsNC70L7Qs9C4JykgcmV0dXJuXHJcblxyXG4gICAgICAgIGluc2VydEh0bWwgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImRvd25sb2FkX190YWJzLWl0ZW1cIiBkYXRhLXRhcmdldD1cIiR7ZGF0YVtjYXRlZ29yeV1bMF0uY2F0ZWdvcnlfaWR9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiPjxzcGFuPiR7Y2F0ZWdvcnl9PC9zcGFuPjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgYFxyXG4gICAgfSlcclxuXHJcbiAgICBpbnNlcnRIdG1sICs9IGBcclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgYFxyXG5cclxuICAgIGlmICh0YXJnZXQpIHRhcmdldC5pbm5lckhUTUwgPSBpbnNlcnRIdG1sXHJcbn1cclxuXHJcbmNvbnN0IHNldERvd25GaWxlcyA9IChkYXRhKSA9PiB7XHJcbiAgICBjb25zdCBjYXRlZ29yaWVzID0gT2JqZWN0LmtleXMoZGF0YSlcclxuICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdEb3dubG9hZEZpbGVzTGlzdCcpXHJcblxyXG4gICAgbGV0IGluc2VydEh0bWwgPSAnJ1xyXG5cclxuICAgIC8vINCf0LXRgNCy0YvQvCDRgNC10L3QtNC10YDQuNC8INCa0LDRgtCw0LvQvtCz0LhcclxuICAgIGNvbnN0IGNhdGFsb2dzID0gZGF0YVsn0JrQsNGC0LDQu9C+0LPQuCddXHJcblxyXG4gICAgaWYgKGNhdGFsb2dzICYmIGNhdGFsb2dzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBpbnNlcnRIdG1sICs9IGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRvd25sb2FkX190YWJzLWNvbnRlbnQgYW5pbWF0aW9uLWVsZW1lbnRcIiBkYXRhLXRhYi10YXJnZXQ9XCIke2RhdGFbJ9Ca0LDRgtCw0LvQvtCz0LgnXVswXS5jYXRlZ29yeV9pZH1cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgY29udGFpbmVyX2NhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wgY29sLXhsLThcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cImNvbnRhaW5lcl9jYXB0aW9uLXRleHRcIj7QmtCw0YLQsNC70L7Qs9C4PC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgYFxyXG5cclxuICAgICAgICBjYXRhbG9ncy5mb3JFYWNoKGNhdGFsb2cgPT4ge1xyXG4gICAgICAgICAgICBpbnNlcnRIdG1sICs9IGBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbWQtNiBjb2wteGwtNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRvd25sb2FkX19jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRvd25sb2FkX19jYXJkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3dubG9hZF9fcG9zdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7Y2F0YWxvZy5wcmV2aWV3fVwiIGFsdD1cIlwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG93bmxvYWRfZGVzY3JpcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cImRvd25sb2FkX19uYW1lXCI+JHtjYXRhbG9nLm5hbWV9PC9oND5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZG93bmxvYWRfX3RleHRcIj7QmtCw0YLQsNC70L7Qszwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZG93bmxvYWRfX3RleHQgdXBwZXJjYXNlXCI+JHtjYXRhbG9nLmV4dGVuc2lvbn0gLSAke2NhdGFsb2cuc2l6ZV9odW1hbn08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3dubG9hZF9fYnV0dG9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bl9ibG9jayBidG5fZGFyayBidG5fZG93bmxvYWRcIiBocmVmPVwiJHtjYXRhbG9nLmRvd25sb2FkfVwiIGRvd25sb2FkPVwiZG93bmxvYWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPtCh0LrQsNGH0LDRgtGMINC60LDRgtCw0LvQvtCzPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIGBcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpbnNlcnRIdG1sICs9IGBcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgXHJcbiAgICB9XHJcblxyXG4gICAgLy8g0J7RgdGC0LDQu9GM0L3Ri9C1INGE0LDQudC70Ysg0LTQu9GPINGB0LrQsNGH0LjQstCw0L3QuNGPXHJcbiAgICBjYXRlZ29yaWVzLmZvckVhY2goKGNhdGVnb3J5KSA9PiB7XHJcbiAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAn0JrQsNGC0LDQu9C+0LPQuCcpIHJldHVyblxyXG5cclxuICAgICAgICBpbnNlcnRIdG1sICs9IGA8ZGl2IGNsYXNzPVwiZG93bmxvYWRfX3RhYnMtY29udGVudCBoaWRlIGhpZGRlblwiIGRhdGEtdGFiLXRhcmdldD1cIiR7ZGF0YVtjYXRlZ29yeV1bMF0uY2F0ZWdvcnlfaWR9XCI+YFxyXG5cclxuICAgICAgICBpZiAoZGF0YVtjYXRlZ29yeV0ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBzZWN0aW9ucyA9IGdldERhdGFGaWxlc1NlY3Rpb25zKGRhdGFbY2F0ZWdvcnldKVxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZpbGVTZWN0aW9uIGluIHNlY3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBpbnNlcnRIdG1sICs9IGBcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgY29udGFpbmVyX2NhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wgY29sLXhsLThcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cImNvbnRhaW5lcl9jYXB0aW9uLXRleHRcIj4ke2ZpbGVTZWN0aW9ufTwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG93bmxvYWRfX3dyYXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJkb3dubG9hZF9fdGFibGUke2NhdGVnb3J5ICE9PSAn0JLQuNC00LXQvicgPyAnJyA6ICcgZG93bmxvYWRfX3ZpZGVvJ31cIj5cclxuICAgICAgICAgICAgYFxyXG5cclxuICAgICAgICAgICAgICAgIHNlY3Rpb25zW2ZpbGVTZWN0aW9uXS5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2F0ZWdvcnkgIT09ICfQktC40LTQtdC+Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRIdG1sICs9IGBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxhIGhyZWY9XCIke2VsLmRvd25sb2FkfVwiIGRvd25sb2FkPiR7ZWwubmFtZX08L2E+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4ke2VsLmV4dGVuc2lvbn0gLSAke2VsLnNpemVfaHVtYW59PC90ZD4gPCEtLSAke2NhdGVnb3J5fSAtLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48YSBjbGFzcz1cImJ0biBidG5fZGFyayBidG5fZG93bmxvYWRcIiBocmVmPVwiJHtlbC5kb3dubG9hZH1cIiBkb3dubG9hZD48aT48L2k+PC9hPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICBgXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0SHRtbCArPSBgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4ke2VsLm5hbWV9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG93bmxvYWRfX3RhYmxlLXByZXZpZXdcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWlkPVwiJHtlbC5pZH1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtdmlkZW89XCIke2VsLmxpbmt9XCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1tb2RhbCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLW1vZGFsLXRhcmdldD1cIiNtb2RhbFZpZGVvXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1tb2RhbC1hY3Rpb249XCJzaG93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtlbC5wcmV2aWV3fVwiIGFsdD1cIiR7ZWwubmFtZX1cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGxheVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIGluc2VydEh0bWwgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnNlcnRIdG1sICs9ICc8L2Rpdj4nXHJcbiAgICB9KVxyXG5cclxuICAgIGlmICh0YXJnZXQpIHRhcmdldC5pbm5lckhUTUwgPSBpbnNlcnRIdG1sXHJcbn1cclxuXHJcbmNvbnN0IGdldERhdGFGaWxlc1NlY3Rpb25zID0gKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IG5vcm1hbGl6ZWREYXRhID0ge31cclxuXHJcbiAgICBkYXRhLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRhZyA9IGVsLnRhZ3MubGVuZ3RoID4gMCA/IGVsLnRhZ3NbMF0gOiAnJ1xyXG5cclxuICAgICAgICBpZiAoIW5vcm1hbGl6ZWREYXRhW3RhZ10pIG5vcm1hbGl6ZWREYXRhW3RhZ10gPSBbXVxyXG5cclxuICAgICAgICBub3JtYWxpemVkRGF0YVt0YWddLnB1c2goZWwpXHJcbiAgICB9KVxyXG5cclxuICAgIHJldHVybiBub3JtYWxpemVkRGF0YVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXREb3duRGF0YSkiXSwiZmlsZSI6ImRvd25sb2FkLmpzIn0=
