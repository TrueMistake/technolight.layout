// Частично логика фильтров находится в файле логики работы фильтра src\components\filters\script.js

// На стороне бэка нужно проинициализировать переменную window._PRODUCTS_PER_PAGE в которой храним количество товаров на странице каталога!
if (!window._PRODUCTS_PER_PAGE) {
    console.error('There is no variable number of products on the Catalog page! Should to add variable as window._PRODUCTS_PER_PAGE=10')
}

const RERENDER_PROD_TIMEOUT_DELAY = 1000

const setProdUrlParam = (name, val, type) => {
    let url = window.location.href

    // Проверяем, есть ли уже параметр с типом type и именем name в URL --- type[name]=
    if (url.indexOf(`${type}[${name}]=`) !== -1) {
        // Если значение val равно "reset", удаляем параметр из URL иначе обновляем на новое значение
        url = val === 'reset'
            ? url.replace(new RegExp(`(${type}\\[${name}\\]=)[^&]+`), '')
            : url.replace(new RegExp(`(${type}\\[${name}\\]=)[^&]+`), `$1${val}`)
    } else { // Если параметра с именем name нет в URL, добавляем его
        url += url.indexOf("?") !== -1
            ? `&${type}[${name}]=${val}`
            : `?${type}[${name}]=${val}`
    }

    // Только для фильтров и сортировки удаляем параметрт страницы, так как меняется выборка
    if (type === 'filter' || type === 'sort') {
        url = url.replace(/&?select\[page\]=[^&]*/g, '');
    }

    // Удаляем лишние & из url и ? для ULR без параметров
    url = url.replace(/&+/g, '&')
    url = url.replace(/\?&/g, '?')
    url = url.replace(/&$/g, '')
    url = url.replace(/\?$/, '')
    url = decodeURIComponent(url)

    // Обновляем URL страницы
    window.history.pushState({}, "", url);

    // Стартуем процесс обрботки данных
    processProdData(url)
}

const initDefaultProdCatalog = () => {
    if (window._CATALOG) return
    window._CATALOG = {}
}

const requestProductData = async () => {
    window._CATALOG = []
    const res = await fetch('https://anaragaev.github.io/technolight.layout/mocks/products.json')
    if (res.ok) {
        const parsedData = await res.json()

        if ('data' in parsedData) {
            window._CATALOG = parsedData.data
        } else {
            console.error('В запрошенных данных каталога нет объекта с данными! Предполагается наличие свойства с data.');
        }

        if (window._CATALOG.length === 0) {
            console.error('Пришел пустой объкт с данными!');
        }

    } else {
        console.error('Ошибка запроса каталога товаров! Код ошибки:', res.status)
    }
}

const checkProductResetAllButton = () => {
    const checkedFilters = Array.from(document
        .querySelectorAll('.filters__options.checked'))

    const resetAllButton = document.querySelector('.filters__reset')

    checkedFilters.length > 0
        ? resetAllButton.classList.remove('disabled')
        : resetAllButton.classList.add('disabled')
}

const undroppProductFilterLists = (filters) => {
    filters.forEach(filter => {
        filter.classList.remove('dropped')
        setTimeout(() => filter.classList.remove('active'), 300)
    })
}

const resetAllProductsFilters = (node) => {
    const container = node.closest('.page-catalog .filters')

    const filters = container
            .querySelectorAll('.filters__list .filters__item')

    const options = Array.from(document
            .querySelectorAll('.page-catalog .filters__options'))

    const controllers = Array.from(container
            .querySelectorAll('input[type="radio"]:not([value="reset"]'))

    undroppProductFilterLists(filters)
    options.forEach(el => el.classList.remove('checked')) // hide rset option button
    controllers.forEach(controller => controller.checked = false) // reset all input controllers
    node.closest('.filters__reset').classList.add('disabled')
}

const removeFilterParamFromCatalogUrl = (url, param) => {
    const strRegex = `${param}[^&]*`
    const regex = new RegExp(strRegex, 'g')
    return url.replace(regex, '')
}

const initCatalogFilterReset = () => {
    const reset = document.querySelector('.page-catalog .filters__reset .filters__item')
    if (!reset) return

    reset.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()

        const deletedParams = JSON.parse(this.dataset.deletedParams)
        let url = window.location.href

        // Проверяем, есть ли GET параметры в URL
        if (url.indexOf('?') === -1) return

        for (const param of deletedParams) {
            url = removeFilterParamFromCatalogUrl(url, param)
        }

        // Удаляем лишние & из url и ? для ULR без параметров
        url = url.replace(/&+/g, '&')
        url = url.replace(/\?&/g, '?')
        url = url.replace(/&$/g, '')
        url = url.replace(/\?$/, '')
        url = decodeURIComponent(url)

        // Обновляем URL страницы без GET параметров
        window.history.pushState({}, "", url)

        // Сбрасываем все выбранные фильтры
        resetAllProductsFilters(this)

        // Стартуем процесс обрботки данных
        processProdData(url)
    })
}

const initCatalogFilterControllers = () => {
    const controllers = Array.from(document.querySelectorAll('.page-catalog .filters input[type="radio"]'))

    controllers.forEach(el => el.addEventListener('change', function(e) {
        e.preventDefault()
        e.stopPropagation()

        const container = this.closest('.filters__options')

        this.value !== 'reset'
            ? container.classList.add('checked')
            : container.classList.remove('checked')

        setProdUrlParam(this.name, this.value, this.dataset.type)
        checkProductResetAllButton()
    }))
}

const getCurrentPageNumberFromUrl = () => {
    const url = window.location.href
    const params = new URLSearchParams(url.split('?')[1]);
    return params.get('select[page]');
}

const initCatalogPaginationControllers = () => {
    const countsOfPage = document.querySelectorAll('.page-catalog .pagination .pagination__btn_page').length
    const pagination = document.querySelector('.page-catalog .pagination')
    const controllers = Array.from(pagination.querySelectorAll('.page-catalog .pagination button'))
    const first = pagination.querySelector('[data-page="first"]')
    const last = pagination.querySelector('[data-page="last"]')
    const prev = pagination.querySelector('[data-page="prev"]')
    const next = pagination.querySelector('[data-page="next"]')

    const resetAllPaginationBtns = () => {
        controllers.forEach(el => el.classList.remove('disabled', 'active'))
    }

    const actievFirst = () => {
        first.classList.add('disabled')
        prev.classList.add('disabled')
        pagination.querySelector('[data-page="1"]').classList.add('active')
    }

    const activeLast = () => {
        last.classList.add('disabled')
        next.classList.add('disabled')
        pagination.querySelector(`[data-page="${countsOfPage}"]`).classList.add('active')
    }

    const activePage = (page) => {
        if (parseInt(page) === 1) {
            actievFirst()
            return
        }

        if (parseInt(page) === countsOfPage) {
            activeLast()
            return
        }

        pagination
            .querySelector(`[data-page="${page}"]`)
            .classList.add('active')
    }

    controllers.forEach(el => el.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()
        const currentPage = getCurrentPageNumberFromUrl()

        let page = this.dataset.page

        resetAllPaginationBtns()

        switch (page) {
            case 'first': {
                page = 1
                actievFirst()
            } break;
            case 'last': {
                page = countsOfPage
                activeLast()
            } break;
            case 'prev': {
                page = currentPage - 1
                activePage(page)
            } break;
            case 'next': {
                page = currentPage ? parseInt(currentPage) + 1 : 2
                activePage(page)
            } break;
            default: {
                activePage(page)
            } break;
        }

        if (page !== currentPage) setProdUrlParam('page', page, 'select')
    }))
}

const parseProdUrl = (url) => {
    const params = {}
    const queryString = url.split('?')[1]

    if (queryString) {
        const paramPairs = queryString.split('&')

        paramPairs.forEach(pair => {
            const [param, val] = pair.split('=')

            if (!param.includes('[')) return

            const [type, dirtyProp] = param.split('[')
            const prop = dirtyProp.slice(0, -1);

            if (!params[type]) params[type] = {}

            params[type][prop] = val
        })
    }

    return params
}

const updateProdPagination = (totalProducts, pageNumber, totalPages) => {
    const paginationNode = document.querySelector('.page-catalog .pagination')

    // Рассчитвыем страницы и подeфолту показываем первую
    totalPages = Math.ceil(totalProducts / window._PRODUCTS_PER_PAGE)

    const isFirstPage = pageNumber === 1 ? 'disabled' : ''
    const isLastPage = pageNumber === totalPages ? 'disabled' : ''
    let paginationLayout = ''

    paginationLayout += `<button class="pagination__extremum ${isFirstPage}" href="" data-page="first">первая</button>`
    paginationLayout += `<button class="pagination__btn pagination__btn_prev ${isFirstPage}" href="" data-page="prev"><i></i></button>`

    for (let i = 1; i <= totalPages; i++) {
        const isActivePage = pageNumber === i ? 'active': ''
        paginationLayout += `<button class="pagination__btn pagination__btn_page ${isActivePage}" href="" data-page="${i}">${i}</button>`
    }

    paginationLayout += `<button class="pagination__btn pagination__btn_next ${isLastPage}" href="" data-page="next"><i></i></button>`
    paginationLayout += `<button class="pagination__extremum ${isLastPage}" href="" data-page="last">последняя</button>`

    // Блокируем текущую пагинацию
    paginationNode.classList.add('blocked')

    // Искусственно добавляем задержку в перерендер пагинации
    // Аналогичная задержка в рендеринге контента
    setTimeout(() => {
        // Если после филтрации и сортировки нет подходящих продуктов, скрываем пагинацию
        if (totalProducts === 0) {
            paginationNode.classList.add('hide')
            return
        } else {
            paginationNode.classList.remove('hide')
        }

        paginationNode.innerHTML = paginationLayout
        initCatalogPaginationControllers()
        paginationNode.classList.remove('blocked')
    }, RERENDER_PROD_TIMEOUT_DELAY)
}

const filterProdData = (filter, initilaData) => {
    if (!filter) return initilaData // Если нет фильтров, просто пробрасываем данные дальше

    let data = initilaData

    for (const key in filter) {
        let val = filter[key]
        if (val === 'Не указан'
                || val === 'Не указано'
                || val === 'Не указана'
                || val === 'Без категории') {
            val = ''
        }

        data = data.filter(prod => {
            if (Array.isArray(prod[key])) {
                if (val === '') return prod[key].length === 0

                return prod[key].includes(val)
            }
            return prod[key] === val
        })
    }

    console.log('after FILTER', data);
    console.log('FILTER --------------------------------------------------------');

    return data
}

const sortProdData = (sort, filteredData) => {
    if (!sort) return filteredData // Если нет сортировки, просто пробрасываем данные дальше

    let data = filteredData

    for (const key in sort) {
        let val = sort[key]
        data = data.sort( function(a, b) {
            if (val === 'По возрастанию') {
                return a[key] - b[key]
            }
            return b[key] - a[key]
        })
    }

    console.log('after SORT', data);
    console.log('SORT -------------------------------------------------------------');

    return data
}

const getPageFromProdData = (select, filteredAndSortedData) => {
    let data = filteredAndSortedData

    // Если нет параметра select со страницей, либо страница не указана, то выбираем первую страницу
    let pageNumber = !select
        ? 1
        : !select.page || select.page === ''
            ? 1
            : parseInt(select.page)

    // Вычисляем общее количество страниц
    const totalPages = Math.ceil(data.length / window._PRODUCTS_PER_PAGE)

    // Если номер страницы отрицательный, возвращаем первую страницу
    if (pageNumber < 1) {
        pageNumber = 1
    }

    // Если номер страницы больше максимальной, возвращаем последнюю страницу
    if (pageNumber > totalPages) {
        pageNumber = totalPages
    }

    // Вычисляем индексы начала и конца для текущей страницы
    const startIndex = (pageNumber - 1) * window._PRODUCTS_PER_PAGE
    const endIndex = startIndex + window._PRODUCTS_PER_PAGE
    data = data.slice(startIndex, endIndex)

    console.log('after get PAGE', data);
    console.log('GET PAGE --------------------------------------');

    // Обновляем пагинацию после того как получили подмасив товаров нужной страницы
    updateProdPagination(filteredAndSortedData.length, pageNumber, totalPages)

    return data
}

const sortProdByCategory = (filteredSortedPagedData) => {
    const categorys = {}

    for (const prod of filteredSortedPagedData) {
        let currentCategory = prod.category[0]
        if (!currentCategory) {
            currentCategory = 'Без категории'
        }

        // Если текущей категории нет в объекте categorys, добавляем
        const isCategory = currentCategory in categorys
        if (!isCategory) {
            categorys[currentCategory] = []
        }

        // Пушим товар в соответствующую категорию
        categorys[currentCategory].push(prod)
    }

    console.log('after replaced By Category', categorys);
    console.log('Replaced By Category --------------------------------------');

    return categorys
}

const buildProductListLayout = (categorys) => {
    let productSectionsHtmlLayout = ''

    for (const key in categorys) {
        let sectionHtmlLayout = ''

        sectionHtmlLayout += `
            <section class="section section_product-list">
                <div class="product-item__container">
                    <div class="container container_caption">
                        <div class="row">
                            <div class="col col-xl-8">
                                <h2 class="container_caption-text">${key}</h2>
                            </div>
                        </div>
                    </div>
                    <div class="product-item__list">
                        <div class="container">
                            <div class="row">`

            for (const singleProduct of categorys[key]) {
                // Добавляем теги если они есть
                const tags = singleProduct.tags

                let badgeLayout = ''

                if (!Array.isArray(tags) && Object.keys(tags)) {
                    badgeLayout += '<div class="product-item__badge-list">'
                        if (tags['new']) badgeLayout += '<span class="product-item__badge-item">Новинка</span>'
                        if (tags['IP']) badgeLayout += '<span class="product-item__badge-item product-item__badge-item_waterproof">IP 44<i></i></span>'
                    badgeLayout += '</div>'
                }

                const price = singleProduct.price ? singleProduct.price + ' ₽' : ''

                sectionHtmlLayout += `
                    <div class="col-12 col-sm-6 col-md-4 col-xl-3">
                        <div class="product-item__card">
                            <a class="product-item__body" href="#" title="${singleProduct.title}">
                                ${badgeLayout}
                                <div class="product-item__pic">
                                    <img src="${singleProduct.image}" alt="" loading="lazy">
                                    <button class="product-item__favorites"
                                        type="button"
                                        data-product-id="${singleProduct.article}"
                                        data-title="${singleProduct.title}"
                                        data-message="Добавлен в избранное"></button>
                                </div>
                                <div class="product-item__content">
                                    <div class="product-item__desc">
                                        <span class="product-item__code">${singleProduct.article}</span>
                                        <p class="product-item__name">${singleProduct.title}</p>
                                    </div>
                                    <div class="product-item__buy">
                                        <span class="product-item__price">${price}</span>
                                        <button class="product-item__cart"
                                            type="button"
                                            data-product-id="${singleProduct.article}"
                                            data-title="${singleProduct.title}"
                                            data-message="Добавлен в корзину">
                                        </button>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>`
            }

        sectionHtmlLayout += `
                            </div>
                        </div>
                    </div>
                </div>
            </section>`

        productSectionsHtmlLayout += sectionHtmlLayout
    }
    return productSectionsHtmlLayout
}

const buildNoProductListMsgLayout = () => {
    return `
        <section class="section section_product-list">
            <div class="description__msg display visible">
                <div class="container">
                    <span>К сожалению, по Вашему запросу ничего не найдено. Товара с данными параметрами нет.</span>
                </div>
            </div>
        </section>
    `
}

const updateProductListOnPage = (categorys) => {
    window.spinner.show()

    // Собираем контент страницы в зависимости от того есть ли в выборке товары
    const productSectionsHtmlLayout = Object.keys(categorys).length === 0
        ? buildNoProductListMsgLayout()
        : buildProductListLayout(categorys)

    const remoteNodes = Array.from(document
        .querySelectorAll('.page-catalog .section_product-list'))
    // Блокируем текущие продукты
    remoteNodes.forEach(node => node.classList.add('blocked'))

    // Искусственно добавляем задержку в перерендер контента
    // Аналогичная задержка в рендеринге пагинации
    setTimeout(() => {
        // Удаляем текущие продукты со страницы
        remoteNodes.forEach(node => node.parentNode.removeChild(node))

        const referenceNode = document.querySelector('.page-catalog .section_filter')

        // Вставляем HTML код после referenceNode
        referenceNode.insertAdjacentHTML('afterend', productSectionsHtmlLayout)

        // Скролим в начало страницы
        smoothScrollTo(0, 1000)

        // Инициализируем кнопки добавления в избранные и в корзину
        initAddToFavorites()
        initAddToCart()

        // Скрываем спиннер
        window.spinner.hide()

        // Показываем анимируемые секции если нужно
        showAnimElements()
    }, RERENDER_PROD_TIMEOUT_DELAY)
}

const processProdData = (url) => {

    // Получаем параметры сортировки и фильтрации из url
    const manipulationDataObj = parseProdUrl(url)

    console.log('manipulationDataObj', manipulationDataObj);

    // Step 5. Обновляем список товаров на стрнице
    updateProductListOnPage(

        // Step 4. Сортируем товары по категориями. --- Возвращает: объект с категориями, где в занчении каждой категории лежит массив с товарами этой категории
        sortProdByCategory(

            // Step 3. Выбираем подмассив нужную страницу. --- Возвращает: подмассив с продуктамии соответструющей страницы
            // После получения страницы (внутри метода) обновляем пагинацию!
            getPageFromProdData(
                manipulationDataObj.select,

                // Step 2. Сортируем данные --- Возвращает: отсортированный массив с продуктами
                sortProdData(
                    manipulationDataObj.sort,

                    // Step 1. Фильтруем данные --- Возвращает: отфильтрованный массив с продуктами
                    filterProdData(
                        manipulationDataObj.filter,
                        window._CATALOG
                    )
                )
            )
        )
    )
}

window.addEventListener('load', () => {
    const isPageCatalog = document.querySelector('.page-catalog')
    if (!isPageCatalog) return

    initCatalogFilterControllers()
    initCatalogFilterReset()
    initCatalogPaginationControllers()
    initDefaultProdCatalog()
    requestProductData()
})

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjYXRhbG9nL3NjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyDQp9Cw0YHRgtC40YfQvdC+INC70L7Qs9C40LrQsCDRhNC40LvRjNGC0YDQvtCyINC90LDRhdC+0LTQuNGC0YHRjyDQsiDRhNCw0LnQu9C1INC70L7Qs9C40LrQuCDRgNCw0LHQvtGC0Ysg0YTQuNC70YzRgtGA0LAgc3JjXFxjb21wb25lbnRzXFxmaWx0ZXJzXFxzY3JpcHQuanNcclxuXHJcbi8vINCd0LAg0YHRgtC+0YDQvtC90LUg0LHRjdC60LAg0L3Rg9C20L3QviDQv9GA0L7QuNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0YLRjCDQv9C10YDQtdC80LXQvdC90YPRjiB3aW5kb3cuX1BST0RVQ1RTX1BFUl9QQUdFINCyINC60L7RgtC+0YDQvtC5INGF0YDQsNC90LjQvCDQutC+0LvQuNGH0LXRgdGC0LLQviDRgtC+0LLQsNGA0L7QsiDQvdCwINGB0YLRgNCw0L3QuNGG0LUg0LrQsNGC0LDQu9C+0LPQsCFcclxuaWYgKCF3aW5kb3cuX1BST0RVQ1RTX1BFUl9QQUdFKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdUaGVyZSBpcyBubyB2YXJpYWJsZSBudW1iZXIgb2YgcHJvZHVjdHMgb24gdGhlIENhdGFsb2cgcGFnZSEgU2hvdWxkIHRvIGFkZCB2YXJpYWJsZSBhcyB3aW5kb3cuX1BST0RVQ1RTX1BFUl9QQUdFPTEwJylcclxufVxyXG5cclxuY29uc3QgUkVSRU5ERVJfUFJPRF9USU1FT1VUX0RFTEFZID0gMTAwMFxyXG5cclxuY29uc3Qgc2V0UHJvZFVybFBhcmFtID0gKG5hbWUsIHZhbCwgdHlwZSkgPT4ge1xyXG4gICAgbGV0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXHJcblxyXG4gICAgLy8g0J/RgNC+0LLQtdGA0Y/QtdC8LCDQtdGB0YLRjCDQu9C4INGD0LbQtSDQv9Cw0YDQsNC80LXRgtGAINGBINGC0LjQv9C+0LwgdHlwZSDQuCDQuNC80LXQvdC10LwgbmFtZSDQsiBVUkwgLS0tIHR5cGVbbmFtZV09XHJcbiAgICBpZiAodXJsLmluZGV4T2YoYCR7dHlwZX1bJHtuYW1lfV09YCkgIT09IC0xKSB7XHJcbiAgICAgICAgLy8g0JXRgdC70Lgg0LfQvdCw0YfQtdC90LjQtSB2YWwg0YDQsNCy0L3QviBcInJlc2V0XCIsINGD0LTQsNC70Y/QtdC8INC/0LDRgNCw0LzQtdGC0YAg0LjQtyBVUkwg0LjQvdCw0YfQtSDQvtCx0L3QvtCy0LvRj9C10Lwg0L3QsCDQvdC+0LLQvtC1INC30L3QsNGH0LXQvdC40LVcclxuICAgICAgICB1cmwgPSB2YWwgPT09ICdyZXNldCdcclxuICAgICAgICAgICAgPyB1cmwucmVwbGFjZShuZXcgUmVnRXhwKGAoJHt0eXBlfVxcXFxbJHtuYW1lfVxcXFxdPSlbXiZdK2ApLCAnJylcclxuICAgICAgICAgICAgOiB1cmwucmVwbGFjZShuZXcgUmVnRXhwKGAoJHt0eXBlfVxcXFxbJHtuYW1lfVxcXFxdPSlbXiZdK2ApLCBgJDEke3ZhbH1gKVxyXG4gICAgfSBlbHNlIHsgLy8g0JXRgdC70Lgg0L/QsNGA0LDQvNC10YLRgNCwINGBINC40LzQtdC90LXQvCBuYW1lINC90LXRgiDQsiBVUkwsINC00L7QsdCw0LLQu9GP0LXQvCDQtdCz0L5cclxuICAgICAgICB1cmwgKz0gdXJsLmluZGV4T2YoXCI/XCIpICE9PSAtMVxyXG4gICAgICAgICAgICA/IGAmJHt0eXBlfVske25hbWV9XT0ke3ZhbH1gXHJcbiAgICAgICAgICAgIDogYD8ke3R5cGV9WyR7bmFtZX1dPSR7dmFsfWBcclxuICAgIH1cclxuXHJcbiAgICAvLyDQotC+0LvRjNC60L4g0LTQu9GPINGE0LjQu9GM0YLRgNC+0LIg0Lgg0YHQvtGA0YLQuNGA0L7QstC60Lgg0YPQtNCw0LvRj9C10Lwg0L/QsNGA0LDQvNC10YLRgNGCINGB0YLRgNCw0L3QuNGG0YssINGC0LDQuiDQutCw0Log0LzQtdC90Y/QtdGC0YHRjyDQstGL0LHQvtGA0LrQsFxyXG4gICAgaWYgKHR5cGUgPT09ICdmaWx0ZXInIHx8IHR5cGUgPT09ICdzb3J0Jykge1xyXG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC8mP3NlbGVjdFxcW3BhZ2VcXF09W14mXSovZywgJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCj0LTQsNC70Y/QtdC8INC70LjRiNC90LjQtSAmINC40LcgdXJsINC4ID8g0LTQu9GPIFVMUiDQsdC10Lcg0L/QsNGA0LDQvNC10YLRgNC+0LJcclxuICAgIHVybCA9IHVybC5yZXBsYWNlKC8mKy9nLCAnJicpXHJcbiAgICB1cmwgPSB1cmwucmVwbGFjZSgvXFw/Ji9nLCAnPycpXHJcbiAgICB1cmwgPSB1cmwucmVwbGFjZSgvJiQvZywgJycpXHJcbiAgICB1cmwgPSB1cmwucmVwbGFjZSgvXFw/JC8sICcnKVxyXG4gICAgdXJsID0gZGVjb2RlVVJJQ29tcG9uZW50KHVybClcclxuXHJcbiAgICAvLyDQntCx0L3QvtCy0LvRj9C10LwgVVJMINGB0YLRgNCw0L3QuNGG0YtcclxuICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgdXJsKTtcclxuXHJcbiAgICAvLyDQodGC0LDRgNGC0YPQtdC8INC/0YDQvtGG0LXRgdGBINC+0LHRgNCx0L7RgtC60Lgg0LTQsNC90L3Ri9GFXHJcbiAgICBwcm9jZXNzUHJvZERhdGEodXJsKVxyXG59XHJcblxyXG5jb25zdCBpbml0RGVmYXVsdFByb2RDYXRhbG9nID0gKCkgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5fQ0FUQUxPRykgcmV0dXJuXHJcbiAgICB3aW5kb3cuX0NBVEFMT0cgPSB7fVxyXG59XHJcblxyXG5jb25zdCByZXF1ZXN0UHJvZHVjdERhdGEgPSBhc3luYyAoKSA9PiB7XHJcbiAgICB3aW5kb3cuX0NBVEFMT0cgPSBbXVxyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvcHJvZHVjdHMuanNvbicpXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgY29uc3QgcGFyc2VkRGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuXHJcbiAgICAgICAgaWYgKCdkYXRhJyBpbiBwYXJzZWREYXRhKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5fQ0FUQUxPRyA9IHBhcnNlZERhdGEuZGF0YVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ9CSINC30LDQv9GA0L7RiNC10L3QvdGL0YUg0LTQsNC90L3Ri9GFINC60LDRgtCw0LvQvtCz0LAg0L3QtdGCINC+0LHRitC10LrRgtCwINGBINC00LDQvdC90YvQvNC4ISDQn9GA0LXQtNC/0L7Qu9Cw0LPQsNC10YLRgdGPINC90LDQu9C40YfQuNC1INGB0LLQvtC50YHRgtCy0LAg0YEgZGF0YS4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuX0NBVEFMT0cubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Cf0YDQuNGI0LXQuyDQv9GD0YHRgtC+0Lkg0L7QsdGK0LrRgiDRgSDQtNCw0L3QvdGL0LzQuCEnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0LfQsNC/0YDQvtGB0LAg0LrQsNGC0LDQu9C+0LPQsCDRgtC+0LLQsNGA0L7QsiEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBjaGVja1Byb2R1Y3RSZXNldEFsbEJ1dHRvbiA9ICgpID0+IHtcclxuICAgIGNvbnN0IGNoZWNrZWRGaWx0ZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsdGVyc19fb3B0aW9ucy5jaGVja2VkJykpXHJcblxyXG4gICAgY29uc3QgcmVzZXRBbGxCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsdGVyc19fcmVzZXQnKVxyXG5cclxuICAgIGNoZWNrZWRGaWx0ZXJzLmxlbmd0aCA+IDBcclxuICAgICAgICA/IHJlc2V0QWxsQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJylcclxuICAgICAgICA6IHJlc2V0QWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJylcclxufVxyXG5cclxuY29uc3QgdW5kcm9wcFByb2R1Y3RGaWx0ZXJMaXN0cyA9IChmaWx0ZXJzKSA9PiB7XHJcbiAgICBmaWx0ZXJzLmZvckVhY2goZmlsdGVyID0+IHtcclxuICAgICAgICBmaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBlZCcpXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBmaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyksIDMwMClcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0QWxsUHJvZHVjdHNGaWx0ZXJzID0gKG5vZGUpID0+IHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IG5vZGUuY2xvc2VzdCgnLnBhZ2UtY2F0YWxvZyAuZmlsdGVycycpXHJcblxyXG4gICAgY29uc3QgZmlsdGVycyA9IGNvbnRhaW5lclxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmZpbHRlcnNfX2xpc3QgLmZpbHRlcnNfX2l0ZW0nKVxyXG5cclxuICAgIGNvbnN0IG9wdGlvbnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnZS1jYXRhbG9nIC5maWx0ZXJzX19vcHRpb25zJykpXHJcblxyXG4gICAgY29uc3QgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKGNvbnRhaW5lclxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdOm5vdChbdmFsdWU9XCJyZXNldFwiXScpKVxyXG5cclxuICAgIHVuZHJvcHBQcm9kdWN0RmlsdGVyTGlzdHMoZmlsdGVycylcclxuICAgIG9wdGlvbnMuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKCdjaGVja2VkJykpIC8vIGhpZGUgcnNldCBvcHRpb24gYnV0dG9uXHJcbiAgICBjb250cm9sbGVycy5mb3JFYWNoKGNvbnRyb2xsZXIgPT4gY29udHJvbGxlci5jaGVja2VkID0gZmFsc2UpIC8vIHJlc2V0IGFsbCBpbnB1dCBjb250cm9sbGVyc1xyXG4gICAgbm9kZS5jbG9zZXN0KCcuZmlsdGVyc19fcmVzZXQnKS5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpXHJcbn1cclxuXHJcbmNvbnN0IHJlbW92ZUZpbHRlclBhcmFtRnJvbUNhdGFsb2dVcmwgPSAodXJsLCBwYXJhbSkgPT4ge1xyXG4gICAgY29uc3Qgc3RyUmVnZXggPSBgJHtwYXJhbX1bXiZdKmBcclxuICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChzdHJSZWdleCwgJ2cnKVxyXG4gICAgcmV0dXJuIHVybC5yZXBsYWNlKHJlZ2V4LCAnJylcclxufVxyXG5cclxuY29uc3QgaW5pdENhdGFsb2dGaWx0ZXJSZXNldCA9ICgpID0+IHtcclxuICAgIGNvbnN0IHJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtY2F0YWxvZyAuZmlsdGVyc19fcmVzZXQgLmZpbHRlcnNfX2l0ZW0nKVxyXG4gICAgaWYgKCFyZXNldCkgcmV0dXJuXHJcblxyXG4gICAgcmVzZXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICBjb25zdCBkZWxldGVkUGFyYW1zID0gSlNPTi5wYXJzZSh0aGlzLmRhdGFzZXQuZGVsZXRlZFBhcmFtcylcclxuICAgICAgICBsZXQgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWZcclxuXHJcbiAgICAgICAgLy8g0J/RgNC+0LLQtdGA0Y/QtdC8LCDQtdGB0YLRjCDQu9C4IEdFVCDQv9Cw0YDQsNC80LXRgtGA0Ysg0LIgVVJMXHJcbiAgICAgICAgaWYgKHVybC5pbmRleE9mKCc/JykgPT09IC0xKSByZXR1cm5cclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBwYXJhbSBvZiBkZWxldGVkUGFyYW1zKSB7XHJcbiAgICAgICAgICAgIHVybCA9IHJlbW92ZUZpbHRlclBhcmFtRnJvbUNhdGFsb2dVcmwodXJsLCBwYXJhbSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCj0LTQsNC70Y/QtdC8INC70LjRiNC90LjQtSAmINC40LcgdXJsINC4ID8g0LTQu9GPIFVMUiDQsdC10Lcg0L/QsNGA0LDQvNC10YLRgNC+0LJcclxuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvJisvZywgJyYnKVxyXG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9cXD8mL2csICc/JylcclxuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvJiQvZywgJycpXHJcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL1xcPyQvLCAnJylcclxuICAgICAgICB1cmwgPSBkZWNvZGVVUklDb21wb25lbnQodXJsKVxyXG5cclxuICAgICAgICAvLyDQntCx0L3QvtCy0LvRj9C10LwgVVJMINGB0YLRgNCw0L3QuNGG0Ysg0LHQtdC3IEdFVCDQv9Cw0YDQsNC80LXRgtGA0L7QslxyXG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgdXJsKVxyXG5cclxuICAgICAgICAvLyDQodCx0YDQsNGB0YvQstCw0LXQvCDQstGB0LUg0LLRi9Cx0YDQsNC90L3Ri9C1INGE0LjQu9GM0YLRgNGLXHJcbiAgICAgICAgcmVzZXRBbGxQcm9kdWN0c0ZpbHRlcnModGhpcylcclxuXHJcbiAgICAgICAgLy8g0KHRgtCw0YDRgtGD0LXQvCDQv9GA0L7RhtC10YHRgSDQvtCx0YDQsdC+0YLQutC4INC00LDQvdC90YvRhVxyXG4gICAgICAgIHByb2Nlc3NQcm9kRGF0YSh1cmwpXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBpbml0Q2F0YWxvZ0ZpbHRlckNvbnRyb2xsZXJzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdlLWNhdGFsb2cgLmZpbHRlcnMgaW5wdXRbdHlwZT1cInJhZGlvXCJdJykpXHJcblxyXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNsb3Nlc3QoJy5maWx0ZXJzX19vcHRpb25zJylcclxuXHJcbiAgICAgICAgdGhpcy52YWx1ZSAhPT0gJ3Jlc2V0J1xyXG4gICAgICAgICAgICA/IGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjaGVja2VkJylcclxuICAgICAgICAgICAgOiBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnY2hlY2tlZCcpXHJcblxyXG4gICAgICAgIHNldFByb2RVcmxQYXJhbSh0aGlzLm5hbWUsIHRoaXMudmFsdWUsIHRoaXMuZGF0YXNldC50eXBlKVxyXG4gICAgICAgIGNoZWNrUHJvZHVjdFJlc2V0QWxsQnV0dG9uKClcclxuICAgIH0pKVxyXG59XHJcblxyXG5jb25zdCBnZXRDdXJyZW50UGFnZU51bWJlckZyb21VcmwgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxyXG4gICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh1cmwuc3BsaXQoJz8nKVsxXSk7XHJcbiAgICByZXR1cm4gcGFyYW1zLmdldCgnc2VsZWN0W3BhZ2VdJyk7XHJcbn1cclxuXHJcbmNvbnN0IGluaXRDYXRhbG9nUGFnaW5hdGlvbkNvbnRyb2xsZXJzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgY291bnRzT2ZQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2UtY2F0YWxvZyAucGFnaW5hdGlvbiAucGFnaW5hdGlvbl9fYnRuX3BhZ2UnKS5sZW5ndGhcclxuICAgIGNvbnN0IHBhZ2luYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1jYXRhbG9nIC5wYWdpbmF0aW9uJylcclxuICAgIGNvbnN0IGNvbnRyb2xsZXJzID0gQXJyYXkuZnJvbShwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYWdlLWNhdGFsb2cgLnBhZ2luYXRpb24gYnV0dG9uJykpXHJcbiAgICBjb25zdCBmaXJzdCA9IHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignW2RhdGEtcGFnZT1cImZpcnN0XCJdJylcclxuICAgIGNvbnN0IGxhc3QgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXBhZ2U9XCJsYXN0XCJdJylcclxuICAgIGNvbnN0IHByZXYgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXBhZ2U9XCJwcmV2XCJdJylcclxuICAgIGNvbnN0IG5leHQgPSBwYWdpbmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXBhZ2U9XCJuZXh0XCJdJylcclxuXHJcbiAgICBjb25zdCByZXNldEFsbFBhZ2luYXRpb25CdG5zID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnRyb2xsZXJzLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnLCAnYWN0aXZlJykpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0aWV2Rmlyc3QgPSAoKSA9PiB7XHJcbiAgICAgICAgZmlyc3QuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKVxyXG4gICAgICAgIHByZXYuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKVxyXG4gICAgICAgIHBhZ2luYXRpb24ucXVlcnlTZWxlY3RvcignW2RhdGEtcGFnZT1cIjFcIl0nKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFjdGl2ZUxhc3QgPSAoKSA9PiB7XHJcbiAgICAgICAgbGFzdC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpXHJcbiAgICAgICAgbmV4dC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpXHJcbiAgICAgICAgcGFnaW5hdGlvbi5xdWVyeVNlbGVjdG9yKGBbZGF0YS1wYWdlPVwiJHtjb3VudHNPZlBhZ2V9XCJdYCkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhY3RpdmVQYWdlID0gKHBhZ2UpID0+IHtcclxuICAgICAgICBpZiAocGFyc2VJbnQocGFnZSkgPT09IDEpIHtcclxuICAgICAgICAgICAgYWN0aWV2Rmlyc3QoKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwYXJzZUludChwYWdlKSA9PT0gY291bnRzT2ZQYWdlKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZUxhc3QoKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBhZ2luYXRpb25cclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXBhZ2U9XCIke3BhZ2V9XCJdYClcclxuICAgICAgICAgICAgLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICB9XHJcblxyXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgY29uc3QgY3VycmVudFBhZ2UgPSBnZXRDdXJyZW50UGFnZU51bWJlckZyb21VcmwoKVxyXG5cclxuICAgICAgICBsZXQgcGFnZSA9IHRoaXMuZGF0YXNldC5wYWdlXHJcblxyXG4gICAgICAgIHJlc2V0QWxsUGFnaW5hdGlvbkJ0bnMoKVxyXG5cclxuICAgICAgICBzd2l0Y2ggKHBhZ2UpIHtcclxuICAgICAgICAgICAgY2FzZSAnZmlyc3QnOiB7XHJcbiAgICAgICAgICAgICAgICBwYWdlID0gMVxyXG4gICAgICAgICAgICAgICAgYWN0aWV2Rmlyc3QoKVxyXG4gICAgICAgICAgICB9IGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdsYXN0Jzoge1xyXG4gICAgICAgICAgICAgICAgcGFnZSA9IGNvdW50c09mUGFnZVxyXG4gICAgICAgICAgICAgICAgYWN0aXZlTGFzdCgpXHJcbiAgICAgICAgICAgIH0gYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3ByZXYnOiB7XHJcbiAgICAgICAgICAgICAgICBwYWdlID0gY3VycmVudFBhZ2UgLSAxXHJcbiAgICAgICAgICAgICAgICBhY3RpdmVQYWdlKHBhZ2UpXHJcbiAgICAgICAgICAgIH0gYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ25leHQnOiB7XHJcbiAgICAgICAgICAgICAgICBwYWdlID0gY3VycmVudFBhZ2UgPyBwYXJzZUludChjdXJyZW50UGFnZSkgKyAxIDogMlxyXG4gICAgICAgICAgICAgICAgYWN0aXZlUGFnZShwYWdlKVxyXG4gICAgICAgICAgICB9IGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmVQYWdlKHBhZ2UpXHJcbiAgICAgICAgICAgIH0gYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocGFnZSAhPT0gY3VycmVudFBhZ2UpIHNldFByb2RVcmxQYXJhbSgncGFnZScsIHBhZ2UsICdzZWxlY3QnKVxyXG4gICAgfSkpXHJcbn1cclxuXHJcbmNvbnN0IHBhcnNlUHJvZFVybCA9ICh1cmwpID0+IHtcclxuICAgIGNvbnN0IHBhcmFtcyA9IHt9XHJcbiAgICBjb25zdCBxdWVyeVN0cmluZyA9IHVybC5zcGxpdCgnPycpWzFdXHJcblxyXG4gICAgaWYgKHF1ZXJ5U3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1QYWlycyA9IHF1ZXJ5U3RyaW5nLnNwbGl0KCcmJylcclxuXHJcbiAgICAgICAgcGFyYW1QYWlycy5mb3JFYWNoKHBhaXIgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBbcGFyYW0sIHZhbF0gPSBwYWlyLnNwbGl0KCc9JylcclxuXHJcbiAgICAgICAgICAgIGlmICghcGFyYW0uaW5jbHVkZXMoJ1snKSkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBbdHlwZSwgZGlydHlQcm9wXSA9IHBhcmFtLnNwbGl0KCdbJylcclxuICAgICAgICAgICAgY29uc3QgcHJvcCA9IGRpcnR5UHJvcC5zbGljZSgwLCAtMSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBhcmFtc1t0eXBlXSkgcGFyYW1zW3R5cGVdID0ge31cclxuXHJcbiAgICAgICAgICAgIHBhcmFtc1t0eXBlXVtwcm9wXSA9IHZhbFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBhcmFtc1xyXG59XHJcblxyXG5jb25zdCB1cGRhdGVQcm9kUGFnaW5hdGlvbiA9ICh0b3RhbFByb2R1Y3RzLCBwYWdlTnVtYmVyLCB0b3RhbFBhZ2VzKSA9PiB7XHJcbiAgICBjb25zdCBwYWdpbmF0aW9uTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWNhdGFsb2cgLnBhZ2luYXRpb24nKVxyXG5cclxuICAgIC8vINCg0LDRgdGB0YfQuNGC0LLRi9C10Lwg0YHRgtGA0LDQvdC40YbRiyDQuCDQv9C+0LRl0YTQvtC70YLRgyDQv9C+0LrQsNC30YvQstCw0LXQvCDQv9C10YDQstGD0Y5cclxuICAgIHRvdGFsUGFnZXMgPSBNYXRoLmNlaWwodG90YWxQcm9kdWN0cyAvIHdpbmRvdy5fUFJPRFVDVFNfUEVSX1BBR0UpXHJcblxyXG4gICAgY29uc3QgaXNGaXJzdFBhZ2UgPSBwYWdlTnVtYmVyID09PSAxID8gJ2Rpc2FibGVkJyA6ICcnXHJcbiAgICBjb25zdCBpc0xhc3RQYWdlID0gcGFnZU51bWJlciA9PT0gdG90YWxQYWdlcyA/ICdkaXNhYmxlZCcgOiAnJ1xyXG4gICAgbGV0IHBhZ2luYXRpb25MYXlvdXQgPSAnJ1xyXG5cclxuICAgIHBhZ2luYXRpb25MYXlvdXQgKz0gYDxidXR0b24gY2xhc3M9XCJwYWdpbmF0aW9uX19leHRyZW11bSAke2lzRmlyc3RQYWdlfVwiIGhyZWY9XCJcIiBkYXRhLXBhZ2U9XCJmaXJzdFwiPtC/0LXRgNCy0LDRjzwvYnV0dG9uPmBcclxuICAgIHBhZ2luYXRpb25MYXlvdXQgKz0gYDxidXR0b24gY2xhc3M9XCJwYWdpbmF0aW9uX19idG4gcGFnaW5hdGlvbl9fYnRuX3ByZXYgJHtpc0ZpcnN0UGFnZX1cIiBocmVmPVwiXCIgZGF0YS1wYWdlPVwicHJldlwiPjxpPjwvaT48L2J1dHRvbj5gXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdG90YWxQYWdlczsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgaXNBY3RpdmVQYWdlID0gcGFnZU51bWJlciA9PT0gaSA/ICdhY3RpdmUnOiAnJ1xyXG4gICAgICAgIHBhZ2luYXRpb25MYXlvdXQgKz0gYDxidXR0b24gY2xhc3M9XCJwYWdpbmF0aW9uX19idG4gcGFnaW5hdGlvbl9fYnRuX3BhZ2UgJHtpc0FjdGl2ZVBhZ2V9XCIgaHJlZj1cIlwiIGRhdGEtcGFnZT1cIiR7aX1cIj4ke2l9PC9idXR0b24+YFxyXG4gICAgfVxyXG5cclxuICAgIHBhZ2luYXRpb25MYXlvdXQgKz0gYDxidXR0b24gY2xhc3M9XCJwYWdpbmF0aW9uX19idG4gcGFnaW5hdGlvbl9fYnRuX25leHQgJHtpc0xhc3RQYWdlfVwiIGhyZWY9XCJcIiBkYXRhLXBhZ2U9XCJuZXh0XCI+PGk+PC9pPjwvYnV0dG9uPmBcclxuICAgIHBhZ2luYXRpb25MYXlvdXQgKz0gYDxidXR0b24gY2xhc3M9XCJwYWdpbmF0aW9uX19leHRyZW11bSAke2lzTGFzdFBhZ2V9XCIgaHJlZj1cIlwiIGRhdGEtcGFnZT1cImxhc3RcIj7Qv9C+0YHQu9C10LTQvdGP0Y88L2J1dHRvbj5gXHJcblxyXG4gICAgLy8g0JHQu9C+0LrQuNGA0YPQtdC8INGC0LXQutGD0YnRg9GOINC/0LDQs9C40L3QsNGG0LjRjlxyXG4gICAgcGFnaW5hdGlvbk5vZGUuY2xhc3NMaXN0LmFkZCgnYmxvY2tlZCcpXHJcblxyXG4gICAgLy8g0JjRgdC60YPRgdGB0YLQstC10L3QvdC+INC00L7QsdCw0LLQu9GP0LXQvCDQt9Cw0LTQtdGA0LbQutGDINCyINC/0LXRgNC10YDQtdC90LTQtdGAINC/0LDQs9C40L3QsNGG0LjQuFxyXG4gICAgLy8g0JDQvdCw0LvQvtCz0LjRh9C90LDRjyDQt9Cw0LTQtdGA0LbQutCwINCyINGA0LXQvdC00LXRgNC40L3Qs9C1INC60L7QvdGC0LXQvdGC0LBcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIC8vINCV0YHQu9C4INC/0L7RgdC70LUg0YTQuNC70YLRgNCw0YbQuNC4INC4INGB0L7RgNGC0LjRgNC+0LLQutC4INC90LXRgiDQv9C+0LTRhdC+0LTRj9GJ0LjRhSDQv9GA0L7QtNGD0LrRgtC+0LIsINGB0LrRgNGL0LLQsNC10Lwg0L/QsNCz0LjQvdCw0YbQuNGOXHJcbiAgICAgICAgaWYgKHRvdGFsUHJvZHVjdHMgPT09IDApIHtcclxuICAgICAgICAgICAgcGFnaW5hdGlvbk5vZGUuY2xhc3NMaXN0LmFkZCgnaGlkZScpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBhZ2luYXRpb25Ob2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGFnaW5hdGlvbk5vZGUuaW5uZXJIVE1MID0gcGFnaW5hdGlvbkxheW91dFxyXG4gICAgICAgIGluaXRDYXRhbG9nUGFnaW5hdGlvbkNvbnRyb2xsZXJzKClcclxuICAgICAgICBwYWdpbmF0aW9uTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdibG9ja2VkJylcclxuICAgIH0sIFJFUkVOREVSX1BST0RfVElNRU9VVF9ERUxBWSlcclxufVxyXG5cclxuY29uc3QgZmlsdGVyUHJvZERhdGEgPSAoZmlsdGVyLCBpbml0aWxhRGF0YSkgPT4ge1xyXG4gICAgaWYgKCFmaWx0ZXIpIHJldHVybiBpbml0aWxhRGF0YSAvLyDQldGB0LvQuCDQvdC10YIg0YTQuNC70YzRgtGA0L7Qsiwg0L/RgNC+0YHRgtC+INC/0YDQvtCx0YDQsNGB0YvQstCw0LXQvCDQtNCw0L3QvdGL0LUg0LTQsNC70YzRiNC1XHJcblxyXG4gICAgbGV0IGRhdGEgPSBpbml0aWxhRGF0YVxyXG5cclxuICAgIGZvciAoY29uc3Qga2V5IGluIGZpbHRlcikge1xyXG4gICAgICAgIGxldCB2YWwgPSBmaWx0ZXJba2V5XVxyXG4gICAgICAgIGlmICh2YWwgPT09ICfQndC1INGD0LrQsNC30LDQvSdcclxuICAgICAgICAgICAgICAgIHx8IHZhbCA9PT0gJ9Cd0LUg0YPQutCw0LfQsNC90L4nXHJcbiAgICAgICAgICAgICAgICB8fCB2YWwgPT09ICfQndC1INGD0LrQsNC30LDQvdCwJ1xyXG4gICAgICAgICAgICAgICAgfHwgdmFsID09PSAn0JHQtdC3INC60LDRgtC10LPQvtGA0LjQuCcpIHtcclxuICAgICAgICAgICAgdmFsID0gJydcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihwcm9kID0+IHtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvZFtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gJycpIHJldHVybiBwcm9kW2tleV0ubGVuZ3RoID09PSAwXHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2Rba2V5XS5pbmNsdWRlcyh2YWwpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb2Rba2V5XSA9PT0gdmFsXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygnYWZ0ZXIgRklMVEVSJywgZGF0YSk7XHJcbiAgICBjb25zb2xlLmxvZygnRklMVEVSIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGFcclxufVxyXG5cclxuY29uc3Qgc29ydFByb2REYXRhID0gKHNvcnQsIGZpbHRlcmVkRGF0YSkgPT4ge1xyXG4gICAgaWYgKCFzb3J0KSByZXR1cm4gZmlsdGVyZWREYXRhIC8vINCV0YHQu9C4INC90LXRgiDRgdC+0YDRgtC40YDQvtCy0LrQuCwg0L/RgNC+0YHRgtC+INC/0YDQvtCx0YDQsNGB0YvQstCw0LXQvCDQtNCw0L3QvdGL0LUg0LTQsNC70YzRiNC1XHJcblxyXG4gICAgbGV0IGRhdGEgPSBmaWx0ZXJlZERhdGFcclxuXHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzb3J0KSB7XHJcbiAgICAgICAgbGV0IHZhbCA9IHNvcnRba2V5XVxyXG4gICAgICAgIGRhdGEgPSBkYXRhLnNvcnQoIGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgaWYgKHZhbCA9PT0gJ9Cf0L4g0LLQvtC30YDQsNGB0YLQsNC90LjRjicpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhW2tleV0gLSBiW2tleV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYltrZXldIC0gYVtrZXldXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygnYWZ0ZXIgU09SVCcsIGRhdGEpO1xyXG4gICAgY29uc29sZS5sb2coJ1NPUlQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbn1cclxuXHJcbmNvbnN0IGdldFBhZ2VGcm9tUHJvZERhdGEgPSAoc2VsZWN0LCBmaWx0ZXJlZEFuZFNvcnRlZERhdGEpID0+IHtcclxuICAgIGxldCBkYXRhID0gZmlsdGVyZWRBbmRTb3J0ZWREYXRhXHJcblxyXG4gICAgLy8g0JXRgdC70Lgg0L3QtdGCINC/0LDRgNCw0LzQtdGC0YDQsCBzZWxlY3Qg0YHQviDRgdGC0YDQsNC90LjRhtC10LksINC70LjQsdC+INGB0YLRgNCw0L3QuNGG0LAg0L3QtSDRg9C60LDQt9Cw0L3QsCwg0YLQviDQstGL0LHQuNGA0LDQtdC8INC/0LXRgNCy0YPRjiDRgdGC0YDQsNC90LjRhtGDXHJcbiAgICBsZXQgcGFnZU51bWJlciA9ICFzZWxlY3RcclxuICAgICAgICA/IDFcclxuICAgICAgICA6ICFzZWxlY3QucGFnZSB8fCBzZWxlY3QucGFnZSA9PT0gJydcclxuICAgICAgICAgICAgPyAxXHJcbiAgICAgICAgICAgIDogcGFyc2VJbnQoc2VsZWN0LnBhZ2UpXHJcblxyXG4gICAgLy8g0JLRi9GH0LjRgdC70Y/QtdC8INC+0LHRidC10LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHRgtGA0LDQvdC40YZcclxuICAgIGNvbnN0IHRvdGFsUGFnZXMgPSBNYXRoLmNlaWwoZGF0YS5sZW5ndGggLyB3aW5kb3cuX1BST0RVQ1RTX1BFUl9QQUdFKVxyXG5cclxuICAgIC8vINCV0YHQu9C4INC90L7QvNC10YAg0YHRgtGA0LDQvdC40YbRiyDQvtGC0YDQuNGG0LDRgtC10LvRjNC90YvQuSwg0LLQvtC30LLRgNCw0YnQsNC10Lwg0L/QtdGA0LLRg9GOINGB0YLRgNCw0L3QuNGG0YNcclxuICAgIGlmIChwYWdlTnVtYmVyIDwgMSkge1xyXG4gICAgICAgIHBhZ2VOdW1iZXIgPSAxXHJcbiAgICB9XHJcblxyXG4gICAgLy8g0JXRgdC70Lgg0L3QvtC80LXRgCDRgdGC0YDQsNC90LjRhtGLINCx0L7Qu9GM0YjQtSDQvNCw0LrRgdC40LzQsNC70YzQvdC+0LksINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INC/0L7RgdC70LXQtNC90Y7RjiDRgdGC0YDQsNC90LjRhtGDXHJcbiAgICBpZiAocGFnZU51bWJlciA+IHRvdGFsUGFnZXMpIHtcclxuICAgICAgICBwYWdlTnVtYmVyID0gdG90YWxQYWdlc1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCS0YvRh9C40YHQu9GP0LXQvCDQuNC90LTQtdC60YHRiyDQvdCw0YfQsNC70LAg0Lgg0LrQvtC90YbQsCDQtNC70Y8g0YLQtdC60YPRidC10Lkg0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IChwYWdlTnVtYmVyIC0gMSkgKiB3aW5kb3cuX1BST0RVQ1RTX1BFUl9QQUdFXHJcbiAgICBjb25zdCBlbmRJbmRleCA9IHN0YXJ0SW5kZXggKyB3aW5kb3cuX1BST0RVQ1RTX1BFUl9QQUdFXHJcbiAgICBkYXRhID0gZGF0YS5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleClcclxuXHJcbiAgICBjb25zb2xlLmxvZygnYWZ0ZXIgZ2V0IFBBR0UnLCBkYXRhKTtcclxuICAgIGNvbnNvbGUubG9nKCdHRVQgUEFHRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG5cclxuICAgIC8vINCe0LHQvdC+0LLQu9GP0LXQvCDQv9Cw0LPQuNC90LDRhtC40Y4g0L/QvtGB0LvQtSDRgtC+0LPQviDQutCw0Log0L/QvtC70YPRh9C40LvQuCDQv9C+0LTQvNCw0YHQuNCyINGC0L7QstCw0YDQvtCyINC90YPQttC90L7QuSDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICB1cGRhdGVQcm9kUGFnaW5hdGlvbihmaWx0ZXJlZEFuZFNvcnRlZERhdGEubGVuZ3RoLCBwYWdlTnVtYmVyLCB0b3RhbFBhZ2VzKVxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbn1cclxuXHJcbmNvbnN0IHNvcnRQcm9kQnlDYXRlZ29yeSA9IChmaWx0ZXJlZFNvcnRlZFBhZ2VkRGF0YSkgPT4ge1xyXG4gICAgY29uc3QgY2F0ZWdvcnlzID0ge31cclxuXHJcbiAgICBmb3IgKGNvbnN0IHByb2Qgb2YgZmlsdGVyZWRTb3J0ZWRQYWdlZERhdGEpIHtcclxuICAgICAgICBsZXQgY3VycmVudENhdGVnb3J5ID0gcHJvZC5jYXRlZ29yeVswXVxyXG4gICAgICAgIGlmICghY3VycmVudENhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDYXRlZ29yeSA9ICfQkdC10Lcg0LrQsNGC0LXQs9C+0YDQuNC4J1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0JXRgdC70Lgg0YLQtdC60YPRidC10Lkg0LrQsNGC0LXQs9C+0YDQuNC4INC90LXRgiDQsiDQvtCx0YrQtdC60YLQtSBjYXRlZ29yeXMsINC00L7QsdCw0LLQu9GP0LXQvFxyXG4gICAgICAgIGNvbnN0IGlzQ2F0ZWdvcnkgPSBjdXJyZW50Q2F0ZWdvcnkgaW4gY2F0ZWdvcnlzXHJcbiAgICAgICAgaWYgKCFpc0NhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgIGNhdGVnb3J5c1tjdXJyZW50Q2F0ZWdvcnldID0gW11cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCf0YPRiNC40Lwg0YLQvtCy0LDRgCDQsiDRgdC+0L7RgtCy0LXRgtGB0YLQstGD0Y7RidGD0Y4g0LrQsNGC0LXQs9C+0YDQuNGOXHJcbiAgICAgICAgY2F0ZWdvcnlzW2N1cnJlbnRDYXRlZ29yeV0ucHVzaChwcm9kKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdhZnRlciByZXBsYWNlZCBCeSBDYXRlZ29yeScsIGNhdGVnb3J5cyk7XHJcbiAgICBjb25zb2xlLmxvZygnUmVwbGFjZWQgQnkgQ2F0ZWdvcnkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuXHJcbiAgICByZXR1cm4gY2F0ZWdvcnlzXHJcbn1cclxuXHJcbmNvbnN0IGJ1aWxkUHJvZHVjdExpc3RMYXlvdXQgPSAoY2F0ZWdvcnlzKSA9PiB7XHJcbiAgICBsZXQgcHJvZHVjdFNlY3Rpb25zSHRtbExheW91dCA9ICcnXHJcblxyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gY2F0ZWdvcnlzKSB7XHJcbiAgICAgICAgbGV0IHNlY3Rpb25IdG1sTGF5b3V0ID0gJydcclxuXHJcbiAgICAgICAgc2VjdGlvbkh0bWxMYXlvdXQgKz0gYFxyXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInNlY3Rpb24gc2VjdGlvbl9wcm9kdWN0LWxpc3RcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX2NvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgY29udGFpbmVyX2NhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbCBjb2wteGwtOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cImNvbnRhaW5lcl9jYXB0aW9uLXRleHRcIj4ke2tleX08L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX2xpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPmBcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgc2luZ2xlUHJvZHVjdCBvZiBjYXRlZ29yeXNba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgLy8g0JTQvtCx0LDQstC70Y/QtdC8INGC0LXQs9C4INC10YHQu9C4INC+0L3QuCDQtdGB0YLRjFxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFncyA9IHNpbmdsZVByb2R1Y3QudGFnc1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBiYWRnZUxheW91dCA9ICcnXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRhZ3MpICYmIE9iamVjdC5rZXlzKHRhZ3MpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFkZ2VMYXlvdXQgKz0gJzxkaXYgY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX2JhZGdlLWxpc3RcIj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWdzWyduZXcnXSkgYmFkZ2VMYXlvdXQgKz0gJzxzcGFuIGNsYXNzPVwicHJvZHVjdC1pdGVtX19iYWRnZS1pdGVtXCI+0J3QvtCy0LjQvdC60LA8L3NwYW4+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFnc1snSVAnXSkgYmFkZ2VMYXlvdXQgKz0gJzxzcGFuIGNsYXNzPVwicHJvZHVjdC1pdGVtX19iYWRnZS1pdGVtIHByb2R1Y3QtaXRlbV9fYmFkZ2UtaXRlbV93YXRlcnByb29mXCI+SVAgNDQ8aT48L2k+PC9zcGFuPidcclxuICAgICAgICAgICAgICAgICAgICBiYWRnZUxheW91dCArPSAnPC9kaXY+J1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHByaWNlID0gc2luZ2xlUHJvZHVjdC5wcmljZSA/IHNpbmdsZVByb2R1Y3QucHJpY2UgKyAnIOKCvScgOiAnJ1xyXG5cclxuICAgICAgICAgICAgICAgIHNlY3Rpb25IdG1sTGF5b3V0ICs9IGBcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1zbS02IGNvbC1tZC00IGNvbC14bC0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX2NhcmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwicHJvZHVjdC1pdGVtX19ib2R5XCIgaHJlZj1cIiNcIiB0aXRsZT1cIiR7c2luZ2xlUHJvZHVjdC50aXRsZX1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2JhZGdlTGF5b3V0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX3BpY1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7c2luZ2xlUHJvZHVjdC5pbWFnZX1cIiBhbHQ9XCJcIiBsb2FkaW5nPVwibGF6eVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicHJvZHVjdC1pdGVtX19mYXZvcml0ZXNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXByb2R1Y3QtaWQ9XCIke3NpbmdsZVByb2R1Y3QuYXJ0aWNsZX1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10aXRsZT1cIiR7c2luZ2xlUHJvZHVjdC50aXRsZX1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1tZXNzYWdlPVwi0JTQvtCx0LDQstC70LXQvSDQsiDQuNC30LHRgNCw0L3QvdC+0LVcIj48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZHVjdC1pdGVtX19jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX2Rlc2NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJvZHVjdC1pdGVtX19jb2RlXCI+JHtzaW5nbGVQcm9kdWN0LmFydGljbGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX25hbWVcIj4ke3NpbmdsZVByb2R1Y3QudGl0bGV9PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByb2R1Y3QtaXRlbV9fYnV5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInByb2R1Y3QtaXRlbV9fcHJpY2VcIj4ke3ByaWNlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJwcm9kdWN0LWl0ZW1fX2NhcnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtcHJvZHVjdC1pZD1cIiR7c2luZ2xlUHJvZHVjdC5hcnRpY2xlfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10aXRsZT1cIiR7c2luZ2xlUHJvZHVjdC50aXRsZX1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtbWVzc2FnZT1cItCU0L7QsdCw0LLQu9C10L0g0LIg0LrQvtGA0LfQuNC90YNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlY3Rpb25IdG1sTGF5b3V0ICs9IGBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L3NlY3Rpb24+YFxyXG5cclxuICAgICAgICBwcm9kdWN0U2VjdGlvbnNIdG1sTGF5b3V0ICs9IHNlY3Rpb25IdG1sTGF5b3V0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJvZHVjdFNlY3Rpb25zSHRtbExheW91dFxyXG59XHJcblxyXG5jb25zdCBidWlsZE5vUHJvZHVjdExpc3RNc2dMYXlvdXQgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gYFxyXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzPVwic2VjdGlvbiBzZWN0aW9uX3Byb2R1Y3QtbGlzdFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGVzY3JpcHRpb25fX21zZyBkaXNwbGF5IHZpc2libGVcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj7QmiDRgdC+0LbQsNC70LXQvdC40Y4sINC/0L4g0JLQsNGI0LXQvNGDINC30LDQv9GA0L7RgdGDINC90LjRh9C10LPQviDQvdC1INC90LDQudC00LXQvdC+LiDQotC+0LLQsNGA0LAg0YEg0LTQsNC90L3Ri9C80Lgg0L/QsNGA0LDQvNC10YLRgNCw0LzQuCDQvdC10YIuPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvc2VjdGlvbj5cclxuICAgIGBcclxufVxyXG5cclxuY29uc3QgdXBkYXRlUHJvZHVjdExpc3RPblBhZ2UgPSAoY2F0ZWdvcnlzKSA9PiB7XHJcbiAgICB3aW5kb3cuc3Bpbm5lci5zaG93KClcclxuXHJcbiAgICAvLyDQodC+0LHQuNGA0LDQtdC8INC60L7QvdGC0LXQvdGCINGB0YLRgNCw0L3QuNGG0Ysg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINGC0L7Qs9C+INC10YHRgtGMINC70Lgg0LIg0LLRi9Cx0L7RgNC60LUg0YLQvtCy0LDRgNGLXHJcbiAgICBjb25zdCBwcm9kdWN0U2VjdGlvbnNIdG1sTGF5b3V0ID0gT2JqZWN0LmtleXMoY2F0ZWdvcnlzKS5sZW5ndGggPT09IDBcclxuICAgICAgICA/IGJ1aWxkTm9Qcm9kdWN0TGlzdE1zZ0xheW91dCgpXHJcbiAgICAgICAgOiBidWlsZFByb2R1Y3RMaXN0TGF5b3V0KGNhdGVnb3J5cylcclxuXHJcbiAgICBjb25zdCByZW1vdGVOb2RlcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLnBhZ2UtY2F0YWxvZyAuc2VjdGlvbl9wcm9kdWN0LWxpc3QnKSlcclxuICAgIC8vINCR0LvQvtC60LjRgNGD0LXQvCDRgtC10LrRg9GJ0LjQtSDQv9GA0L7QtNGD0LrRgtGLXHJcbiAgICByZW1vdGVOb2Rlcy5mb3JFYWNoKG5vZGUgPT4gbm9kZS5jbGFzc0xpc3QuYWRkKCdibG9ja2VkJykpXHJcblxyXG4gICAgLy8g0JjRgdC60YPRgdGB0YLQstC10L3QvdC+INC00L7QsdCw0LLQu9GP0LXQvCDQt9Cw0LTQtdGA0LbQutGDINCyINC/0LXRgNC10YDQtdC90LTQtdGAINC60L7QvdGC0LXQvdGC0LBcclxuICAgIC8vINCQ0L3QsNC70L7Qs9C40YfQvdCw0Y8g0LfQsNC00LXRgNC20LrQsCDQsiDRgNC10L3QtNC10YDQuNC90LPQtSDQv9Cw0LPQuNC90LDRhtC40LhcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIC8vINCj0LTQsNC70Y/QtdC8INGC0LXQutGD0YnQuNC1INC/0YDQvtC00YPQutGC0Ysg0YHQviDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgICAgcmVtb3RlTm9kZXMuZm9yRWFjaChub2RlID0+IG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKSlcclxuXHJcbiAgICAgICAgY29uc3QgcmVmZXJlbmNlTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWNhdGFsb2cgLnNlY3Rpb25fZmlsdGVyJylcclxuXHJcbiAgICAgICAgLy8g0JLRgdGC0LDQstC70Y/QtdC8IEhUTUwg0LrQvtC0INC/0L7RgdC70LUgcmVmZXJlbmNlTm9kZVxyXG4gICAgICAgIHJlZmVyZW5jZU5vZGUuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmVuZCcsIHByb2R1Y3RTZWN0aW9uc0h0bWxMYXlvdXQpXHJcblxyXG4gICAgICAgIC8vINCh0LrRgNC+0LvQuNC8INCyINC90LDRh9Cw0LvQviDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgICAgc21vb3RoU2Nyb2xsVG8oMCwgMTAwMClcclxuXHJcbiAgICAgICAgLy8g0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutC90L7Qv9C60Lgg0LTQvtCx0LDQstC70LXQvdC40Y8g0LIg0LjQt9Cx0YDQsNC90L3Ri9C1INC4INCyINC60L7RgNC30LjQvdGDXHJcbiAgICAgICAgaW5pdEFkZFRvRmF2b3JpdGVzKClcclxuICAgICAgICBpbml0QWRkVG9DYXJ0KClcclxuXHJcbiAgICAgICAgLy8g0KHQutGA0YvQstCw0LXQvCDRgdC/0LjQvdC90LXRgFxyXG4gICAgICAgIHdpbmRvdy5zcGlubmVyLmhpZGUoKVxyXG5cclxuICAgICAgICAvLyDQn9C+0LrQsNC30YvQstCw0LXQvCDQsNC90LjQvNC40YDRg9C10LzRi9C1INGB0LXQutGG0LjQuCDQtdGB0LvQuCDQvdGD0LbQvdC+XHJcbiAgICAgICAgc2hvd0FuaW1FbGVtZW50cygpXHJcbiAgICB9LCBSRVJFTkRFUl9QUk9EX1RJTUVPVVRfREVMQVkpXHJcbn1cclxuXHJcbmNvbnN0IHByb2Nlc3NQcm9kRGF0YSA9ICh1cmwpID0+IHtcclxuXHJcbiAgICAvLyDQn9C+0LvRg9GH0LDQtdC8INC/0LDRgNCw0LzQtdGC0YDRiyDRgdC+0YDRgtC40YDQvtCy0LrQuCDQuCDRhNC40LvRjNGC0YDQsNGG0LjQuCDQuNC3IHVybFxyXG4gICAgY29uc3QgbWFuaXB1bGF0aW9uRGF0YU9iaiA9IHBhcnNlUHJvZFVybCh1cmwpXHJcblxyXG4gICAgY29uc29sZS5sb2coJ21hbmlwdWxhdGlvbkRhdGFPYmonLCBtYW5pcHVsYXRpb25EYXRhT2JqKTtcclxuXHJcbiAgICAvLyBTdGVwIDUuINCe0LHQvdC+0LLQu9GP0LXQvCDRgdC/0LjRgdC+0Log0YLQvtCy0LDRgNC+0LIg0L3QsCDRgdGC0YDQvdC40YbQtVxyXG4gICAgdXBkYXRlUHJvZHVjdExpc3RPblBhZ2UoXHJcblxyXG4gICAgICAgIC8vIFN0ZXAgNC4g0KHQvtGA0YLQuNGA0YPQtdC8INGC0L7QstCw0YDRiyDQv9C+INC60LDRgtC10LPQvtGA0LjRj9C80LguIC0tLSDQktC+0LfQstGA0LDRidCw0LXRgjog0L7QsdGK0LXQutGCINGBINC60LDRgtC10LPQvtGA0LjRj9C80LgsINCz0LTQtSDQsiDQt9Cw0L3Rh9C10L3QuNC4INC60LDQttC00L7QuSDQutCw0YLQtdCz0L7RgNC40Lgg0LvQtdC20LjRgiDQvNCw0YHRgdC40LIg0YEg0YLQvtCy0LDRgNCw0LzQuCDRjdGC0L7QuSDQutCw0YLQtdCz0L7RgNC40LhcclxuICAgICAgICBzb3J0UHJvZEJ5Q2F0ZWdvcnkoXHJcblxyXG4gICAgICAgICAgICAvLyBTdGVwIDMuINCS0YvQsdC40YDQsNC10Lwg0L/QvtC00LzQsNGB0YHQuNCyINC90YPQttC90YPRjiDRgdGC0YDQsNC90LjRhtGDLiAtLS0g0JLQvtC30LLRgNCw0YnQsNC10YI6INC/0L7QtNC80LDRgdGB0LjQsiDRgSDQv9GA0L7QtNGD0LrRgtCw0LzQuNC4INGB0L7QvtGC0LLQtdGC0YHRgtGA0YPRjtGJ0LXQuSDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICAgICAgICAgIC8vINCf0L7RgdC70LUg0L/QvtC70YPRh9C10L3QuNGPINGB0YLRgNCw0L3QuNGG0YsgKNCy0L3Rg9GC0YDQuCDQvNC10YLQvtC00LApINC+0LHQvdC+0LLQu9GP0LXQvCDQv9Cw0LPQuNC90LDRhtC40Y4hXHJcbiAgICAgICAgICAgIGdldFBhZ2VGcm9tUHJvZERhdGEoXHJcbiAgICAgICAgICAgICAgICBtYW5pcHVsYXRpb25EYXRhT2JqLnNlbGVjdCxcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdGVwIDIuINCh0L7RgNGC0LjRgNGD0LXQvCDQtNCw0L3QvdGL0LUgLS0tINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCOiDQvtGC0YHQvtGA0YLQuNGA0L7QstCw0L3QvdGL0Lkg0LzQsNGB0YHQuNCyINGBINC/0YDQvtC00YPQutGC0LDQvNC4XHJcbiAgICAgICAgICAgICAgICBzb3J0UHJvZERhdGEoXHJcbiAgICAgICAgICAgICAgICAgICAgbWFuaXB1bGF0aW9uRGF0YU9iai5zb3J0LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBTdGVwIDEuINCk0LjQu9GM0YLRgNGD0LXQvCDQtNCw0L3QvdGL0LUgLS0tINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCOiDQvtGC0YTQuNC70YzRgtGA0L7QstCw0L3QvdGL0Lkg0LzQsNGB0YHQuNCyINGBINC/0YDQvtC00YPQutGC0LDQvNC4XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyUHJvZERhdGEoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hbmlwdWxhdGlvbkRhdGFPYmouZmlsdGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuX0NBVEFMT0dcclxuICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApXHJcbiAgICApXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgaXNQYWdlQ2F0YWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWNhdGFsb2cnKVxyXG4gICAgaWYgKCFpc1BhZ2VDYXRhbG9nKSByZXR1cm5cclxuXHJcbiAgICBpbml0Q2F0YWxvZ0ZpbHRlckNvbnRyb2xsZXJzKClcclxuICAgIGluaXRDYXRhbG9nRmlsdGVyUmVzZXQoKVxyXG4gICAgaW5pdENhdGFsb2dQYWdpbmF0aW9uQ29udHJvbGxlcnMoKVxyXG4gICAgaW5pdERlZmF1bHRQcm9kQ2F0YWxvZygpXHJcbiAgICByZXF1ZXN0UHJvZHVjdERhdGEoKVxyXG59KVxyXG4iXSwiZmlsZSI6ImNhdGFsb2cuanMifQ==
