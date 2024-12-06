const transliterate = (text) => {
    const map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z',
        'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
        'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z',
        'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R',
        'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
        'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    };

    return text.split('').map(char => map[char] || char).join('').replace(/\s+/g, '');
}

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

const openTabByHash = () => {
    const hash = window.location.hash.substring(1); // Убираем символ #
    if (!hash) return;

    const targetTab = document.querySelector(`.download__tabs-item[data-target="${hash}"]`);
    const targetContent = document.querySelector(`.download__tabs-content[data-tab-target="${hash}"]`);

    if (targetTab && targetContent) {
        resetAllDownTabs();
        resetAllDownContentExcludingTarget(targetContent);
        targetTab.classList.add('active');
        setTimeout(() => { targetContent.classList.remove('hidden') }, 150);

        const swiperInstance = document.querySelector('.swiper').swiper; // Получаем экземпляр Swiper
        const slideIndex = Array.from(document.querySelectorAll('.download__tabs-item')).indexOf(targetTab);
        if (swiperInstance && slideIndex >= 0) {
            swiperInstance.slideTo(slideIndex); // Прокручиваем слайдер к активному элементу
        }
    }
};

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

            window.location.hash = targetName;
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
            handleResize()
            openTabByHash()
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
                <div class="swiper download__tabs-swiper">
                    <div class="swiper-wrapper">
    `
    if (data['Каталоги']) {
        insertHtml += `
                    <div class="swiper-slide download__tabs-item active" data-target="${transliterate(data['Каталоги'][0].category)}">
                        <button type="button"><span>Каталоги</span></button>
                    </div>
    `}

    categories.forEach((category) => {
        if (category === 'Каталоги') return

        insertHtml += `
                    <div class="swiper-slide download__tabs-item" data-target="${transliterate(category)}">
                        <button type="button"><span>${category}</span></button>
                    </div>
        `
    })

    insertHtml += `
                    </div>
                </div>
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
            <div class="download__tabs-content animation-element" data-tab-target="${transliterate(data['Каталоги'][0].category)}">
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

        insertHtml += `<div class="download__tabs-content hide hidden" data-tab-target="${transliterate(category)}">`

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
                                <table class="download__table${!data[category][0]?.is_video ? '' : ' download__video'}">
            `

                sections[fileSection].forEach(el => {
                    if (!el?.is_video) {
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

let swiperInstance = null;

const initProjectSwiper = () => {
    if (!swiperInstance) {
        swiperInstance = new Swiper('#DownloadTabsList .download__tabs-swiper', {
            loop: false,
            slidesPerView: 'auto',
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            watchOverflow: true,
            spaceBetween: 10,
            freeMode: true,
            breakpoints: {
                992: {
                    spaceBetween: 20
                },
            },
            on: {
                click: function (swiper, event) {
                    const slideIndex = swiper.clickedIndex;
                    swiper.slideTo(slideIndex);
                },
            }
        });
    }
};

const handleResize = () => {
    if (window.innerWidth <= 991) {
        if (!swiperInstance) {
            initProjectSwiper();
        }
    } else {
        if (swiperInstance) {
            swiperInstance.destroy(true, true);
            swiperInstance = null;
        }
    }
};

window.addEventListener('hashchange', openTabByHash);
window.addEventListener('load', () => {
    initDownData();
    openTabByHash();
    window.addEventListener('resize', handleResize);
})
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkb3dubG9hZC9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdHJhbnNsaXRlcmF0ZSA9ICh0ZXh0KSA9PiB7XHJcbiAgICBjb25zdCBtYXAgPSB7XHJcbiAgICAgICAgJ9CwJzogJ2EnLCAn0LEnOiAnYicsICfQsic6ICd2JywgJ9CzJzogJ2cnLCAn0LQnOiAnZCcsICfQtSc6ICdlJywgJ9GRJzogJ2UnLCAn0LYnOiAnemgnLCAn0LcnOiAneicsXHJcbiAgICAgICAgJ9C4JzogJ2knLCAn0LknOiAneScsICfQuic6ICdrJywgJ9C7JzogJ2wnLCAn0LwnOiAnbScsICfQvSc6ICduJywgJ9C+JzogJ28nLCAn0L8nOiAncCcsICfRgCc6ICdyJyxcclxuICAgICAgICAn0YEnOiAncycsICfRgic6ICd0JywgJ9GDJzogJ3UnLCAn0YQnOiAnZicsICfRhSc6ICdraCcsICfRhic6ICd0cycsICfRhyc6ICdjaCcsICfRiCc6ICdzaCcsICfRiSc6ICdzaGNoJyxcclxuICAgICAgICAn0YonOiAnJywgJ9GLJzogJ3knLCAn0YwnOiAnJywgJ9GNJzogJ2UnLCAn0Y4nOiAneXUnLCAn0Y8nOiAneWEnLFxyXG4gICAgICAgICfQkCc6ICdBJywgJ9CRJzogJ0InLCAn0JInOiAnVicsICfQkyc6ICdHJywgJ9CUJzogJ0QnLCAn0JUnOiAnRScsICfQgSc6ICdFJywgJ9CWJzogJ1poJywgJ9CXJzogJ1onLFxyXG4gICAgICAgICfQmCc6ICdJJywgJ9CZJzogJ1knLCAn0JonOiAnSycsICfQmyc6ICdMJywgJ9CcJzogJ00nLCAn0J0nOiAnTicsICfQnic6ICdPJywgJ9CfJzogJ1AnLCAn0KAnOiAnUicsXHJcbiAgICAgICAgJ9ChJzogJ1MnLCAn0KInOiAnVCcsICfQoyc6ICdVJywgJ9CkJzogJ0YnLCAn0KUnOiAnS2gnLCAn0KYnOiAnVHMnLCAn0KcnOiAnQ2gnLCAn0KgnOiAnU2gnLCAn0KknOiAnU2hjaCcsXHJcbiAgICAgICAgJ9CqJzogJycsICfQqyc6ICdZJywgJ9CsJzogJycsICfQrSc6ICdFJywgJ9CuJzogJ1l1JywgJ9CvJzogJ1lhJ1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gdGV4dC5zcGxpdCgnJykubWFwKGNoYXIgPT4gbWFwW2NoYXJdIHx8IGNoYXIpLmpvaW4oJycpLnJlcGxhY2UoL1xccysvZywgJycpO1xyXG59XHJcblxyXG4vLyBUYWJzXHJcbmNvbnN0IHJlc2V0QWxsRG93blRhYnMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBkb3duVGFicyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRvd25sb2FkX190YWJzLWl0ZW0nKSlcclxuICAgIGRvd25UYWJzLmZvckVhY2godGFiID0+IHRhYi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSlcclxufVxyXG5cclxuY29uc3QgcmVzZXRBbGxEb3duQ29udGVudEV4Y2x1ZGluZ1RhcmdldCA9ICh0YXJnZXQpID0+IHtcclxuICAgIGNvbnN0IGRvd25Db250ZW50cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRvd25sb2FkX190YWJzLWNvbnRlbnQnKSlcclxuICAgIGRvd25Db250ZW50cy5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICBpZiAoZWwgIT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKSAvLyBkdXJpbmcgb2YgYW5pbWF0aW9uIGlzIDEwMG1zXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZWwuY2xhc3NMaXN0LmFkZCgnaGlkZScpLCAxMDApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpLCAxMDApXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3Qgb3BlblRhYkJ5SGFzaCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSk7IC8vINCj0LHQuNGA0LDQtdC8INGB0LjQvNCy0L7QuyAjXHJcbiAgICBpZiAoIWhhc2gpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCB0YXJnZXRUYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuZG93bmxvYWRfX3RhYnMtaXRlbVtkYXRhLXRhcmdldD1cIiR7aGFzaH1cIl1gKTtcclxuICAgIGNvbnN0IHRhcmdldENvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuZG93bmxvYWRfX3RhYnMtY29udGVudFtkYXRhLXRhYi10YXJnZXQ9XCIke2hhc2h9XCJdYCk7XHJcblxyXG4gICAgaWYgKHRhcmdldFRhYiAmJiB0YXJnZXRDb250ZW50KSB7XHJcbiAgICAgICAgcmVzZXRBbGxEb3duVGFicygpO1xyXG4gICAgICAgIHJlc2V0QWxsRG93bkNvbnRlbnRFeGNsdWRpbmdUYXJnZXQodGFyZ2V0Q29udGVudCk7XHJcbiAgICAgICAgdGFyZ2V0VGFiLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0YXJnZXRDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpIH0sIDE1MCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHN3aXBlckluc3RhbmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN3aXBlcicpLnN3aXBlcjsgLy8g0J/QvtC70YPRh9Cw0LXQvCDRjdC60LfQtdC80L/Qu9GP0YAgU3dpcGVyXHJcbiAgICAgICAgY29uc3Qgc2xpZGVJbmRleCA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRvd25sb2FkX190YWJzLWl0ZW0nKSkuaW5kZXhPZih0YXJnZXRUYWIpO1xyXG4gICAgICAgIGlmIChzd2lwZXJJbnN0YW5jZSAmJiBzbGlkZUluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgc3dpcGVySW5zdGFuY2Uuc2xpZGVUbyhzbGlkZUluZGV4KTsgLy8g0J/RgNC+0LrRgNGD0YfQuNCy0LDQtdC8INGB0LvQsNC50LTQtdGAINC6INCw0LrRgtC40LLQvdC+0LzRgyDRjdC70LXQvNC10L3RgtGDXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgaW5pdERvd25UYWJzSGFuZGxlcnMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBkb3duVGFicyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRvd25sb2FkX190YWJzLWl0ZW0nKSlcclxuICAgIGRvd25UYWJzLmZvckVhY2godGFiID0+IHtcclxuICAgICAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXROYW1lID0gdGhpcy5kYXRhc2V0LnRhcmdldFxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS10YWItdGFyZ2V0PVwiJHt0YXJnZXROYW1lfVwiXWApXHJcblxyXG4gICAgICAgICAgICByZXNldEFsbERvd25UYWJzKClcclxuICAgICAgICAgICAgcmVzZXRBbGxEb3duQ29udGVudEV4Y2x1ZGluZ1RhcmdldCh0YXJnZXQpXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge3RhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKX0sIDE1MClcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gdGFyZ2V0TmFtZTtcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufVxyXG5cclxuLy8gR2V0dGluZyBhbmQgc2V0dGluZyBkYXRhXHJcbmNvbnN0IGluaXREb3duRGF0YSA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IHVybHMgPSBbXTtcclxuXHJcbiAgICBpZiAoIXdpbmRvdy5Eb3dubG9hZEZpbGVzRGF0YUxpbmspIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ9Cd0LUg0YPQutCw0LfQsNC90LAgQVBJIFVSTCDRhNCw0LnQu9GLINC00LvRjyDRgdC60LDRh9C40LLQsNC90LjRjyB3aW5kb3cuRG93bmxvYWRGaWxlc0RhdGFMaW5rJylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdXJscy5wdXNoKHdpbmRvdy5Eb3dubG9hZEZpbGVzRGF0YUxpbmspXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF3aW5kb3cuRG93bmxvYWRWaWRlb3NEYXRhTGluaykge1xyXG4gICAgICAgIGNvbnNvbGUud2Fybign0J3QtSDRg9C60LDQt9Cw0L3QsCBBUEkgVVJMINGE0LDQudC70Ysg0LTQu9GPINCy0LjQtNC10L4gd2luZG93LkRvd25sb2FkVmlkZW9zRGF0YUxpbmsnKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB1cmxzLnB1c2god2luZG93LkRvd25sb2FkVmlkZW9zRGF0YUxpbmspXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHVybHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCfQndC10YIg0LTQvtGB0YLRg9C/0L3Ri9GFIEFQSSBVUkwg0LTQu9GPINC30LDQs9GA0YPQt9C60LgnKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZmV0Y2hEYXRhID0gYXN5bmMgKHVybCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHVybCk7XHJcbiAgICAgICAgICAgIGlmICghcmVzLm9rKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5ldHdvcmsgZXJyb3Igd2hpbGUgZmV0Y2hpbmcgZGF0YSBmcm9tICR7dXJsfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCByZXMuanNvbigpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LnNwaW5uZXIuc2hvdygpO1xyXG5cclxuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCB1cmwgb2YgdXJscykge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGZldGNoRGF0YSh1cmwpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgc2V0RG93bkRhdGEocmVzdWx0cy5mbGF0KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2luZG93LnNwaW5uZXIuaGlkZSgpO1xyXG4gICAgfSkoKTtcclxuXHJcbiAgICBjb25zdCBzZXREb3duRGF0YSA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZERhdGEgPSB7fVxyXG5cclxuICAgICAgICBkYXRhLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjYXRlZ29yeSA9IGVsLmNhdGVnb3J5XHJcblxyXG4gICAgICAgICAgICBpZiAoIW5vcm1hbGl6ZWREYXRhW2NhdGVnb3J5XSkgbm9ybWFsaXplZERhdGFbY2F0ZWdvcnldID0gW11cclxuXHJcbiAgICAgICAgICAgIG5vcm1hbGl6ZWREYXRhW2NhdGVnb3J5XS5wdXNoKGVsKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cuc3Bpbm5lci5oaWRlKClcclxuICAgICAgICAgICAgc2V0RG93bkNhcHRpb24oKVxyXG4gICAgICAgICAgICBzZXREb3duVGFicyhub3JtYWxpemVkRGF0YSlcclxuICAgICAgICAgICAgc2V0RG93bkZpbGVzKG5vcm1hbGl6ZWREYXRhKVxyXG4gICAgICAgICAgICBzaG93QW5pbUVsZW1lbnRzKClcclxuICAgICAgICAgICAgaW5pdERvd25UYWJzSGFuZGxlcnMoKVxyXG4gICAgICAgICAgICBoYW5kbGVSZXNpemUoKVxyXG4gICAgICAgICAgICBvcGVuVGFiQnlIYXNoKClcclxuICAgICAgICB9LCAxMDApXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHNldERvd25DYXB0aW9uID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0Rvd25sb2FkQ2FwdGlvbicpXHJcblxyXG4gICAgY29uc3QgaW5zZXJ0SHRtbCA9IGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGNvbnRhaW5lcl9jYXB0aW9uIGFuaW1hdGlvbi1lbGVtZW50XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wgY29sLXhsLThcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJjb250YWluZXJfY2FwdGlvbi10ZXh0XCI+0KHQutCw0YfQsNGC0Yw8L2gyPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgYFxyXG5cclxuICAgIGlmICh0YXJnZXQpIHRhcmdldC5pbm5lckhUTUwgPSBpbnNlcnRIdG1sXHJcbn1cclxuXHJcbmNvbnN0IHNldERvd25UYWJzID0gKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBPYmplY3Qua2V5cyhkYXRhKVxyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0Rvd25sb2FkVGFic0xpc3QnKVxyXG5cclxuICAgIGxldCBpbnNlcnRIdG1sID0gYFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRvd25sb2FkX190YWJzIGFuaW1hdGlvbi1lbGVtZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyIGRvd25sb2FkX190YWJzLXN3aXBlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItd3JhcHBlclwiPlxyXG4gICAgYFxyXG4gICAgaWYgKGRhdGFbJ9Ca0LDRgtCw0LvQvtCz0LgnXSkge1xyXG4gICAgICAgIGluc2VydEh0bWwgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2lwZXItc2xpZGUgZG93bmxvYWRfX3RhYnMtaXRlbSBhY3RpdmVcIiBkYXRhLXRhcmdldD1cIiR7dHJhbnNsaXRlcmF0ZShkYXRhWyfQmtCw0YLQsNC70L7Qs9C4J11bMF0uY2F0ZWdvcnkpfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIj48c3Bhbj7QmtCw0YLQsNC70L7Qs9C4PC9zcGFuPjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgYH1cclxuXHJcbiAgICBjYXRlZ29yaWVzLmZvckVhY2goKGNhdGVnb3J5KSA9PiB7XHJcbiAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAn0JrQsNGC0LDQu9C+0LPQuCcpIHJldHVyblxyXG5cclxuICAgICAgICBpbnNlcnRIdG1sICs9IGBcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3dpcGVyLXNsaWRlIGRvd25sb2FkX190YWJzLWl0ZW1cIiBkYXRhLXRhcmdldD1cIiR7dHJhbnNsaXRlcmF0ZShjYXRlZ29yeSl9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiPjxzcGFuPiR7Y2F0ZWdvcnl9PC9zcGFuPjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGBcclxuICAgIH0pXHJcblxyXG4gICAgaW5zZXJ0SHRtbCArPSBgXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICBgXHJcblxyXG4gICAgaWYgKHRhcmdldCkgdGFyZ2V0LmlubmVySFRNTCA9IGluc2VydEh0bWxcclxufVxyXG5cclxuY29uc3Qgc2V0RG93bkZpbGVzID0gKGRhdGEpID0+IHtcclxuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBPYmplY3Qua2V5cyhkYXRhKVxyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0Rvd25sb2FkRmlsZXNMaXN0JylcclxuXHJcbiAgICBsZXQgaW5zZXJ0SHRtbCA9ICcnXHJcblxyXG4gICAgLy8g0J/QtdGA0LLRi9C8INGA0LXQvdC00LXRgNC40Lwg0JrQsNGC0LDQu9C+0LPQuFxyXG4gICAgY29uc3QgY2F0YWxvZ3MgPSBkYXRhWyfQmtCw0YLQsNC70L7Qs9C4J11cclxuXHJcbiAgICBpZiAoY2F0YWxvZ3MgJiYgY2F0YWxvZ3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGluc2VydEh0bWwgKz0gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG93bmxvYWRfX3RhYnMtY29udGVudCBhbmltYXRpb24tZWxlbWVudFwiIGRhdGEtdGFiLXRhcmdldD1cIiR7dHJhbnNsaXRlcmF0ZShkYXRhWyfQmtCw0YLQsNC70L7Qs9C4J11bMF0uY2F0ZWdvcnkpfVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBjb250YWluZXJfY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbCBjb2wteGwtOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzPVwiY29udGFpbmVyX2NhcHRpb24tdGV4dFwiPtCa0LDRgtCw0LvQvtCz0Lg8L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICBgXHJcblxyXG4gICAgICAgIGNhdGFsb2dzLmZvckVhY2goY2F0YWxvZyA9PiB7XHJcbiAgICAgICAgICAgIGluc2VydEh0bWwgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1tZC02IGNvbC14bC00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG93bmxvYWRfX2NvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZG93bmxvYWRfX2NhcmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRvd25sb2FkX19wb3N0ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHtjYXRhbG9nLnByZXZpZXd9XCIgYWx0PVwiXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3dubG9hZF9kZXNjcmlwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwiZG93bmxvYWRfX25hbWVcIj4ke2NhdGFsb2cubmFtZX08L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkb3dubG9hZF9fdGV4dFwiPtCa0LDRgtCw0LvQvtCzPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkb3dubG9hZF9fdGV4dCB1cHBlcmNhc2VcIj4ke2NhdGFsb2cuZXh0ZW5zaW9ufSAtICR7Y2F0YWxvZy5zaXplX2h1bWFufTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRvd25sb2FkX19idXR0b25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuX2Jsb2NrIGJ0bl9kYXJrIGJ0bl9kb3dubG9hZFwiIGhyZWY9XCIke2NhdGFsb2cuZG93bmxvYWR9XCIgZG93bmxvYWQ9XCJkb3dubG9hZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGk+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+0KHQutCw0YfQsNGC0Ywg0LrQsNGC0LDQu9C+0LM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgYFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGluc2VydEh0bWwgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGBcclxuICAgIH1cclxuXHJcbiAgICAvLyDQntGB0YLQsNC70YzQvdGL0LUg0YTQsNC50LvRiyDQtNC70Y8g0YHQutCw0YfQuNCy0LDQvdC40Y9cclxuICAgIGNhdGVnb3JpZXMuZm9yRWFjaCgoY2F0ZWdvcnkpID0+IHtcclxuICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICfQmtCw0YLQsNC70L7Qs9C4JykgcmV0dXJuXHJcblxyXG4gICAgICAgIGluc2VydEh0bWwgKz0gYDxkaXYgY2xhc3M9XCJkb3dubG9hZF9fdGFicy1jb250ZW50IGhpZGUgaGlkZGVuXCIgZGF0YS10YWItdGFyZ2V0PVwiJHt0cmFuc2xpdGVyYXRlKGNhdGVnb3J5KX1cIj5gXHJcblxyXG4gICAgICAgIGlmIChkYXRhW2NhdGVnb3J5XS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb25zID0gZ2V0RGF0YUZpbGVzU2VjdGlvbnMoZGF0YVtjYXRlZ29yeV0pXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZVNlY3Rpb24gaW4gc2VjdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIGluc2VydEh0bWwgKz0gYFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciBjb250YWluZXJfY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbCBjb2wteGwtOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzPVwiY29udGFpbmVyX2NhcHRpb24tdGV4dFwiPiR7ZmlsZVNlY3Rpb259PC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3dubG9hZF9fd3JhcFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cImRvd25sb2FkX190YWJsZSR7IWRhdGFbY2F0ZWdvcnldWzBdPy5pc192aWRlbyA/ICcnIDogJyBkb3dubG9hZF9fdmlkZW8nfVwiPlxyXG4gICAgICAgICAgICBgXHJcblxyXG4gICAgICAgICAgICAgICAgc2VjdGlvbnNbZmlsZVNlY3Rpb25dLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZWw/LmlzX3ZpZGVvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydEh0bWwgKz0gYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGEgaHJlZj1cIiR7ZWwuZG93bmxvYWR9XCIgZG93bmxvYWQ+JHtlbC5uYW1lfTwvYT48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPiR7ZWwuZXh0ZW5zaW9ufSAtICR7ZWwuc2l6ZV9odW1hbn08L3RkPiA8IS0tICR7Y2F0ZWdvcnl9IC0tPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxhIGNsYXNzPVwiYnRuIGJ0bl9kYXJrIGJ0bl9kb3dubG9hZFwiIGhyZWY9XCIke2VsLmRvd25sb2FkfVwiIGRvd25sb2FkPjxpPjwvaT48L2E+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRIdG1sICs9IGBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPiR7ZWwubmFtZX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkb3dubG9hZF9fdGFibGUtcHJldmlld1wiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtaWQ9XCIke2VsLmlkfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS12aWRlbz1cIiR7ZWwubGlua31cIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLW1vZGFsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtbW9kYWwtdGFyZ2V0PVwiI21vZGFsVmlkZW9cIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLW1vZGFsLWFjdGlvbj1cInNob3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2VsLnByZXZpZXd9XCIgYWx0PVwiJHtlbC5uYW1lfVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwbGF5XCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgaW5zZXJ0SHRtbCArPSBgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICBgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluc2VydEh0bWwgKz0gJzwvZGl2PidcclxuICAgIH0pXHJcblxyXG4gICAgaWYgKHRhcmdldCkgdGFyZ2V0LmlubmVySFRNTCA9IGluc2VydEh0bWxcclxufVxyXG5cclxuY29uc3QgZ2V0RGF0YUZpbGVzU2VjdGlvbnMgPSAoZGF0YSkgPT4ge1xyXG4gICAgY29uc3Qgbm9ybWFsaXplZERhdGEgPSB7fVxyXG5cclxuICAgIGRhdGEuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgY29uc3QgdGFnID0gZWwudGFncy5sZW5ndGggPiAwID8gZWwudGFnc1swXSA6ICcnXHJcblxyXG4gICAgICAgIGlmICghbm9ybWFsaXplZERhdGFbdGFnXSkgbm9ybWFsaXplZERhdGFbdGFnXSA9IFtdXHJcblxyXG4gICAgICAgIG5vcm1hbGl6ZWREYXRhW3RhZ10ucHVzaChlbClcclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWREYXRhXHJcbn1cclxuXHJcbmxldCBzd2lwZXJJbnN0YW5jZSA9IG51bGw7XHJcblxyXG5jb25zdCBpbml0UHJvamVjdFN3aXBlciA9ICgpID0+IHtcclxuICAgIGlmICghc3dpcGVySW5zdGFuY2UpIHtcclxuICAgICAgICBzd2lwZXJJbnN0YW5jZSA9IG5ldyBTd2lwZXIoJyNEb3dubG9hZFRhYnNMaXN0IC5kb3dubG9hZF9fdGFicy1zd2lwZXInLCB7XHJcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgICAgIG9ic2VydmVyOiB0cnVlLFxyXG4gICAgICAgICAgICBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICAgICAgICAgICAgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IHRydWUsXHJcbiAgICAgICAgICAgIHdhdGNoT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXHJcbiAgICAgICAgICAgIGZyZWVNb2RlOiB0cnVlLFxyXG4gICAgICAgICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgICAgICAgICAgOTkyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAyMFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoc3dpcGVyLCBldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNsaWRlSW5kZXggPSBzd2lwZXIuY2xpY2tlZEluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXBlci5zbGlkZVRvKHNsaWRlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgaGFuZGxlUmVzaXplID0gKCkgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IDk5MSkge1xyXG4gICAgICAgIGlmICghc3dpcGVySW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgaW5pdFByb2plY3RTd2lwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChzd2lwZXJJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBzd2lwZXJJbnN0YW5jZS5kZXN0cm95KHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICBzd2lwZXJJbnN0YW5jZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCBvcGVuVGFiQnlIYXNoKTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0RG93bkRhdGEoKTtcclxuICAgIG9wZW5UYWJCeUhhc2goKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBoYW5kbGVSZXNpemUpO1xyXG59KSJdLCJmaWxlIjoiZG93bmxvYWQuanMifQ==
