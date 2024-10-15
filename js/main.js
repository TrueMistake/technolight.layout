'use strict';

/**
 * Clear phone of spaces, brackets,
 * dashes and plus sign. Leave only numbers.
 *
 * @param {string} phone - The phone, that needs to clear.
 * @returns {number} - Phone number as a number type.
 */
window.clearPhone = (phone) => {
    return parseInt(phone.replace(/\D/g, ""))
}

window.debounce = (func, ms) => {
    let timeoutId

    return function() {
        const context = this
        const args = arguments

        clearTimeout(timeoutId)

        timeoutId = setTimeout(() => {
            func.apply(context, args)
        }, ms)
    }
}

/**
 * Downloads a file from the specified URL and triggers a download in the browser.
 * 
 * @param {string} url - The URL of the file to be downloaded.
 */
window.downloadFile = (url, filename=null, defaultExtension = 'bin')  => {
    if (url === undefined || url === null || url === "") {
        return;
    }
    // Показать спиннер
    if (window.spinner && typeof window.spinner.show === "function") {
        window.spinner.show();
    }

    // Создаем новый XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";

    // Обработчик завершения загрузки
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Попытка получить расширение из заголовков
            let extension = defaultExtension;
            const contentDisposition = xhr.getResponseHeader("Content-Disposition");
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?((.*)\.(.*))"?/);
                if (match && match[1]) {
                    if (!filename) {
                        filename = match[2];
                    }
                    extension = match[3];
                }
            }

            // Создаем URL для загруженного файла
            const blobUrl = URL.createObjectURL(xhr.response);

            // Создаем временный элемент <a> для скачивания файла
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = `${filename}.${extension}`; // Устанавливаем имя файла с расширением

            // Добавляем элемент в DOM и инициируем скачивание
            document.body.appendChild(a);
            a.click();

            // Удаляем элемент из DOM
            document.body.removeChild(a);

            // Освобождаем URL объекта
            URL.revokeObjectURL(blobUrl);
        }

        // Скрыть спиннер
        if (window.spinner && typeof window.spinner.hide === "function") {
            window.spinner.hide();
        }
    };

    // Обработчик ошибок
    xhr.onerror = function() {
        console.error("Ошибка при загрузке файла");

        // Скрыть спиннер в случае ошибки
        if (window.spinner && typeof window.spinner.hide === "function") {
            window.spinner.hide();
        }
    };

    // Отправляем запрос
    xhr.send();
}
window.customEvent = {
  on: (eventName, eventCallback) => {
    window.document.addEventListener(eventName, eventCallback);
  },
  off: (eventName, eventCallback) => {
    window.document.removeEventListener(eventName, eventCallback);
  },
  once: (eventName, eventCallback) => {
    const handler = (event) => {
      eventCallback(event);
      this.off(eventName, handler);
    };
    this.on(eventName, handler);
  },
  emit: (eventName, eventData) => {
    const event = new CustomEvent(eventName, {
      detail: eventData,
      bubbles: false,
      cancelable: false
    });
    window.document.dispatchEvent(event);
    return event;
  }
};

/**
 * Formatting number to the local value
 *
 * @param {string | number} number - Value for formatting.
 */

window.formatNumber = (number) => {
    const value = parseInt(number.toString().replace(/\s/g, ""))
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Getting get parameter from the url
 *
 * @param {string} name - The name of the search parameter.
 * @param {string} [url] - The URL address. If this parameter is not passed, then the search, by default, will occur in the current URL.
 */
window.getUrlParameterByName = function(name, url) {
    if (!name) return

    if (!url) url = window.location.href

    name = name.replace(/[\[\]]/g, "\\$&")

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);

        if (!results) return null

    if (!results[2]) return ''

    return decodeURIComponent(results[2].replace(/\+/g, " "))
}

/**
 * безопасный вызов функции
 * @param fn function
 * @param {(*|*)[][]} args
 */
window.safeCall = function(fn, ...args) {
  try {
    fn.call(this || window, ...args);
  } catch (e) {
    console.warn("[Safe Call]: ", fn, e);
  }
};
/**
 * Smoothly scrolls the page to the specified position.
 *
 * @param {number} position - The position to scroll to.
 * @param {number} [duration=500] - The duration of the animation in milliseconds.
 */
function smoothScrollTo(position, duration = 500) {
    const startPosition = window.pageYOffset
    const distance = position - startPosition
    let startTimestamp = null

    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp

        const progress = timestamp - startTimestamp
        const scrollY = easeInOutCubic(progress, startPosition, distance, duration)

        window.scrollTo(0, scrollY)

        if (progress < duration) {
            window.requestAnimationFrame(step)
        }
    }

    function easeInOutCubic(t, b, c, d) {
        t /= d
        t--
        return c * (t * t * t + 1) + b
    }

    window.requestAnimationFrame(step)
}

window.throttle = (func, ms) => {
    let isThrottled = false,
        savedArgs,
        savedThis

    function wrapper() {

        if (isThrottled) { // 2
            savedArgs = arguments
            savedThis = this
            return
        }

        func.apply(this, arguments) // 1

        isThrottled = true

        setTimeout(function() {
            isThrottled = false // 3
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs)
                savedArgs = savedThis = null
            }
        }, ms)
    }

    return wrapper
}
/**
 * Email address verification
 *
 * @param {string} email - The email, that needs to validating.
 */
window.validateEmail = (email) => {
    // Regular expression for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Phone number verification
 *
 * @param {string} phone - The phone, that needs to validating.
 */
window.validatePhone = (phone) => {
    // Regular expression for phone
    const phoneRegex = /^7\d{10}$/
    return phoneRegex.test(phone)
}

const initToggleVisibleFormPass = () => {
    const btns = Array.from(document.querySelectorAll('.toggle-visible-pass'))

    if (btns.length === 0) return

    btns.forEach(el => el.addEventListener('click', function(e) {
        const input = this.parentElement.querySelector('input')
        const isText = input.type === 'text'

        input.type = isText ? 'password' : 'text'
        this.classList.toggle('pass-visible')
    }))
}

// const resetErrorOnAccountFormController = (inputNode) => {
//     const container = inputNode.closest('label')
//     container.classList.remove('has-error')
// }

// const setErrorOnAccountFormController = (inputNode, errorText) => {
//     const container = inputNode.closest('label')
//     const message = container.querySelector('.error-message')

//     container.classList.add('has-error')
//     message.innerText = errorText

//     inputNode.addEventListener('input', () => {
//         container.classList.remove('has-error')
//     })
// }

// const initAccountForm = () => {
//     const forms = Array.from(document.querySelectorAll('.account-form__form'))
//     if (forms.length === 0) return

//     forms.forEach(form => form.addEventListener('submit', function(e) {
//         e.preventDefault()

//         const formValid = {email: true, pass: true, }
//         const email = this.querySelector('[name="email"]')
//         const pass  = this.querySelector('[name="pass"]')
//         const formType = this.dataset.formType

//         resetErrorOnAccountFormController(email)
//         if (formType !== 'recovery') {
//             resetErrorOnAccountFormController(pass)
//         }

//         // Check email
//         if (email.value !== '') {
//             if (window.validateEmail(email.value)) {
//                 formValid.email = true
//             } else {
//                 setErrorOnAccountFormController(email, 'Некорректный адрес электронной почты!')
//                 formValid.email = false
//             }
//         } else {
//             setErrorOnAccountFormController(email, 'Необходимо указать адрес электронной почты!')
//             formValid.email = false
//         }

//         // Check pass
//         if (formType !== 'recovery') {
//             if (pass.value.length < 8) {
//                 setErrorOnAccountFormController(pass, 'Некорректный пароль. Длинна пароля должна быть не менее 8 символов!')
//                 formValid.pass = false
//             }
//         }

//         // Senging form data
//         if (formValid.email && formValid.pass) {
//             const formData = new FormData(form);

//             // Обязательно удалить после внедрения
//             for (let [name, value] of formData) {
//                 console.log(`${name}: ${value}`);
//             }

//             console.log('Fetching request for updating user data');
//         }
//     }))
// }

window.addEventListener('load', () => {
    // initAccountForm()
    initToggleVisibleFormPass()
})
// Add product to favorites
const addToFavoritesClickHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const _this = e.target
    const isSelected = _this.classList.contains('selected')
    const title = _this.dataset.title
    const message = _this.dataset.message
    const headerFavorites = document
        .querySelector('.header__buttons-link_favorites .header__buttons-count')
    const currentFavoritesCount = parseInt(headerFavorites.innerText)

    if (!isSelected) {
        _this.classList.add('selected')
        headerFavorites.innerText = currentFavoritesCount + 1
        headerFavorites.classList.add('selected')
        setTimeout(() => headerFavorites.classList.remove('selected'), 1000)

        showModalMsg(title, message)

        // console.error('Здесь надо будет написать асинхронный запрос добавления товара в избранные');
        return
    }

    _this.classList.remove('selected')
    headerFavorites.innerText = currentFavoritesCount - 1
    // console.error('Async query to DELETE selected product from Favorites');
}

const initAddToFavorites = () => {
    const btns = Array.from(document
        .querySelectorAll('.product-item__favorites'))

    btns.forEach(btn => btn.addEventListener('click', addToFavoritesClickHandler))
}

// Add product to cart
const addToCartClickHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const _this = e.target
    const isSelected = _this.classList.contains('selected')
    const title = _this.dataset.title
    const message = _this.dataset.message

    if (!isSelected) {
        _this.classList.add('selected')
        showModalMsg(title, message)

        // Push current product to Cart Global Object (window.CART)
        window.addProductToCart({ art: _this.dataset.productId, count: 1 })

        return
    }

    _this.classList.remove('selected')
    showModalMsg(title, 'Удален из корзины')

    // Remove current product from Cart Global Object (window.CART)
    window.removeProductFromCart({ art: _this.dataset.productId, count: 1 })
}
const initAddToCart = () => {
    const btns = Array.from(document
        .querySelectorAll('.product-item__cart'))

    btns.forEach(btn => btn.addEventListener('click', addToCartClickHandler))
}

window.addEventListener('load', () => {
    initAddToFavorites()
    initAddToCart()
})
// Filters
const showNoFilterMsg = () => {
  try {


    const msg = document.querySelector(".description__msg");

    if (!msg) return;
    msg.classList.add("display");
    setTimeout(() => msg.classList.add("visible"), 100);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const hideNoFilterMsg = () => {
  try {
    const msg = document.querySelector(".description__msg");

    if (!msg) return;

    msg.classList.remove("visible");
    msg.classList.remove("display");
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkNoFilterMsg = () => {
  try {
    const items = document
      .querySelectorAll("[data-filter]:not(.hide)");

    items.length === 0
      ? showNoFilterMsg()
      : hideNoFilterMsg();
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const hideFilterList = (filterList) => {
  try {
    filterList.forEach(filter => {
      filter.classList.remove("dropped");
      setTimeout(() => filter.classList.remove("active"), 300);
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const showFilterDrop = (node) => {
  try {
    node.classList.add("active");
    setTimeout(() => node.classList.add("dropped"), 10);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const hideFilterDrop = (node) => {
  try {
    const filters = Array.from(document.querySelectorAll(".filters__item"));

    if (!node) {
      hideFilterList(filters);
      return;
    }
    const cleanedFilters = filters.filter(filter => filter !== node);
    hideFilterList(cleanedFilters);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const initFiltersDrop = () => {
  try {
    const filters = Array.from(document
      .querySelectorAll(".filters__list .filters__item"));

    filters.forEach(filter => {
      filter.addEventListener("click", function() {
        const isActive = this.classList.contains("active");

        if (isActive) {
          hideFilterDrop();
          return;
        }

        hideFilterDrop(this);
        showFilterDrop(this);
      });
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const initFiltersReset = () => {
  try {
    const isPageCatalog = document.querySelector(".page-catalog");
    if (isPageCatalog) return;

    const reset = document.querySelector(".filters__reset .filters__item");

    if (!reset) return;

    const filteredSection = document
      .querySelectorAll(".section_filtered");

    reset.addEventListener("click", function() {
      const container = this.closest(".filters");

      const siblingFilters = container
        .querySelectorAll(".filters__list .filters__item");

      const options = Array.from(document
        .querySelectorAll(".filters__options"));

      const controllers = Array.from(document
        .querySelectorAll(".filters input[type=\"radio\"]:not([value=\"reset\"])"));

      const cards = Array.from(document.querySelectorAll("[data-filter]"));

      const deletedTypes = JSON.parse(document
        .querySelector("[data-deleted-types]")
        .dataset.deletedTypes);

      hideFilterList(siblingFilters);
      spinner.show();
      filteredSection.forEach(el => el.classList.add("filtering"));
      options.forEach(el => el.classList.remove("checked")); // hide rset option button
      controllers.forEach(controller => controller.checked = false); // reset all input controllers
      resetAllControllersInItems();
      reset.closest(".filters__reset").classList.add("disabled");

      setTimeout(() => {
        // show hidden cards as delete data-display attributes
        cards.forEach(card => {
          for (const type of deletedTypes) {
            card.removeAttribute(`data-display-${type}`);
            card.classList.remove("hide");
          }
        });

        checkFilteredSection();
      }, 1000);
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkFilteredSection = () => {
  try {
    const sections = Array.from(document.querySelectorAll(".section_filtered"));

    sections.forEach(section => {
      const filteredItems = Array.from(section.querySelectorAll("[data-filter]"));
      const shownItems = filteredItems.filter(i => !i.classList.contains("hide"));

      if (shownItems.length === 0) {
        section.classList.add("hide");
      } else {
        section.classList.remove("hide");
      }
    });

    spinner.hide();
    sections.forEach(el => el.classList.remove("filtering"));

    showAnimElements();
    setAnimationElms();
    checkNoFilterMsg();
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const hasDataDisplayAttribute = (node) => {
  try {
    const attributes = node.attributes;

    let hasDataDisplayAttribute = false;

    for (let i = 0; i < attributes.length; i++) {
      const attributeName = attributes[i].name;

      if (attributeName.startsWith("data-display")) {
        hasDataDisplayAttribute = true;
        break;
      }
    }

    return hasDataDisplayAttribute;
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkFilteredItem = (prop, val) => {
  try {
    const items = Array.from(document.querySelectorAll("[data-filter]"));

    setTimeout(() => {
      items.forEach(i => {
        const data = JSON.parse(i.dataset.filter);
        const isArray = Array.isArray(data[prop]);

        const isMatched = isArray
          ? data[prop].includes(val)
          : data[prop] === val;


        if (isMatched) {
          i.removeAttribute(`data-display-${prop}`);
          if (!hasDataDisplayAttribute(i)) i.classList.remove("hide");
        } else {
          i.classList.add("hide");
          i.setAttribute(`data-display-${prop}`, false);
        }

        checkFilteredSection();
      });
    }, 1000);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const activeColorInItem = (val) => {
  try {
    const items = Array.from(document
      .querySelectorAll(`[data-target-type="${val}"]`));

    items.forEach(i => i.click());
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const initFilterSelect = () => {
  try {
    const isPageCatalog = document.querySelector(".page-catalog");
    if (isPageCatalog) return;

    const controllers = Array.from(document
      .querySelectorAll(".filters input[type=\"radio\"]:not([value=\"reset\"])"));

    const filteredSection = document.querySelectorAll(".section_filtered");

    const resetBtn = document.querySelector(".filters__reset");

    controllers.forEach(el => el.addEventListener("change", function(e) {
      e.preventDefault();
      e.stopPropagation();

      filteredSection.forEach(el => el.classList.add("filtering"));
      spinner.show();
      checkFilteredItem(this.name, this.value);
      activeColorInItem(this.value);
      this.closest(".filters__options").classList.add("checked");
      resetBtn.classList.remove("disabled");
    }));
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const removeDataFilterAttribute = (prop) => {
  try {
    const items = Array.from(document
      .querySelectorAll(`[data-display-${prop}]`));

    items.forEach(i => {
      i.removeAttribute(`data-display-${prop}`);
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkAllItemsHasDisplayAttributes = () => {
  try {
    const items = Array.from(document
      .querySelectorAll("[data-filter]"));

    items.forEach(i => {
      if (!hasDataDisplayAttribute(i)) {
        i.classList.remove("hide");
      }
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const resetAllControllersByName = (name) => {
  try {
    const items = Array.from(document.querySelectorAll(`[name=${name}]`));
    items.forEach(i => i.checked = false);
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const resetAllControllersInItems = () => {
  try {
    const tabLists = Array.from(document
      .querySelectorAll(".cards-series__controls"));

    tabLists.forEach(list => {
      list.querySelector(".cards-series__tab")?.click();
    });
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const checkAllFilterResetBtn = () => {
  try {
    const isCheckedFilter = document
      .querySelectorAll(".filters__list input:checked");

    const reset = document.querySelector(".filters__reset");

    isCheckedFilter.length === 0
      ? reset.classList.add("disabled")
      : reset.classList.remove("disabled");
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

const initResetFilterProp = () => {
  try {
    const isPageCatalog = document.querySelector(".page-catalog");
    if (isPageCatalog) return;

    const controllers = Array.from(document
      .querySelectorAll(".filters input[value=\"reset\"]"));
    const sections = document.querySelectorAll(".section_filtered");

    controllers.forEach(el => el.addEventListener("change", function(e) {
      e.preventDefault();
      e.stopPropagation();

      sections.forEach(el => el.classList.add("filtering"));
      spinner.show();
      this.closest(".filters__options").classList.remove("checked");

      setTimeout(() => {
        removeDataFilterAttribute(this.name);
        checkAllItemsHasDisplayAttributes();
        checkFilteredSection();
        resetAllControllersByName(this.name);
        resetAllControllersInItems();
        checkAllFilterResetBtn();
      }, 1000);
    }));
  } catch (e) {
    console.warn("вёрстка", e);
  }
};

window.addEventListener("load", () => {
  try {
    initFiltersDrop();
    initFiltersReset();
    initFilterSelect();
    initResetFilterProp();
  } catch (e) {
    console.warn("вёрстка", e);
  }
});
class Informer {
    static _instances

    static getInstances() {
        if (!Informer._instances) {
            Informer._instances = new Informer()
        }
        return Informer._instances
    }

    constructor() {
        this.informer = document.getElementById("informer")
        if (!this.informer) {
            console.warn("На странице отсутствует html обертка для Информера")
            return false
        }
        this.informerBody = this.informer.querySelector(".informer__body")
        this.informerBack = this.informer.querySelector(".informer__back")
        this.informerClose = this.informer.querySelector(".informer__close")
        this.init()
    }
    init() {
        this.btns = Array.from(document.querySelectorAll("span[data-term]"))
        this.initEventListeners()
        return this
    }

    initEventListeners() {
        this.btns.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.stopPropagation()
                e.preventDefault()
                await this.getInformation(btn.dataset.term)
            })
        })

        this.informerBack.addEventListener("click", () => this.hideInformer())
        this.informerClose.addEventListener("click", () => this.hideInformer())
    }

    async getInformation(term) {
        window.spinner.show()

        const formData = new FormData()
        formData.append("term", term)

        const res = DEV_MODE ?
            await fetch("https://anaragaev.github.io/technolight.layout/mocks/inform.html") :
            await fetch("/api/term", {
                method: "POST",
                body: formData
            })

        if (res.ok) {
            const html = await res.text()
            this.updateInformerContent(html)
        } else {
            console.warn("Не удалось получить информацию для Термина", term)
            setTimeout(window.spinner.hide, 300)
        }
    }

    updateInformerContent(data) {
        const informerContent = this.informer.querySelector(".informer__content")

        while (informerContent.firstChild) {
            informerContent.removeChild(informerContent.firstChild)
        }

        informerContent.innerHTML = data
        this.showInformer()
        setTimeout(window.spinner.hide, 300)
    }

    showInformer() {
        this.informer.classList.add("visible")

        setTimeout(() => {
            this.informerBack.classList.add("visible")
            this.informerBody.classList.add("visible")
        }, 100)
    }

    hideInformer() {
        this.informerBack.classList.remove("visible")
        this.informerBody.classList.remove("visible")

        setTimeout(() => this.informer.classList.remove("visible"), 500)
    }
}
window.initInformers = () => Informer.getInstances().init()
window.addEventListener("load", () => window.informer = window.initInformers())
const initModal = () => {
    const btns = Array.from(document.querySelectorAll('[data-modal]'))

    if (btns.length === 0) return

    btns.forEach(el => el.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()

        const target = this.dataset.modalTarget
        const action = this.dataset.modalAction

        switch (action) {
            case 'show':
                showModalBack()
                showModalDialog(target)
                break;
            case 'toggle':
                toggleModalDialog(target)
                break;
            case 'close':
                hideModalDialog()
                setTimeout(hideModalBack, 200)
                break;
        }
    }))
}

const showModalBack = () => {
    const back = document.querySelector('.modal__back')
    const body = document.querySelector('#body')

    body.classList.add('modal-open')
    back.classList.remove('hide')

    setTimeout(() => back.classList.add('show'), 10)
}

const hideModalBack = () => {
    const back = document.querySelector('.modal__back')
    const body = document.querySelector('#body')
    const header = document.querySelector('#header')

    if (!back) return

    body.classList.remove('modal-open')
    back.classList.remove('show')
    header.style.transition = 'none'

    setTimeout(() => {
        back.classList.add('hide')
        header.removeAttribute('style');
    }, 100)
}

const showModalDialog = (id) => {
    const target = document.querySelector(id)
    const dialog = target.querySelector('.modal__dialog')

    target.classList.remove('hide')
    setTimeout(() => {
        target.classList.add('show')
        dialog.classList.add('show')
    }, 10)
}

const hideModalDialog = () => {
    const target = document.querySelector('.modal.show')
    if (!target) return

    const dialog = target.querySelector('.modal__dialog')

    target.classList.remove('show')
    dialog.classList.remove('show')
    setTimeout(() => target.classList.add('hide'), 100)
}

const initCloseModal = () => {
    document.addEventListener('click', (e) => {
        const isOnPopupModal = e.target.closest('.modal__dialog')

        if(isOnPopupModal) return

        hideModalDialog()
        setTimeout(hideModalBack, 200)
    })
}

const toggleModalDialog = (id) => {
    const target = document.querySelector(id)
    const dialog = target.querySelector('.modal__dialog')

    hideModalDialog()

    setTimeout(() => target.classList.remove('hide'), 200)
    setTimeout(() => {
        target.classList.add('show')
        dialog.classList.add('show')
    }, 300)
}

const initToggleVisiblePass = () => {
    const btns = Array.from(document.querySelectorAll('.modal__toggle-visible-pass'))

    if (btns.length === 0) return

    btns.forEach(el => el.addEventListener('click', function(e) {
        e.preventDefault()
        const input = this.parentElement.querySelector('input')
        const isText = input.type === 'text'

        input.type = isText ? 'password' : 'text'
        this.classList.toggle('pass-visible')
    }))
}

const showModal = (id) => {
    showModalBack()
    showModalDialog(id)
}

window.addEventListener('load', () => {
    initModal()
    initCloseModal()
    initToggleVisiblePass()
})
// Product information slider
let productInfoSlider

const initProductInfoSlider = () => {

    if (document.querySelectorAll('.product-info .swiper').length === 0) return

    productInfoSlider = new Swiper('.product-info .swiper', {
        loop: false,
        // slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,

        // autoHeight: true,
        // spaceBetween: 10,

        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true
        },

        breakpoints: {
            576: {
                slidesPerView: 'auto',
            }
        }
    })
}

const checkProductInfoSlider = () => {
    if (window.innerWidth > 991) {
        if (productInfoSlider) {
            productInfoSlider.destroy(true, true)
            productInfoSlider = undefined
        }
        return
    }

    if (!productInfoSlider) {
        initProductInfoSlider()
    }
}

window.addEventListener('load', () => {
    const isProductPage = document.querySelector('.page-product')
    const isArticlePage = document.querySelector('.page-article')
    const isDotsPage = document.querySelector('.page-dots')

    // Initialize Info slider only for Product, Article and Dots pages
    if (!isProductPage && !isArticlePage && !isDotsPage) return

    checkProductInfoSlider()

    window.addEventListener('resize', () => {
        window.safeCall(checkProductInfoSlider)
    })
})


const resetAllCardsPics = (node) => {
    const pics = Array.from(node.querySelectorAll('.cards-series__pic'))
    pics.forEach(node => node.classList.remove('active'))
}

const resetAllCardsTabs = (node) => {
    const tabs = Array.from(node.querySelectorAll('.cards-series__tab'))
    tabs.forEach(node => node.classList.remove('active'))
}

const getTargetCardsPic = (node, dataTargetTypeVal) => {
    return node.querySelector(`[data-type=${dataTargetTypeVal}]`)
}

const initCardsTab = () => {
    const tabArr = Array.from(document
        .querySelectorAll('.cards-series__tab'))

    tabArr.forEach(node => {
        node.addEventListener('click', function(e) {
            e.preventDefault()
            e.stopPropagation()

            if (this.classList.contains('active')) return

            const parent = this.closest('.cards-series__item')
            const targetPicType = this.dataset.targetType
            const targetPic = getTargetCardsPic(parent, targetPicType)

            // Set active tab
            resetAllCardsTabs(parent)
            this.classList.add('active')


            // Set active image
            if (targetPic) {
                resetAllCardsPics(parent)
                targetPic.classList.add('active')
            }
        })
    })
}

window.addEventListener('load', initCardsTab)

// Product recommendation slider
let productRecommSlider

const checkRecommSliderScrollbar = (swiper, scrollbar) => {
    if (!scrollbar || scrollbar.style.display === 'none') return

    const isScrollbarHide = scrollbar.classList
        .contains('swiper-scrollbar-lock')

    isScrollbarHide
        ? swiper.classList.add('scroll-hidden')
        : swiper.classList.remove('scroll-hidden')
}

const checkSlidersBottomOffset = () => {
    const swipers = Array.from(document.querySelectorAll('.swiper'))

    swipers.forEach(swiper => {
        const scrollbar = swiper.querySelector('.swiper-scrollbar')
        checkRecommSliderScrollbar(swiper, scrollbar)
    })
}

const initProductRecommSlider = () => {

    if (document.querySelectorAll('.recommendation__slider .swiper').length === 0) return

    productRecommSlider = new Swiper('.recommendation__slider .swiper', {
        loop: false,
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
        // autoHeight: true,

        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true
        },

        breakpoints: {
            576: {
                slidesPerView: 2,
                spaceBetween: 10,
            },

            991: {
                slidesPerView: 3,
                spaceBetween: 10,
            },
            1200: {
                slidesPerView: 'auto',
                spaceBetween: 0,
            }
        },
        on: {
            init: function () {
                const swiper = this.el
                const scrollbar = this.scrollbar.el
                checkRecommSliderScrollbar(swiper, scrollbar)
            }
        }
    })
}

const checkProductRecommSlider = () => {
    if (window.innerWidth > 1200 && productRecommSlider) {
        Array.isArray(productRecommSlider)
            ? productRecommSlider.forEach(slider => slider.destroy(true, true))
            : productRecommSlider.destroy(true, true)

        productRecommSlider = undefined
        return
    }

    if (!productRecommSlider) {
        initProductRecommSlider()
    }
}

window.addEventListener('load', () => {
    const isProductPage = document.querySelector('.page-product')
    const isArticlePage = document.querySelector('.page-article')
    const isDotsPage = document.querySelector('.page-dots')

    // Initialize Recommendation slider only for Product, Article and Dots pages
    if (!isProductPage && !isArticlePage && !isDotsPage) return

    checkProductRecommSlider()

    window.addEventListener('resize', () => {
        window.safeCall(checkProductRecommSlider)
        window.safeCall(checkSlidersBottomOffset)
    })
})

/**
 * Show a small message with title and text in the top right corner of the screen.
 * The method expects at least one parameter per input.
 *
 * @param {string} [title=undefined] - The headline of the message in one line.
 * @param {string} [message=undefined] - One line message text.
 */
window.showModalMsg = function(title = '', message = '') {
    if (!title && !message) {
        console.error("There's no title or message for showing in modal window.")
        return
    }

    if (typeof title !== 'string') {
        console.error("Incorrect type of title. It should be string.")
        return
    }

    if (typeof message !== 'string') {
        console.error("Incorrect type of message. It should be string.")
        return
    }

    const container = document.querySelector('.header__msg-container')
    const [card, body] = createModalMsgCard(title, message)

    container.appendChild(card)
    checkModalMsgContainer()
    card.classList.add('display')

    setTimeout(() => card.classList.add('uncollapsed'), 50)

    setTimeout(() => {
        body.classList.add('visible')
    }, 100)

    hideModalMsg(card, body, 5000)
}

function checkModalMsgContainer() {
    const container = document.querySelector('.header__msg-container')
    const innerElms = container.querySelectorAll('.modal-msg__card')

    innerElms.length > 0
        ? container.classList.add('display')
        : container.classList.remove('display')
}

function createModalMsgCard(title, message) {
    const card = document.createElement('div')
    card.classList.add('modal-msg__card')

    const body = document.createElement('div')
    body.classList.add('modal-msg__body')

    const icon = document.createElement('i')

    const content = document.createElement('div')
    content.classList.add('modal-msg__content')

    const caption = document.createElement('p')
    caption.textContent = title

    const text = document.createElement('span')
    text.textContent = message

    if (title) content.appendChild(caption)
    if (message) content.appendChild(text)

    body.appendChild(icon)
    body.appendChild(content)

    card.appendChild(body)

    card.addEventListener('click', hideModalMsgHandler)

    return [card, body]
}

function hideModalMsgHandler() {
    const card = this
    const body = card.querySelector('.modal-msg__body')
    hideModalMsg(card, body)
}

function hideModalMsg(card, body, timeout = 0) {
    setTimeout(() => {
        body.classList.add('hidden')
    }, timeout)

    setTimeout(() => {
        body.classList.remove('visible', 'hidden')
        card.classList.remove('uncollapsed')
    }, timeout + 100)

    setTimeout(() => {
        card.remove();
        checkModalMsgContainer()
    }, timeout + 200)
}

const showButtonScrollToTop = (button) => {
    const windowHeight = window.innerHeight
    const scrollTop = window.scrollY

    if (scrollTop > windowHeight) {
        button.classList.add('display')
    } else {
        button.classList.remove('display')
    }
}

const initScrollToTop = () => {
    const button = document.getElementById('scrollToTop')

    if (!button) return

    button.addEventListener('click', () => smoothScrollTo(0))
    window.addEventListener('scroll', () => showButtonScrollToTop(button))
}

window.addEventListener('load', () => {
    initScrollToTop()
})
const showSpinner = () => {
    const spinner = document.getElementById('spinner')
    spinner.classList.add('display')
    setTimeout(() => spinner.classList.add('visible'), 100)
}

const hideSpinner = () => {
    const spinner = document.getElementById('spinner')
    spinner.classList.remove('visible')
    setTimeout(() => spinner.classList.remove('display'), 1000)
}

window.addEventListener('load', () => {
    if (document.getElementById('spinner')) {
        window.spinner.show = showSpinner
        window.spinner.hide = hideSpinner
    }
})

// Open and close mobile navigation
window.addEventListener("load", () => {
    const navClose = Array.from(document.querySelectorAll('.header__nav-close'))
    const navToggler = document.querySelector('.footer__nav-link_menu')
    const headerNav = document.querySelector('.header__nav')
    const modalBack = document.querySelector('.header__modal-back')
    const navProdLink = document.querySelector('.header__nav-link_product')
    const navItems = Array.from(document.querySelectorAll('.header__nav-item_with-inner'))
    const navLinks = Array.from(document.querySelectorAll('.header__nav-link'))
    const navCollapses = Array.from(document.querySelectorAll('.header__nav-collapse'))

    if (!navToggler) return

    const toggleNav = (direction) => {
        if (direction) {
            document.body.classList.add('modal-open')
            navToggler.classList.add('active')
            headerNav.classList.add('open')
            // modalBack.classList.add('show')

            setTimeout(() => {
                navProdLink.click()
            }, 100)

            return
        }

        document.body.classList.remove('modal-open')
        navToggler.classList.remove('active')
        headerNav.classList.remove('open')
        modalBack.classList.remove('show')

        collapsAllNavItem()
    }

    // Click on navigation burger
    navToggler.addEventListener('click', function () {
        if (this.classList.contains('active')) {
            toggleNav(false)
            return
        }

        toggleNav(true)
    })

    // Click on navigation close button
    navClose.forEach(btn => {
        btn.addEventListener('click', () => toggleNav(false))
    })

    modalBack.addEventListener('click', () => {
        toggleNav(false)
    })

    // Open and close Navigation items
    const collapsAllNavItem = () => {
        navItems.forEach(i => i.classList.remove('dropped'))
        navLinks.forEach(i => i.classList.remove('active'))
        navCollapses.forEach(i => i.classList.remove('open'))
    }

    const toggleNavItem = (btn) => {
        const isActive = btn.classList.contains('active')

        collapsAllNavItem()

        if (!isActive) {
            btn.classList.add('active')

            const navItem = btn.closest('.header__nav-item_with-inner')

            if (navItem) {
                const navCollapse = navItem.querySelector('.header__nav-collapse')

                navItem.classList.add('dropped')
                navCollapse.classList.add('open')
                modalBack.classList.add('show')
            }
        }
    }

    navLinks.forEach(btn => {
        btn.addEventListener('click', function () {
            toggleNavItem(this)
        })
    })
})

// Searching and Sticky header
window.addEventListener("load", () => {
    
   
    
    const header = document.querySelector('.header')
    const searchToggler = document.querySelector('.header__buttons-link_search')
    const searchClose = document.querySelector('.header__search-close')
    const searchPanel = document.querySelector('.header__search')
    const searchInput = document.querySelector('.header__search-input')
    const searchReset = document.querySelector('.header__search-reset')
    const searchHints = document.querySelector('.header__search-hints')

    if (!searchToggler) return

    const toggleSearchPanel = (hide = false) => {
        const isVisible = searchPanel.classList.contains('visible')
        const timeout = 100

        if (!isVisible && !hide) {
            searchPanel.classList.remove('disable')
            header.classList.add('header_with-search-panel')
            searchToggler.classList.add('active')

            setTimeout(() => {
                searchPanel.classList.add('visible')
            }, timeout)

            return
        }

        searchToggler.classList.remove('active')
        searchPanel.classList.remove('visible')

        if (window.innerWidth < 992) {
            searchHints.classList.remove('visible')
            searchReset.click()
            resetHandlerFormHelpersEventListeners()
        }

        setTimeout(() => {
            searchPanel.classList.add('disable')
            header.classList.remove('header_with-search-panel')
        }, 200)
    }

    searchToggler.addEventListener('click', e => {
        e.stopPropagation()
        toggleSearchPanel()
        searchInput.focus()
    })

    searchClose.addEventListener('click', e => {
        e.stopPropagation()
        toggleSearchPanel()
    })

    // const SEARCH_REQUEST_URL = 'https://anaragaev.github.io/technolight.layout/mocks/search.json'
    // const SEARCH_REQUEST_URL = 'https://test-technolightv2.massive.ru/api/product/search'

    const SEARCH_REQUEST_URL = '/api/product/search'
    // const SEARCH_REQUEST_URL = 'https://technolight.ru/api/product/search'
    const THROTTLE_TIMEOUT = 300
    let searchRequestTimeoutId

    const setStrongText = (str, query) => {
        const regex = new RegExp(query, 'gi')
        return str.replace(regex, `<strong>$&</strong>`)
    }

    const printQueryResult = (data, query) => {

        console.log('Получили поисковую выдачу', data);

        // Reset all children nodes of search hints
        while (searchHints.firstChild) {
            searchHints.removeChild(searchHints.firstChild)
        }

        // Set link, similar or No Result
        const links = document.createElement('div')
        links.classList.add('header__search-links')

        const similar = document.createElement('div')
        similar.classList.add('header__search-similar')

        if (data.length === 0) {
            // No results
            const span = document.createElement('span')
            span.classList.add('no-results')
            span.innerText = 'По Вашему запросу ничего не найдено'
            links.appendChild(span)
        } else {
            // Links
            const hint = data[0]
            const link = document.createElement('a')
            link.href = hint.url
            link.innerHTML = setStrongText(hint.title, query)
            links.appendChild(link)

            // Similar
            similar.innerHTML = '<h5>смотрите похожие</h5>'

            for (const num in data) {
                if (num < 1) continue

                // Link
                const hint = data[num]
                const link = document.createElement('a')
                link.href = hint.url

                // Image
                const picSpan = document.createElement('span')
                picSpan.classList.add('pic')

                const img = document.createElement('img')
                img.src = hint.image
                img.alt = hint.title
                picSpan.appendChild(img)

                // Text
                const textSpan = document.createElement('span')
                textSpan.classList.add('text')
                textSpan.innerHTML = setStrongText(hint.title, query)

                link.appendChild(picSpan)
                link.appendChild(textSpan)
                similar.appendChild(link)

                if (num > 6) break
            }
        }

        searchHints.appendChild(links)
        searchHints.classList.add('visible')

        if (data.length > 1) {
            searchHints.appendChild(similar)
        }

        // Нужно только для полного меню
        // setHandlerToHelpers()

        if (window.innerWidth < 992) {
            document.body.classList.add('modal-open')
        }
    }

    const fetchSearchingData = async (query) => {
        try {
            const res = await fetch(SEARCH_REQUEST_URL + `?query=${query}`)

            if (!res.ok) {
                throw new Error('Ошибка запроса поиска')
            }

            const data = await res.json()
            printQueryResult(data, query)

        } catch (error) {
            console.error(error)
        }
    }

    function searchHandlerFormHelpersEventListeners() {
        if (this.value === '') {
            searchReset.classList.remove('visible')
            searchHints.classList.remove('visible')
            clearTimeout(searchRequestTimeoutId)
            return
        }

        searchReset.classList.add('visible')

        // *** Fetching search requests and show results --- START
        clearTimeout(searchRequestTimeoutId)
        searchRequestTimeoutId = setTimeout(
            () => fetchSearchingData(this.value),
            THROTTLE_TIMEOUT
        )
        // *** Fetching search requests and show results --- FINISH
    }
    
    searchInput.addEventListener('input', searchHandlerFormHelpersEventListeners)
    searchInput.addEventListener('focus', searchHandlerFormHelpersEventListeners)

    searchReset.addEventListener('click', (e) => {
        e.stopPropagation()
        searchReset.classList.remove('visible')
        searchHints.classList.remove('visible')
        resetHandlerFormHelpersEventListeners()
        document.body.classList.remove('modal-open')
    })

    document.querySelector('.header__search-form').addEventListener('submit', e => {
        e.preventDefault()
        try {
            let link = document.querySelector('.header__search-links a')?.getAttribute('href');
            if (link && link !== "#") {
                if (!link.startsWith('http')) {
                    //приводим к абсолютному пути
                    link = window.location.origin + `${link}`;
                }
                const url = new URL(link)
                url.searchParams.set('search', searchInput.value)
                console.log(url.href)
                setTimeout(() => {
                    window.location.href = url.href
                }, 500)
            }
        } catch (error) {
            console.warn(error)
        }
    })

    document.addEventListener('click', e => {
        const isSearchToggle = e.target
            .closest('.header__buttons-link_search')

        const isSearchPanel = e.target
            .closest('.header__search')

        const isTachDevice = window.innerWidth < 992

        if (!isTachDevice && !isSearchPanel && !isSearchToggle) {
            toggleSearchPanel(true)
        }
    })

    // Set help text from helper button under the search input to the search value
    const requestCompletion = (e) => {
        const additionValue = e.target.innerText
        searchInput.value = `${searchInput.value} ${additionValue}`
    }

    const setHandlerToHelpers = () => {
        const searchHelpers = Array.from(document
            .querySelectorAll('.header__search-helps span'))

        searchHelpers.forEach(btn => btn
            .addEventListener('click', requestCompletion))
    }

    const resetHandlerFormHelpersEventListeners = () => {
        const searchHelpers = Array.from(document
            .querySelectorAll('.header__search-helps span'))

        searchHelpers.forEach(btn => {
            btn.removeEventListener('click', requestCompletion)
        })
    }

    // Sticky header
    let beforeScrollTop = 0

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight
        const header = document.getElementById("header")
        const headerHeight = header.clientHeight
        const delay = '.7s'

        let currentScrollTop = window.scrollY

        if (window.innerWidth > 991) {
            if (currentScrollTop > windowHeight) {
                header.classList.add('compressed')
            } else {
                header.classList.remove('compressed')
            }
            return
        }

        if (currentScrollTop > 100 && currentScrollTop > beforeScrollTop) {
            const isVisibleSearch = searchPanel
                .classList.contains('visible')

            let intervalId

            if (isVisibleSearch) {
                header.style.transitionDelay = delay
                toggleSearchPanel(true)
                intervalId = setInterval(() => {
                    header.style.transitionDelay = '0s'
                    clearInterval(intervalId)
                }, 1000)
            }

            header.style.top = `-${headerHeight}px`
        } else {
            header.style.top = 0
        }

        beforeScrollTop = window.pageYOffset
    });

    // Toggle search panel
    const currentUrl = new URL(window.location.href)
    if (currentUrl.searchParams.has('search')) {
        searchInput.value = currentUrl.searchParams.get('search')
        toggleSearchPanel()
    }
})

// Cart update listening
const setCartUpdateListener = () => {
    const cartProductCountNode = document.querySelector('#cartProductCount')

    if (!cartProductCountNode) return

    cartProductCountNode.addEventListener('cartUpdateEvent', function (e) {

        const products = window.CART.products
        let productCount = 0

        for (const iterator of products) {
            productCount += iterator.count
        }

        cartProductCountNode.innerText = productCount
        cartProductCountNode.dataset.count = productCount.toString()
        cartProductCountNode.classList.add('selected')
        setTimeout(() => cartProductCountNode.classList.remove('selected'), 1000)

        console.log(e.detail.message)
    })
}

window.addEventListener('load', setCartUpdateListener)

// Open and close subLists
const toggleSubNavLists = () => {
    const togglers = Array.from(document
        .querySelectorAll('.header__nav-inner-toggle'))

    const closeAllTogglers = () => {
        togglers.forEach(el => {
            const wrap = el.closest('.header__nav-inner-caption')
            wrap.classList.remove('dropped')

            const collapse = wrap.querySelector('.header__nav-sublist-collapse')
            collapse.classList.remove('open')

            el.classList.remove('active')
        })
    }

    togglers.forEach(el => el.addEventListener('click', () => {
        const wrap = el.closest('.header__nav-inner-caption')
        const collapse = wrap.querySelector('.header__nav-sublist-collapse')
        const isCurrentDropped = wrap.classList.contains('dropped')

        // closeAllTogglers()

        // Toggle current
        if (!isCurrentDropped) {
            wrap.classList.add('dropped')
            el.classList.add('active')
            collapse.classList.add('open')
        } else {
            wrap.classList.remove('dropped')
            el.classList.remove('active')
            collapse.classList.remove('open')
        }
    }))

    // Close all subnav list on out click
    document.addEventListener('click', e => {
        const isTarget = e.target
            .classList
            .contains('header__nav-inner-toggle')

        if (!isTarget) closeAllTogglers()
    })
}

window.addEventListener('load', toggleSubNavLists)

// Deleting blocking of all animation for fix animation artefacts
const removeAnimationBlocker = () => {
    Array.from(document.querySelectorAll('.transition-blocker'))
        .forEach(el => el.classList.remove('transition-blocker'))
}
window.addEventListener('load', removeAnimationBlocker)

// Blocking all animation at the window resizing process
const addAnimationBlocker = () => {
    document.body.classList.add('transition-blocker')
}

let blockAnimationTimer

window.addEventListener("resize", () => {
    clearTimeout(blockAnimationTimer)
    window.safeCall(addAnimationBlocker)

    blockAnimationTimer = setTimeout(() => {
        window.safeCall(removeAnimationBlocker)
    }, 300)
})

// Handle link with smooth animation to anchor place on the page
const smoothLinks = document.querySelectorAll('a[href^="#"]')
for (let smoothLink of smoothLinks) {
    smoothLink.addEventListener('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        const id = smoothLink.getAttribute('href')

        try {
            const targetNode = document.querySelector(`${id}`)
            const targetOffset = targetNode.offsetTop
            const deviceOffset = window.outerWidth > 768 ? -100 : -20

            smoothScrollTo(targetOffset + deviceOffset, 700)
        } catch (error) {
            console.error("There's no target node for scrolling to place. The selector isn't correct!");
            console.error(error)
        }
    })
};

// Animation items when user has scrolled screen to place of item
const checkAnimationElms = () => {
    const animationElms = Array.from(document
        .querySelectorAll('.animation-element'))

    return animationElms.length > 0
}

const showAnimElements = () => {
    const elms = Array.from(document
        .querySelectorAll('.animation-element'))

    const scrollTop = window.pageYOffset
    const windowHeight = window.innerHeight
    // const pointOfDisplay = windowHeight / 1.2 // for show on the half of the screen
    const pointOfDisplay = windowHeight

    elms.forEach(function (el) {
        const rect = el.getBoundingClientRect()
        const distanceFromTop = rect.top + window.pageYOffset

        if (distanceFromTop - pointOfDisplay < scrollTop) {
            el.classList.remove('animation-element')
        }
    })

    if (!checkAnimationElms()) {
        window.removeEventListener('scroll', showAnimElements)
    }
}

const setAnimationElms = () => {
    if (checkAnimationElms()) {
        window.addEventListener('scroll', showAnimElements)
    }
}

window.addEventListener("DOMContentLoaded", () => {
    window.safeCall(showAnimElements)
    window.safeCall(setAnimationElms)
})

// Phone masking
const initPhonesMask = () => {
    const phoneInputs = Array.from(document
        .querySelectorAll('[type="tel"]:not(.cart__calc [type="tel"])'))

    phoneInputs.forEach(phone => {
        const phoneMaskOptions = {
            mask: '+{7} (000) 000-00-00',
            lazy: true,
            placeholderChar: '#'
        }
        const phoneMask = IMask(
            phone,
            phoneMaskOptions
        )

        phone.addEventListener('focus', () => phoneMask.updateOptions({lazy: false}))
        phone.addEventListener('blur', () => phoneMask.updateOptions({lazy: true}))
    })
}

window.addEventListener('load', () => {
    window.safeCall(initPhonesMask)
})

// Fixing chat-24 widget position -- START
let chat24IntervalId = null
let chat24TimeoutId = null
let chart24StyleNode = null
let chart24Node = null

const fixChat24WidgetPosition = () => {
    chart24Node = document.querySelector('chat-24')

    if (!chart24Node) return

    if (window.innerWidth < 1024 && !chart24StyleNode) {
        chart24StyleNode = document.createElement('style')

        chart24StyleNode.innerHTML = `
            .startBtn.startBtn--outside.startBtn--bottom {
                bottom: 67px;
            }
            .startBtn.startBtn--open {
                transform: translateY(50%) scale(0.6) !important;
            }
        `;

        chart24Node.shadowRoot.prepend(chart24StyleNode)
    }

    if (window.innerWidth >= 1024 && chart24StyleNode !== null) {
        console.log('chart24StyleNode', chart24StyleNode);
        chart24StyleNode.remove()
        chart24StyleNode = null
    }

    clearInterval(chat24IntervalId)
    chat24IntervalId = null

    clearTimeout(chat24TimeoutId)
    chat24TimeoutId = null
}

const chat24RenderListener = () => {
    chat24IntervalId = setInterval(fixChat24WidgetPosition, 100)
}

const hardRemoveChat24RenderListener = () => {
    chat24TimeoutId = setTimeout(() => {
        if (chat24IntervalId) clearInterval(chat24IntervalId)
    }, 10000)
}

window.addEventListener('load', () => {
    window.safeCall(chat24RenderListener);
    window.safeCall(hardRemoveChat24RenderListener);
})

window.addEventListener('resize', () => {
    if (window.innerWidth < 1024) {
        window.safeCall(chat24RenderListener)
        return
    }

    if (chart24StyleNode) chart24StyleNode.remove()
})
// Fixing chat-24 widget position -- FINISH
/**
 * Флаг, указывающий на режим разработки.
 * @type {boolean}
 *
 * Для сервера верстки собирать и пушить в режиме DEV_MODE = true
 * На прод и дев собирать и пушить в режиме DEV_MODE = false
 *
 * В режиме DEV_MODE = true, при локальной разработке,
 * также необходимо править путь до файла main.js
 *
 * Прим.: <script src="http://localhost:номер_пота/js/main.js" defer></script>
 */
const DEV_MODE = window.MODE === 'dev' // dev - true, build - false

// Init cart custom Event
const cartEvent = new CustomEvent('cartUpdateEvent', {
    detail: {
        message: 'Fired cart product updated custom Event!'
    },
    bubbles: false,
    cancelable: false
})

const normalizeResponseCartData = (data) => {
    const products = []

    if (data.dots) {
        data.dots.forEach(dot => {
            products.push({article: dot.id, count: dot.count})
        });
    }

    if (data.products) {
        data.products.forEach(product => {
            products.push({article: product.article, count: product.count})
        });
    }

    return products
}

// Methods to work with cart for PRODUCTS
window.setProductToCart = async ({art, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Размещаем фиксированное количество товара в корзине:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-set.json')
        : await fetch('/ajax/cart/set', {method: 'POST', body: formData})

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Разместили товар в корзине. Получили ответ', data)

        return data

    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        // console.error('Ошибка размещения товара в Корзине! Код ошибки:', res.status)
    }
}

window.addProductToCart = async ({art, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Добавление товара в корзину:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-add.json')
        : await fetch('/ajax/cart/add', {method: 'POST', body: formData})

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Добавили товар в корзину. Получили данные', data)
        return data
    } else {
        // console.error('Ошибка добавления товара в Корзину! Код ошибки:', res.status)
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
    }
}

window.removeProductFromCart = async ({art, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Удаление товара из корзины:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-del.json')
        : await fetch('/ajax/cart/del', {method: 'POST', body: formData})

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Удалили товар из корзины. Получили данные', data);
    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        // console.error('Ошибка удаления товара из Корзины! Код ошибки:', res.status)
    }
}

// Methods to work with cart for DOTS
window.setDotToCart = async ({id, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Размещаем фиксированное количество Дотов в корзине:', id, ' - ', count);

    const formData = new FormData()
    formData.append('id', id)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-setDot.json')
        : await fetch('/ajax/cart/set', {method: 'POST', body: formData})

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Разместили Доты в корзине. Получили ответ', data);

    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        // console.error('Ошибка размещения Дотов в Корзине! Код ошибки:', res.status)
    }
}

window.addDotToCart = async (order) => {
    window.safeCall(window.spinner.show)

    // console.log('Добавление дота в корзину. Отправляем данные:', order)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-addDot.json')
        : await fetch('/ajax/cart/addDot', {method: 'POST', body: JSON.stringify(order)})

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]
        window.showModalMsg("Добавили Дот в корзину. Получили данные", data)

        return true
    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        console.error('Ошибка добавления Дота в Корзину! Код ошибки:', res.status)
        return false
    }
}

window.removeDotFromCart = async ({id, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Удаление Дота из корзины:', id, ' - ', count);

    const formData = new FormData()
    formData.append('id', id)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-delDot.json')
        : await fetch('/ajax/cart/delDot', {method: 'POST', body: formData})

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Удалили Dot из корзины. Получили данные', data);
    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        // console.error('Ошибка удаления Дота из Корзины! Код ошибки:', res.status)
    }
}


// Cart Proxy
const cartGet = (target, prop) => {
    return target[prop]
}

const cartSet = (target, prop, val) => {


    if (prop === 'products') {
        // Проверьте, отличается ли новое значение от старого значения.
        const is_same = (target.products.length === val.length) && target.products.every(
            function (element, index) {
                return element.article === val[index].article && element.count === val[index].count;
            }
        );
        if (!is_same) {
            // console.log('SETTING');
            // console.log('target', target);
            // console.log('prop', prop);
            // console.log('val', val);

            target.products = [...val];
            cartEvent.detail.products = target.products;
            // Dispatching custom cart update Event
            const cartProductCountNode = document.querySelector("#cartProductCount");
            if (cartProductCountNode) cartProductCountNode.dispatchEvent(cartEvent);
        }
    }

    return true
}

const initCart = async () => {
    if (!window.CART) {

        const res = DEV_MODE
            ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-get.json')
            : await fetch('/ajax/cart/get', {method: 'POST'})

        if (res.ok) {
            const data = await res.json()

            window.CART = new Proxy({
                products: [...normalizeResponseCartData(data)]
            }, {
                get: cartGet,
                set: cartSet
            })

            // console.log('Инициализируем корзину -------------------------- START');
            // console.log('Response data', data)
            // console.log('window.CART', window.CART)
            // console.log('Инициализируем корзину -------------------------- FINISH');

        } else {
            console.error('Ошибка запроса Корзины! Код ошибки:', res.status)
        }
    }
}

window.addEventListener('load', initCart)

// setTimeout(() => {
//     // откладываем на 1 минуту
//     window.cartUpdateInterval = setInterval(async () => {
//         if (window.CART !== undefined && !DEV_MODE) {
//             const res = await fetch('/ajax/cart/get', {method: 'POST'})
//             if (res.ok) {
//                 const data = await res.json()
//                 window.CART.products = [...normalizeResponseCartData(data)]
//             }
//         }
//     }, 30000)
// }, 60000)
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsZWFyUGhvbmUuanMiLCJkZWJvdW5jZS5qcyIsImRvd25sb2FkRmlsZS5qcyIsImV2ZW50LmpzIiwiZm9ybWF0TnVtYmVyLmpzIiwiZ2V0VXJsUGFyYW1ldGVyQnlOYW1lLmpzIiwic2F2ZUNhbGwuanMiLCJzbW9vdGhTY3JvbGxUby5qcyIsInRocm90dGxlLmpzIiwidmFsaWRhdGVFbWFpbC5qcyIsInZhbGlkYXRlUGhvbmUuanMiLCJhY2NvdW50LWZvcm1zL3NjcmlwdC5qcyIsImNhcmRzLWl0ZW0vc2NyaXB0LmpzIiwiZmlsdGVycy9zY3JpcHQuanMiLCJpbmZvcm1lci9zY3JpdHAuanMiLCJtb2RhbHMvc2NyaXB0LmpzIiwicHJvZHVjdC1pbmZvL3NjcmlwdC5qcyIsImNhcmRzLXNlcmllcy9zY3JpcHQuanMiLCJyZWNvbW1lbmRhdGlvbi9zY3JpcHQuanMiLCJzaG93LW1vZGFsLW1zZy9zY3JpcHQuanMiLCJzY3JvbGwtdG8tdG9wL3NjcmlwdC5qcyIsInNwaW5uZXIvc2NyaXB0LmpzIiwiZm9vdGVyL3NjcmlwdC5qcyIsImhlYWRlci9zY3JpcHQuanMiLCJtYWluLmpzIiwiY2FydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ2xlYXIgcGhvbmUgb2Ygc3BhY2VzLCBicmFja2V0cyxcclxuICogZGFzaGVzIGFuZCBwbHVzIHNpZ24uIExlYXZlIG9ubHkgbnVtYmVycy5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHBob25lIC0gVGhlIHBob25lLCB0aGF0IG5lZWRzIHRvIGNsZWFyLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFBob25lIG51bWJlciBhcyBhIG51bWJlciB0eXBlLlxyXG4gKi9cclxud2luZG93LmNsZWFyUGhvbmUgPSAocGhvbmUpID0+IHtcclxuICAgIHJldHVybiBwYXJzZUludChwaG9uZS5yZXBsYWNlKC9cXEQvZywgXCJcIikpXHJcbn1cclxuIiwid2luZG93LmRlYm91bmNlID0gKGZ1bmMsIG1zKSA9PiB7XHJcbiAgICBsZXQgdGltZW91dElkXHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzXHJcbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3VtZW50c1xyXG5cclxuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKVxyXG5cclxuICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKVxyXG4gICAgICAgIH0sIG1zKVxyXG4gICAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBEb3dubG9hZHMgYSBmaWxlIGZyb20gdGhlIHNwZWNpZmllZCBVUkwgYW5kIHRyaWdnZXJzIGEgZG93bmxvYWQgaW4gdGhlIGJyb3dzZXIuXHJcbiAqIFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIFVSTCBvZiB0aGUgZmlsZSB0byBiZSBkb3dubG9hZGVkLlxyXG4gKi9cclxud2luZG93LmRvd25sb2FkRmlsZSA9ICh1cmwsIGZpbGVuYW1lPW51bGwsIGRlZmF1bHRFeHRlbnNpb24gPSAnYmluJykgID0+IHtcclxuICAgIGlmICh1cmwgPT09IHVuZGVmaW5lZCB8fCB1cmwgPT09IG51bGwgfHwgdXJsID09PSBcIlwiKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8g0J/QvtC60LDQt9Cw0YLRjCDRgdC/0LjQvdC90LXRgFxyXG4gICAgaWYgKHdpbmRvdy5zcGlubmVyICYmIHR5cGVvZiB3aW5kb3cuc3Bpbm5lci5zaG93ID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICB3aW5kb3cuc3Bpbm5lci5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0KHQvtC30LTQsNC10Lwg0L3QvtCy0YvQuSBYTUxIdHRwUmVxdWVzdFxyXG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4aHIub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9IFwiYmxvYlwiO1xyXG5cclxuICAgIC8vINCe0LHRgNCw0LHQvtGC0YfQuNC6INC30LDQstC10YDRiNC10L3QuNGPINC30LDQs9GA0YPQt9C60LhcclxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgIC8vINCf0L7Qv9GL0YLQutCwINC/0L7Qu9GD0YfQuNGC0Ywg0YDQsNGB0YjQuNGA0LXQvdC40LUg0LjQtyDQt9Cw0LPQvtC70L7QstC60L7QslxyXG4gICAgICAgICAgICBsZXQgZXh0ZW5zaW9uID0gZGVmYXVsdEV4dGVuc2lvbjtcclxuICAgICAgICAgICAgY29uc3QgY29udGVudERpc3Bvc2l0aW9uID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiQ29udGVudC1EaXNwb3NpdGlvblwiKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnREaXNwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBjb250ZW50RGlzcG9zaXRpb24ubWF0Y2goL2ZpbGVuYW1lPVwiPygoLiopXFwuKC4qKSlcIj8vKTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaFsxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZmlsZW5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBtYXRjaFsyXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uID0gbWF0Y2hbM107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vINCh0L7Qt9C00LDQtdC8IFVSTCDQtNC70Y8g0LfQsNCz0YDRg9C20LXQvdC90L7Qs9C+INGE0LDQudC70LBcclxuICAgICAgICAgICAgY29uc3QgYmxvYlVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoeGhyLnJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgIC8vINCh0L7Qt9C00LDQtdC8INCy0YDQtdC80LXQvdC90YvQuSDRjdC70LXQvNC10L3RgiA8YT4g0LTQu9GPINGB0LrQsNGH0LjQstCw0L3QuNGPINGE0LDQudC70LBcclxuICAgICAgICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG4gICAgICAgICAgICBhLmhyZWYgPSBibG9iVXJsO1xyXG4gICAgICAgICAgICBhLmRvd25sb2FkID0gYCR7ZmlsZW5hbWV9LiR7ZXh0ZW5zaW9ufWA7IC8vINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INC40LzRjyDRhNCw0LnQu9CwINGBINGA0LDRgdGI0LjRgNC10L3QuNC10LxcclxuXHJcbiAgICAgICAgICAgIC8vINCU0L7QsdCw0LLQu9GP0LXQvCDRjdC70LXQvNC10L3RgiDQsiBET00g0Lgg0LjQvdC40YbQuNC40YDRg9C10Lwg0YHQutCw0YfQuNCy0LDQvdC40LVcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgYS5jbGljaygpO1xyXG5cclxuICAgICAgICAgICAgLy8g0KPQtNCw0LvRj9C10Lwg0Y3Qu9C10LzQtdC90YIg0LjQtyBET01cclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhKTtcclxuXHJcbiAgICAgICAgICAgIC8vINCe0YHQstC+0LHQvtC20LTQsNC10LwgVVJMINC+0LHRitC10LrRgtCwXHJcbiAgICAgICAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwoYmxvYlVybCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQodC60YDRi9GC0Ywg0YHQv9C40L3QvdC10YBcclxuICAgICAgICBpZiAod2luZG93LnNwaW5uZXIgJiYgdHlwZW9mIHdpbmRvdy5zcGlubmVyLmhpZGUgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICB3aW5kb3cuc3Bpbm5lci5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDQntCx0YDQsNCx0L7RgtGH0LjQuiDQvtGI0LjQsdC+0LpcclxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LfQsNCz0YDRg9C30LrQtSDRhNCw0LnQu9CwXCIpO1xyXG5cclxuICAgICAgICAvLyDQodC60YDRi9GC0Ywg0YHQv9C40L3QvdC10YAg0LIg0YHQu9GD0YfQsNC1INC+0YjQuNCx0LrQuFxyXG4gICAgICAgIGlmICh3aW5kb3cuc3Bpbm5lciAmJiB0eXBlb2Ygd2luZG93LnNwaW5uZXIuaGlkZSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zcGlubmVyLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vINCe0YLQv9GA0LDQstC70Y/QtdC8INC30LDQv9GA0L7RgVxyXG4gICAgeGhyLnNlbmQoKTtcclxufSIsIndpbmRvdy5jdXN0b21FdmVudCA9IHtcclxuICBvbjogKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykgPT4ge1xyXG4gICAgd2luZG93LmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBldmVudENhbGxiYWNrKTtcclxuICB9LFxyXG4gIG9mZjogKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykgPT4ge1xyXG4gICAgd2luZG93LmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBldmVudENhbGxiYWNrKTtcclxuICB9LFxyXG4gIG9uY2U6IChldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spID0+IHtcclxuICAgIGNvbnN0IGhhbmRsZXIgPSAoZXZlbnQpID0+IHtcclxuICAgICAgZXZlbnRDYWxsYmFjayhldmVudCk7XHJcbiAgICAgIHRoaXMub2ZmKGV2ZW50TmFtZSwgaGFuZGxlcik7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5vbihldmVudE5hbWUsIGhhbmRsZXIpO1xyXG4gIH0sXHJcbiAgZW1pdDogKGV2ZW50TmFtZSwgZXZlbnREYXRhKSA9PiB7XHJcbiAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcclxuICAgICAgZGV0YWlsOiBldmVudERhdGEsXHJcbiAgICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgICBjYW5jZWxhYmxlOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgICB3aW5kb3cuZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICByZXR1cm4gZXZlbnQ7XHJcbiAgfVxyXG59O1xyXG4iLCIvKipcclxuICogRm9ybWF0dGluZyBudW1iZXIgdG8gdGhlIGxvY2FsIHZhbHVlXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nIHwgbnVtYmVyfSBudW1iZXIgLSBWYWx1ZSBmb3IgZm9ybWF0dGluZy5cclxuICovXHJcblxyXG53aW5kb3cuZm9ybWF0TnVtYmVyID0gKG51bWJlcikgPT4ge1xyXG4gICAgY29uc3QgdmFsdWUgPSBwYXJzZUludChudW1iZXIudG9TdHJpbmcoKS5yZXBsYWNlKC9cXHMvZywgXCJcIikpXHJcbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCBcIiBcIik7XHJcbn1cclxuIiwiLyoqXHJcbiAqIEdldHRpbmcgZ2V0IHBhcmFtZXRlciBmcm9tIHRoZSB1cmxcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2VhcmNoIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtzdHJpbmd9IFt1cmxdIC0gVGhlIFVSTCBhZGRyZXNzLiBJZiB0aGlzIHBhcmFtZXRlciBpcyBub3QgcGFzc2VkLCB0aGVuIHRoZSBzZWFyY2gsIGJ5IGRlZmF1bHQsIHdpbGwgb2NjdXIgaW4gdGhlIGN1cnJlbnQgVVJMLlxyXG4gKi9cclxud2luZG93LmdldFVybFBhcmFtZXRlckJ5TmFtZSA9IGZ1bmN0aW9uKG5hbWUsIHVybCkge1xyXG4gICAgaWYgKCFuYW1lKSByZXR1cm5cclxuXHJcbiAgICBpZiAoIXVybCkgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWZcclxuXHJcbiAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKVxyXG5cclxuICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbPyZdXCIgKyBuYW1lICsgXCIoPShbXiYjXSopfCZ8I3wkKVwiKSxcclxuICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xyXG5cclxuICAgICAgICBpZiAoIXJlc3VsdHMpIHJldHVybiBudWxsXHJcblxyXG4gICAgaWYgKCFyZXN1bHRzWzJdKSByZXR1cm4gJydcclxuXHJcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSlcclxufVxyXG4iLCIvKipcclxuICog0LHQtdC30L7Qv9Cw0YHQvdGL0Lkg0LLRi9C30L7QsiDRhNGD0L3QutGG0LjQuFxyXG4gKiBAcGFyYW0gZm4gZnVuY3Rpb25cclxuICogQHBhcmFtIHsoKnwqKVtdW119IGFyZ3NcclxuICovXHJcbndpbmRvdy5zYWZlQ2FsbCA9IGZ1bmN0aW9uKGZuLCAuLi5hcmdzKSB7XHJcbiAgdHJ5IHtcclxuICAgIGZuLmNhbGwodGhpcyB8fCB3aW5kb3csIC4uLmFyZ3MpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcIltTYWZlIENhbGxdOiBcIiwgZm4sIGUpO1xyXG4gIH1cclxufTsiLCIvKipcclxuICogU21vb3RobHkgc2Nyb2xscyB0aGUgcGFnZSB0byB0aGUgc3BlY2lmaWVkIHBvc2l0aW9uLlxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24gLSBUaGUgcG9zaXRpb24gdG8gc2Nyb2xsIHRvLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gW2R1cmF0aW9uPTUwMF0gLSBUaGUgZHVyYXRpb24gb2YgdGhlIGFuaW1hdGlvbiBpbiBtaWxsaXNlY29uZHMuXHJcbiAqL1xyXG5mdW5jdGlvbiBzbW9vdGhTY3JvbGxUbyhwb3NpdGlvbiwgZHVyYXRpb24gPSA1MDApIHtcclxuICAgIGNvbnN0IHN0YXJ0UG9zaXRpb24gPSB3aW5kb3cucGFnZVlPZmZzZXRcclxuICAgIGNvbnN0IGRpc3RhbmNlID0gcG9zaXRpb24gLSBzdGFydFBvc2l0aW9uXHJcbiAgICBsZXQgc3RhcnRUaW1lc3RhbXAgPSBudWxsXHJcblxyXG4gICAgZnVuY3Rpb24gc3RlcCh0aW1lc3RhbXApIHtcclxuICAgICAgICBpZiAoIXN0YXJ0VGltZXN0YW1wKSBzdGFydFRpbWVzdGFtcCA9IHRpbWVzdGFtcFxyXG5cclxuICAgICAgICBjb25zdCBwcm9ncmVzcyA9IHRpbWVzdGFtcCAtIHN0YXJ0VGltZXN0YW1wXHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsWSA9IGVhc2VJbk91dEN1YmljKHByb2dyZXNzLCBzdGFydFBvc2l0aW9uLCBkaXN0YW5jZSwgZHVyYXRpb24pXHJcblxyXG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzY3JvbGxZKVxyXG5cclxuICAgICAgICBpZiAocHJvZ3Jlc3MgPCBkdXJhdGlvbikge1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGVhc2VJbk91dEN1YmljKHQsIGIsIGMsIGQpIHtcclxuICAgICAgICB0IC89IGRcclxuICAgICAgICB0LS1cclxuICAgICAgICByZXR1cm4gYyAqICh0ICogdCAqIHQgKyAxKSArIGJcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApXHJcbn1cclxuIiwid2luZG93LnRocm90dGxlID0gKGZ1bmMsIG1zKSA9PiB7XHJcbiAgICBsZXQgaXNUaHJvdHRsZWQgPSBmYWxzZSxcclxuICAgICAgICBzYXZlZEFyZ3MsXHJcbiAgICAgICAgc2F2ZWRUaGlzXHJcblxyXG4gICAgZnVuY3Rpb24gd3JhcHBlcigpIHtcclxuXHJcbiAgICAgICAgaWYgKGlzVGhyb3R0bGVkKSB7IC8vIDJcclxuICAgICAgICAgICAgc2F2ZWRBcmdzID0gYXJndW1lbnRzXHJcbiAgICAgICAgICAgIHNhdmVkVGhpcyA9IHRoaXNcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgLy8gMVxyXG5cclxuICAgICAgICBpc1Rocm90dGxlZCA9IHRydWVcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXNUaHJvdHRsZWQgPSBmYWxzZSAvLyAzXHJcbiAgICAgICAgICAgIGlmIChzYXZlZEFyZ3MpIHtcclxuICAgICAgICAgICAgICAgIHdyYXBwZXIuYXBwbHkoc2F2ZWRUaGlzLCBzYXZlZEFyZ3MpXHJcbiAgICAgICAgICAgICAgICBzYXZlZEFyZ3MgPSBzYXZlZFRoaXMgPSBudWxsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBtcylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gd3JhcHBlclxyXG59IiwiLyoqXHJcbiAqIEVtYWlsIGFkZHJlc3MgdmVyaWZpY2F0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbWFpbCAtIFRoZSBlbWFpbCwgdGhhdCBuZWVkcyB0byB2YWxpZGF0aW5nLlxyXG4gKi9cclxud2luZG93LnZhbGlkYXRlRW1haWwgPSAoZW1haWwpID0+IHtcclxuICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgZW1haWxcclxuICAgIGNvbnN0IGVtYWlsUmVnZXggPSAvXlteXFxzQF0rQFteXFxzQF0rXFwuW15cXHNAXSskL1xyXG4gICAgcmV0dXJuIGVtYWlsUmVnZXgudGVzdChlbWFpbClcclxufVxyXG4iLCIvKipcclxuICogUGhvbmUgbnVtYmVyIHZlcmlmaWNhdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcGhvbmUgLSBUaGUgcGhvbmUsIHRoYXQgbmVlZHMgdG8gdmFsaWRhdGluZy5cclxuICovXHJcbndpbmRvdy52YWxpZGF0ZVBob25lID0gKHBob25lKSA9PiB7XHJcbiAgICAvLyBSZWd1bGFyIGV4cHJlc3Npb24gZm9yIHBob25lXHJcbiAgICBjb25zdCBwaG9uZVJlZ2V4ID0gL143XFxkezEwfSQvXHJcbiAgICByZXR1cm4gcGhvbmVSZWdleC50ZXN0KHBob25lKVxyXG59XHJcbiIsImNvbnN0IGluaXRUb2dnbGVWaXNpYmxlRm9ybVBhc3MgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudG9nZ2xlLXZpc2libGUtcGFzcycpKVxyXG5cclxuICAgIGlmIChidG5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JylcclxuICAgICAgICBjb25zdCBpc1RleHQgPSBpbnB1dC50eXBlID09PSAndGV4dCdcclxuXHJcbiAgICAgICAgaW5wdXQudHlwZSA9IGlzVGV4dCA/ICdwYXNzd29yZCcgOiAndGV4dCdcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC50b2dnbGUoJ3Bhc3MtdmlzaWJsZScpXHJcbiAgICB9KSlcclxufVxyXG5cclxuLy8gY29uc3QgcmVzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyID0gKGlucHV0Tm9kZSkgPT4ge1xyXG4vLyAgICAgY29uc3QgY29udGFpbmVyID0gaW5wdXROb2RlLmNsb3Nlc3QoJ2xhYmVsJylcclxuLy8gICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtZXJyb3InKVxyXG4vLyB9XHJcblxyXG4vLyBjb25zdCBzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyID0gKGlucHV0Tm9kZSwgZXJyb3JUZXh0KSA9PiB7XHJcbi8vICAgICBjb25zdCBjb250YWluZXIgPSBpbnB1dE5vZGUuY2xvc2VzdCgnbGFiZWwnKVxyXG4vLyAgICAgY29uc3QgbWVzc2FnZSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZXJyb3ItbWVzc2FnZScpXHJcblxyXG4vLyAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2hhcy1lcnJvcicpXHJcbi8vICAgICBtZXNzYWdlLmlubmVyVGV4dCA9IGVycm9yVGV4dFxyXG5cclxuLy8gICAgIGlucHV0Tm9kZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcclxuLy8gICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLWVycm9yJylcclxuLy8gICAgIH0pXHJcbi8vIH1cclxuXHJcbi8vIGNvbnN0IGluaXRBY2NvdW50Rm9ybSA9ICgpID0+IHtcclxuLy8gICAgIGNvbnN0IGZvcm1zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3VudC1mb3JtX19mb3JtJykpXHJcbi8vICAgICBpZiAoZm9ybXMubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbi8vICAgICBmb3Jtcy5mb3JFYWNoKGZvcm0gPT4gZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XHJcbi8vICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4vLyAgICAgICAgIGNvbnN0IGZvcm1WYWxpZCA9IHtlbWFpbDogdHJ1ZSwgcGFzczogdHJ1ZSwgfVxyXG4vLyAgICAgICAgIGNvbnN0IGVtYWlsID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImVtYWlsXCJdJylcclxuLy8gICAgICAgICBjb25zdCBwYXNzICA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJwYXNzXCJdJylcclxuLy8gICAgICAgICBjb25zdCBmb3JtVHlwZSA9IHRoaXMuZGF0YXNldC5mb3JtVHlwZVxyXG5cclxuLy8gICAgICAgICByZXNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIoZW1haWwpXHJcbi8vICAgICAgICAgaWYgKGZvcm1UeXBlICE9PSAncmVjb3ZlcnknKSB7XHJcbi8vICAgICAgICAgICAgIHJlc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlcihwYXNzKVxyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgLy8gQ2hlY2sgZW1haWxcclxuLy8gICAgICAgICBpZiAoZW1haWwudmFsdWUgIT09ICcnKSB7XHJcbi8vICAgICAgICAgICAgIGlmICh3aW5kb3cudmFsaWRhdGVFbWFpbChlbWFpbC52YWx1ZSkpIHtcclxuLy8gICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IHRydWVcclxuLy8gICAgICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgICAgIHNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIoZW1haWwsICfQndC10LrQvtGA0YDQtdC60YLQvdGL0Lkg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YshJylcclxuLy8gICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IGZhbHNlXHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgICAgICBzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKGVtYWlsLCAn0J3QtdC+0LHRhdC+0LTQuNC80L4g0YPQutCw0LfQsNGC0Ywg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YshJylcclxuLy8gICAgICAgICAgICAgZm9ybVZhbGlkLmVtYWlsID0gZmFsc2VcclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgIC8vIENoZWNrIHBhc3NcclxuLy8gICAgICAgICBpZiAoZm9ybVR5cGUgIT09ICdyZWNvdmVyeScpIHtcclxuLy8gICAgICAgICAgICAgaWYgKHBhc3MudmFsdWUubGVuZ3RoIDwgOCkge1xyXG4vLyAgICAgICAgICAgICAgICAgc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlcihwYXNzLCAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INC/0LDRgNC+0LvRjC4g0JTQu9C40L3QvdCwINC/0LDRgNC+0LvRjyDQtNC+0LvQttC90LAg0LHRi9GC0Ywg0L3QtSDQvNC10L3QtdC1IDgg0YHQuNC80LLQvtC70L7QsiEnKVxyXG4vLyAgICAgICAgICAgICAgICAgZm9ybVZhbGlkLnBhc3MgPSBmYWxzZVxyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAvLyBTZW5naW5nIGZvcm0gZGF0YVxyXG4vLyAgICAgICAgIGlmIChmb3JtVmFsaWQuZW1haWwgJiYgZm9ybVZhbGlkLnBhc3MpIHtcclxuLy8gICAgICAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XHJcblxyXG4vLyAgICAgICAgICAgICAvLyDQntCx0Y/Qt9Cw0YLQtdC70YzQvdC+INGD0LTQsNC70LjRgtGMINC/0L7RgdC70LUg0LLQvdC10LTRgNC10L3QuNGPXHJcbi8vICAgICAgICAgICAgIGZvciAobGV0IFtuYW1lLCB2YWx1ZV0gb2YgZm9ybURhdGEpIHtcclxuLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke25hbWV9OiAke3ZhbHVlfWApO1xyXG4vLyAgICAgICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgICAgICBjb25zb2xlLmxvZygnRmV0Y2hpbmcgcmVxdWVzdCBmb3IgdXBkYXRpbmcgdXNlciBkYXRhJyk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfSkpXHJcbi8vIH1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgLy8gaW5pdEFjY291bnRGb3JtKClcclxuICAgIGluaXRUb2dnbGVWaXNpYmxlRm9ybVBhc3MoKVxyXG59KSIsIi8vIEFkZCBwcm9kdWN0IHRvIGZhdm9yaXRlc1xyXG5jb25zdCBhZGRUb0Zhdm9yaXRlc0NsaWNrSGFuZGxlciA9IChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICBjb25zdCBfdGhpcyA9IGUudGFyZ2V0XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gX3RoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpXHJcbiAgICBjb25zdCB0aXRsZSA9IF90aGlzLmRhdGFzZXQudGl0bGVcclxuICAgIGNvbnN0IG1lc3NhZ2UgPSBfdGhpcy5kYXRhc2V0Lm1lc3NhZ2VcclxuICAgIGNvbnN0IGhlYWRlckZhdm9yaXRlcyA9IGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2J1dHRvbnMtbGlua19mYXZvcml0ZXMgLmhlYWRlcl9fYnV0dG9ucy1jb3VudCcpXHJcbiAgICBjb25zdCBjdXJyZW50RmF2b3JpdGVzQ291bnQgPSBwYXJzZUludChoZWFkZXJGYXZvcml0ZXMuaW5uZXJUZXh0KVxyXG5cclxuICAgIGlmICghaXNTZWxlY3RlZCkge1xyXG4gICAgICAgIF90aGlzLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICBoZWFkZXJGYXZvcml0ZXMuaW5uZXJUZXh0ID0gY3VycmVudEZhdm9yaXRlc0NvdW50ICsgMVxyXG4gICAgICAgIGhlYWRlckZhdm9yaXRlcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBoZWFkZXJGYXZvcml0ZXMuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKSwgMTAwMClcclxuXHJcbiAgICAgICAgc2hvd01vZGFsTXNnKHRpdGxlLCBtZXNzYWdlKVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCfQl9C00LXRgdGMINC90LDQtNC+INCx0YPQtNC10YIg0L3QsNC/0LjRgdCw0YLRjCDQsNGB0LjQvdGF0YDQvtC90L3Ri9C5INC30LDQv9GA0L7RgSDQtNC+0LHQsNCy0LvQtdC90LjRjyDRgtC+0LLQsNGA0LAg0LIg0LjQt9Cx0YDQsNC90L3Ri9C1Jyk7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgX3RoaXMuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxyXG4gICAgaGVhZGVyRmF2b3JpdGVzLmlubmVyVGV4dCA9IGN1cnJlbnRGYXZvcml0ZXNDb3VudCAtIDFcclxuICAgIC8vIGNvbnNvbGUuZXJyb3IoJ0FzeW5jIHF1ZXJ5IHRvIERFTEVURSBzZWxlY3RlZCBwcm9kdWN0IGZyb20gRmF2b3JpdGVzJyk7XHJcbn1cclxuXHJcbmNvbnN0IGluaXRBZGRUb0Zhdm9yaXRlcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9kdWN0LWl0ZW1fX2Zhdm9yaXRlcycpKVxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChidG4gPT4gYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWRkVG9GYXZvcml0ZXNDbGlja0hhbmRsZXIpKVxyXG59XHJcblxyXG4vLyBBZGQgcHJvZHVjdCB0byBjYXJ0XHJcbmNvbnN0IGFkZFRvQ2FydENsaWNrSGFuZGxlciA9IChlKSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICBjb25zdCBfdGhpcyA9IGUudGFyZ2V0XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gX3RoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdzZWxlY3RlZCcpXHJcbiAgICBjb25zdCB0aXRsZSA9IF90aGlzLmRhdGFzZXQudGl0bGVcclxuICAgIGNvbnN0IG1lc3NhZ2UgPSBfdGhpcy5kYXRhc2V0Lm1lc3NhZ2VcclxuXHJcbiAgICBpZiAoIWlzU2VsZWN0ZWQpIHtcclxuICAgICAgICBfdGhpcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgc2hvd01vZGFsTXNnKHRpdGxlLCBtZXNzYWdlKVxyXG5cclxuICAgICAgICAvLyBQdXNoIGN1cnJlbnQgcHJvZHVjdCB0byBDYXJ0IEdsb2JhbCBPYmplY3QgKHdpbmRvdy5DQVJUKVxyXG4gICAgICAgIHdpbmRvdy5hZGRQcm9kdWN0VG9DYXJ0KHsgYXJ0OiBfdGhpcy5kYXRhc2V0LnByb2R1Y3RJZCwgY291bnQ6IDEgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgX3RoaXMuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxyXG4gICAgc2hvd01vZGFsTXNnKHRpdGxlLCAn0KPQtNCw0LvQtdC9INC40Lcg0LrQvtGA0LfQuNC90YsnKVxyXG5cclxuICAgIC8vIFJlbW92ZSBjdXJyZW50IHByb2R1Y3QgZnJvbSBDYXJ0IEdsb2JhbCBPYmplY3QgKHdpbmRvdy5DQVJUKVxyXG4gICAgd2luZG93LnJlbW92ZVByb2R1Y3RGcm9tQ2FydCh7IGFydDogX3RoaXMuZGF0YXNldC5wcm9kdWN0SWQsIGNvdW50OiAxIH0pXHJcbn1cclxuY29uc3QgaW5pdEFkZFRvQ2FydCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9kdWN0LWl0ZW1fX2NhcnQnKSlcclxuXHJcbiAgICBidG5zLmZvckVhY2goYnRuID0+IGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZFRvQ2FydENsaWNrSGFuZGxlcikpXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaW5pdEFkZFRvRmF2b3JpdGVzKClcclxuICAgIGluaXRBZGRUb0NhcnQoKVxyXG59KSIsIi8vIEZpbHRlcnNcclxuY29uc3Qgc2hvd05vRmlsdGVyTXNnID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcblxyXG5cclxuICAgIGNvbnN0IG1zZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb25fX21zZ1wiKTtcclxuXHJcbiAgICBpZiAoIW1zZykgcmV0dXJuO1xyXG4gICAgbXNnLmNsYXNzTGlzdC5hZGQoXCJkaXNwbGF5XCIpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiBtc2cuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIiksIDEwMCk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgaGlkZU5vRmlsdGVyTXNnID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBtc2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRlc2NyaXB0aW9uX19tc2dcIik7XHJcblxyXG4gICAgaWYgKCFtc2cpIHJldHVybjtcclxuXHJcbiAgICBtc2cuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIik7XHJcbiAgICBtc2cuY2xhc3NMaXN0LnJlbW92ZShcImRpc3BsYXlcIik7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgY2hlY2tOb0ZpbHRlck1zZyA9ICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaXRlbXMgPSBkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWZpbHRlcl06bm90KC5oaWRlKVwiKTtcclxuXHJcbiAgICBpdGVtcy5sZW5ndGggPT09IDBcclxuICAgICAgPyBzaG93Tm9GaWx0ZXJNc2coKVxyXG4gICAgICA6IGhpZGVOb0ZpbHRlck1zZygpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGhpZGVGaWx0ZXJMaXN0ID0gKGZpbHRlckxpc3QpID0+IHtcclxuICB0cnkge1xyXG4gICAgZmlsdGVyTGlzdC5mb3JFYWNoKGZpbHRlciA9PiB7XHJcbiAgICAgIGZpbHRlci5jbGFzc0xpc3QucmVtb3ZlKFwiZHJvcHBlZFwiKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiBmaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKSwgMzAwKTtcclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IHNob3dGaWx0ZXJEcm9wID0gKG5vZGUpID0+IHtcclxuICB0cnkge1xyXG4gICAgbm9kZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiBub2RlLmNsYXNzTGlzdC5hZGQoXCJkcm9wcGVkXCIpLCAxMCk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgaGlkZUZpbHRlckRyb3AgPSAobm9kZSkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBmaWx0ZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnNfX2l0ZW1cIikpO1xyXG5cclxuICAgIGlmICghbm9kZSkge1xyXG4gICAgICBoaWRlRmlsdGVyTGlzdChmaWx0ZXJzKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgY2xlYW5lZEZpbHRlcnMgPSBmaWx0ZXJzLmZpbHRlcihmaWx0ZXIgPT4gZmlsdGVyICE9PSBub2RlKTtcclxuICAgIGhpZGVGaWx0ZXJMaXN0KGNsZWFuZWRGaWx0ZXJzKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBpbml0RmlsdGVyc0Ryb3AgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGZpbHRlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnNfX2xpc3QgLmZpbHRlcnNfX2l0ZW1cIikpO1xyXG5cclxuICAgIGZpbHRlcnMuZm9yRWFjaChmaWx0ZXIgPT4ge1xyXG4gICAgICBmaWx0ZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIik7XHJcblxyXG4gICAgICAgIGlmIChpc0FjdGl2ZSkge1xyXG4gICAgICAgICAgaGlkZUZpbHRlckRyb3AoKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGhpZGVGaWx0ZXJEcm9wKHRoaXMpO1xyXG4gICAgICAgIHNob3dGaWx0ZXJEcm9wKHRoaXMpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGluaXRGaWx0ZXJzUmVzZXQgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGlzUGFnZUNhdGFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2UtY2F0YWxvZ1wiKTtcclxuICAgIGlmIChpc1BhZ2VDYXRhbG9nKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgcmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZpbHRlcnNfX3Jlc2V0IC5maWx0ZXJzX19pdGVtXCIpO1xyXG5cclxuICAgIGlmICghcmVzZXQpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBmaWx0ZXJlZFNlY3Rpb24gPSBkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5zZWN0aW9uX2ZpbHRlcmVkXCIpO1xyXG5cclxuICAgIHJlc2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jbG9zZXN0KFwiLmZpbHRlcnNcIik7XHJcblxyXG4gICAgICBjb25zdCBzaWJsaW5nRmlsdGVycyA9IGNvbnRhaW5lclxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnNfX2xpc3QgLmZpbHRlcnNfX2l0ZW1cIik7XHJcblxyXG4gICAgICBjb25zdCBvcHRpb25zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnNfX29wdGlvbnNcIikpO1xyXG5cclxuICAgICAgY29uc3QgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVycyBpbnB1dFt0eXBlPVxcXCJyYWRpb1xcXCJdOm5vdChbdmFsdWU9XFxcInJlc2V0XFxcIl0pXCIpKTtcclxuXHJcbiAgICAgIGNvbnN0IGNhcmRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtZmlsdGVyXVwiKSk7XHJcblxyXG4gICAgICBjb25zdCBkZWxldGVkVHlwZXMgPSBKU09OLnBhcnNlKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1kZWxldGVkLXR5cGVzXVwiKVxyXG4gICAgICAgIC5kYXRhc2V0LmRlbGV0ZWRUeXBlcyk7XHJcblxyXG4gICAgICBoaWRlRmlsdGVyTGlzdChzaWJsaW5nRmlsdGVycyk7XHJcbiAgICAgIHNwaW5uZXIuc2hvdygpO1xyXG4gICAgICBmaWx0ZXJlZFNlY3Rpb24uZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKFwiZmlsdGVyaW5nXCIpKTtcclxuICAgICAgb3B0aW9ucy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoXCJjaGVja2VkXCIpKTsgLy8gaGlkZSByc2V0IG9wdGlvbiBidXR0b25cclxuICAgICAgY29udHJvbGxlcnMuZm9yRWFjaChjb250cm9sbGVyID0+IGNvbnRyb2xsZXIuY2hlY2tlZCA9IGZhbHNlKTsgLy8gcmVzZXQgYWxsIGlucHV0IGNvbnRyb2xsZXJzXHJcbiAgICAgIHJlc2V0QWxsQ29udHJvbGxlcnNJbkl0ZW1zKCk7XHJcbiAgICAgIHJlc2V0LmNsb3Nlc3QoXCIuZmlsdGVyc19fcmVzZXRcIikuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xyXG5cclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8gc2hvdyBoaWRkZW4gY2FyZHMgYXMgZGVsZXRlIGRhdGEtZGlzcGxheSBhdHRyaWJ1dGVzXHJcbiAgICAgICAgY2FyZHMuZm9yRWFjaChjYXJkID0+IHtcclxuICAgICAgICAgIGZvciAoY29uc3QgdHlwZSBvZiBkZWxldGVkVHlwZXMpIHtcclxuICAgICAgICAgICAgY2FyZC5yZW1vdmVBdHRyaWJ1dGUoYGRhdGEtZGlzcGxheS0ke3R5cGV9YCk7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNoZWNrRmlsdGVyZWRTZWN0aW9uKCk7XHJcbiAgICAgIH0sIDEwMDApO1xyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgY2hlY2tGaWx0ZXJlZFNlY3Rpb24gPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHNlY3Rpb25zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNlY3Rpb25fZmlsdGVyZWRcIikpO1xyXG5cclxuICAgIHNlY3Rpb25zLmZvckVhY2goc2VjdGlvbiA9PiB7XHJcbiAgICAgIGNvbnN0IGZpbHRlcmVkSXRlbXMgPSBBcnJheS5mcm9tKHNlY3Rpb24ucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWZpbHRlcl1cIikpO1xyXG4gICAgICBjb25zdCBzaG93bkl0ZW1zID0gZmlsdGVyZWRJdGVtcy5maWx0ZXIoaSA9PiAhaS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaWRlXCIpKTtcclxuXHJcbiAgICAgIGlmIChzaG93bkl0ZW1zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VjdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgc3Bpbm5lci5oaWRlKCk7XHJcbiAgICBzZWN0aW9ucy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoXCJmaWx0ZXJpbmdcIikpO1xyXG5cclxuICAgIHNob3dBbmltRWxlbWVudHMoKTtcclxuICAgIHNldEFuaW1hdGlvbkVsbXMoKTtcclxuICAgIGNoZWNrTm9GaWx0ZXJNc2coKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZSA9IChub2RlKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XHJcblxyXG4gICAgbGV0IGhhc0RhdGFEaXNwbGF5QXR0cmlidXRlID0gZmFsc2U7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XHJcblxyXG4gICAgICBpZiAoYXR0cmlidXRlTmFtZS5zdGFydHNXaXRoKFwiZGF0YS1kaXNwbGF5XCIpKSB7XHJcbiAgICAgICAgaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGhhc0RhdGFEaXNwbGF5QXR0cmlidXRlO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGNoZWNrRmlsdGVyZWRJdGVtID0gKHByb3AsIHZhbCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWZpbHRlcl1cIikpO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpdGVtcy5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGkuZGF0YXNldC5maWx0ZXIpO1xyXG4gICAgICAgIGNvbnN0IGlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGRhdGFbcHJvcF0pO1xyXG5cclxuICAgICAgICBjb25zdCBpc01hdGNoZWQgPSBpc0FycmF5XHJcbiAgICAgICAgICA/IGRhdGFbcHJvcF0uaW5jbHVkZXModmFsKVxyXG4gICAgICAgICAgOiBkYXRhW3Byb3BdID09PSB2YWw7XHJcblxyXG5cclxuICAgICAgICBpZiAoaXNNYXRjaGVkKSB7XHJcbiAgICAgICAgICBpLnJlbW92ZUF0dHJpYnV0ZShgZGF0YS1kaXNwbGF5LSR7cHJvcH1gKTtcclxuICAgICAgICAgIGlmICghaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUoaSkpIGkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGkuY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XHJcbiAgICAgICAgICBpLnNldEF0dHJpYnV0ZShgZGF0YS1kaXNwbGF5LSR7cHJvcH1gLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGVja0ZpbHRlcmVkU2VjdGlvbigpO1xyXG4gICAgICB9KTtcclxuICAgIH0sIDEwMDApO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGFjdGl2ZUNvbG9ySW5JdGVtID0gKHZhbCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLXRhcmdldC10eXBlPVwiJHt2YWx9XCJdYCkpO1xyXG5cclxuICAgIGl0ZW1zLmZvckVhY2goaSA9PiBpLmNsaWNrKCkpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGluaXRGaWx0ZXJTZWxlY3QgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGlzUGFnZUNhdGFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2UtY2F0YWxvZ1wiKTtcclxuICAgIGlmIChpc1BhZ2VDYXRhbG9nKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgY29udHJvbGxlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnMgaW5wdXRbdHlwZT1cXFwicmFkaW9cXFwiXTpub3QoW3ZhbHVlPVxcXCJyZXNldFxcXCJdKVwiKSk7XHJcblxyXG4gICAgY29uc3QgZmlsdGVyZWRTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zZWN0aW9uX2ZpbHRlcmVkXCIpO1xyXG5cclxuICAgIGNvbnN0IHJlc2V0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5maWx0ZXJzX19yZXNldFwiKTtcclxuXHJcbiAgICBjb250cm9sbGVycy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBmaWx0ZXJlZFNlY3Rpb24uZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QuYWRkKFwiZmlsdGVyaW5nXCIpKTtcclxuICAgICAgc3Bpbm5lci5zaG93KCk7XHJcbiAgICAgIGNoZWNrRmlsdGVyZWRJdGVtKHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7XHJcbiAgICAgIGFjdGl2ZUNvbG9ySW5JdGVtKHRoaXMudmFsdWUpO1xyXG4gICAgICB0aGlzLmNsb3Nlc3QoXCIuZmlsdGVyc19fb3B0aW9uc1wiKS5jbGFzc0xpc3QuYWRkKFwiY2hlY2tlZFwiKTtcclxuICAgICAgcmVzZXRCdG4uY2xhc3NMaXN0LnJlbW92ZShcImRpc2FibGVkXCIpO1xyXG4gICAgfSkpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IHJlbW92ZURhdGFGaWx0ZXJBdHRyaWJ1dGUgPSAocHJvcCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoYFtkYXRhLWRpc3BsYXktJHtwcm9wfV1gKSk7XHJcblxyXG4gICAgaXRlbXMuZm9yRWFjaChpID0+IHtcclxuICAgICAgaS5yZW1vdmVBdHRyaWJ1dGUoYGRhdGEtZGlzcGxheS0ke3Byb3B9YCk7XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBjaGVja0FsbEl0ZW1zSGFzRGlzcGxheUF0dHJpYnV0ZXMgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWZpbHRlcl1cIikpO1xyXG5cclxuICAgIGl0ZW1zLmZvckVhY2goaSA9PiB7XHJcbiAgICAgIGlmICghaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUoaSkpIHtcclxuICAgICAgICBpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlXCIpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCByZXNldEFsbENvbnRyb2xsZXJzQnlOYW1lID0gKG5hbWUpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPSR7bmFtZX1dYCkpO1xyXG4gICAgaXRlbXMuZm9yRWFjaChpID0+IGkuY2hlY2tlZCA9IGZhbHNlKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCByZXNldEFsbENvbnRyb2xsZXJzSW5JdGVtcyA9ICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgdGFiTGlzdHMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRzLXNlcmllc19fY29udHJvbHNcIikpO1xyXG5cclxuICAgIHRhYkxpc3RzLmZvckVhY2gobGlzdCA9PiB7XHJcbiAgICAgIGxpc3QucXVlcnlTZWxlY3RvcihcIi5jYXJkcy1zZXJpZXNfX3RhYlwiKT8uY2xpY2soKTtcclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGNoZWNrQWxsRmlsdGVyUmVzZXRCdG4gPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGlzQ2hlY2tlZEZpbHRlciA9IGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnNfX2xpc3QgaW5wdXQ6Y2hlY2tlZFwiKTtcclxuXHJcbiAgICBjb25zdCByZXNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlsdGVyc19fcmVzZXRcIik7XHJcblxyXG4gICAgaXNDaGVja2VkRmlsdGVyLmxlbmd0aCA9PT0gMFxyXG4gICAgICA/IHJlc2V0LmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKVxyXG4gICAgICA6IHJlc2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBpbml0UmVzZXRGaWx0ZXJQcm9wID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpc1BhZ2VDYXRhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdlLWNhdGFsb2dcIik7XHJcbiAgICBpZiAoaXNQYWdlQ2F0YWxvZykgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGNvbnRyb2xsZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzIGlucHV0W3ZhbHVlPVxcXCJyZXNldFxcXCJdXCIpKTtcclxuICAgIGNvbnN0IHNlY3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zZWN0aW9uX2ZpbHRlcmVkXCIpO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIHNlY3Rpb25zLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LmFkZChcImZpbHRlcmluZ1wiKSk7XHJcbiAgICAgIHNwaW5uZXIuc2hvdygpO1xyXG4gICAgICB0aGlzLmNsb3Nlc3QoXCIuZmlsdGVyc19fb3B0aW9uc1wiKS5jbGFzc0xpc3QucmVtb3ZlKFwiY2hlY2tlZFwiKTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHJlbW92ZURhdGFGaWx0ZXJBdHRyaWJ1dGUodGhpcy5uYW1lKTtcclxuICAgICAgICBjaGVja0FsbEl0ZW1zSGFzRGlzcGxheUF0dHJpYnV0ZXMoKTtcclxuICAgICAgICBjaGVja0ZpbHRlcmVkU2VjdGlvbigpO1xyXG4gICAgICAgIHJlc2V0QWxsQ29udHJvbGxlcnNCeU5hbWUodGhpcy5uYW1lKTtcclxuICAgICAgICByZXNldEFsbENvbnRyb2xsZXJzSW5JdGVtcygpO1xyXG4gICAgICAgIGNoZWNrQWxsRmlsdGVyUmVzZXRCdG4oKTtcclxuICAgICAgfSwgMTAwMCk7XHJcbiAgICB9KSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgaW5pdEZpbHRlcnNEcm9wKCk7XHJcbiAgICBpbml0RmlsdGVyc1Jlc2V0KCk7XHJcbiAgICBpbml0RmlsdGVyU2VsZWN0KCk7XHJcbiAgICBpbml0UmVzZXRGaWx0ZXJQcm9wKCk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59KTsiLCJjbGFzcyBJbmZvcm1lciB7XHJcbiAgICBzdGF0aWMgX2luc3RhbmNlc1xyXG5cclxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZXMoKSB7XHJcbiAgICAgICAgaWYgKCFJbmZvcm1lci5faW5zdGFuY2VzKSB7XHJcbiAgICAgICAgICAgIEluZm9ybWVyLl9pbnN0YW5jZXMgPSBuZXcgSW5mb3JtZXIoKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gSW5mb3JtZXIuX2luc3RhbmNlc1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5mb3JtZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm9ybWVyXCIpXHJcbiAgICAgICAgaWYgKCF0aGlzLmluZm9ybWVyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcItCd0LAg0YHRgtGA0LDQvdC40YbQtSDQvtGC0YHRg9GC0YHRgtCy0YPQtdGCIGh0bWwg0L7QsdC10YDRgtC60LAg0LTQu9GPINCY0L3RhNC+0YDQvNC10YDQsFwiKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbmZvcm1lckJvZHkgPSB0aGlzLmluZm9ybWVyLnF1ZXJ5U2VsZWN0b3IoXCIuaW5mb3JtZXJfX2JvZHlcIilcclxuICAgICAgICB0aGlzLmluZm9ybWVyQmFjayA9IHRoaXMuaW5mb3JtZXIucXVlcnlTZWxlY3RvcihcIi5pbmZvcm1lcl9fYmFja1wiKVxyXG4gICAgICAgIHRoaXMuaW5mb3JtZXJDbG9zZSA9IHRoaXMuaW5mb3JtZXIucXVlcnlTZWxlY3RvcihcIi5pbmZvcm1lcl9fY2xvc2VcIilcclxuICAgICAgICB0aGlzLmluaXQoKVxyXG4gICAgfVxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuW2RhdGEtdGVybV1cIikpXHJcbiAgICAgICAgdGhpcy5pbml0RXZlbnRMaXN0ZW5lcnMoKVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEV2ZW50TGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHRoaXMuYnRucy5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXN5bmMgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5nZXRJbmZvcm1hdGlvbihidG4uZGF0YXNldC50ZXJtKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRoaXMuaW5mb3JtZXJCYWNrLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmhpZGVJbmZvcm1lcigpKVxyXG4gICAgICAgIHRoaXMuaW5mb3JtZXJDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5oaWRlSW5mb3JtZXIoKSlcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBnZXRJbmZvcm1hdGlvbih0ZXJtKSB7XHJcbiAgICAgICAgd2luZG93LnNwaW5uZXIuc2hvdygpXHJcblxyXG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJ0ZXJtXCIsIHRlcm0pXHJcblxyXG4gICAgICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFID9cclxuICAgICAgICAgICAgYXdhaXQgZmV0Y2goXCJodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2luZm9ybS5odG1sXCIpIDpcclxuICAgICAgICAgICAgYXdhaXQgZmV0Y2goXCIvYXBpL3Rlcm1cIiwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICAgICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlcy50ZXh0KClcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVJbmZvcm1lckNvbnRlbnQoaHRtbClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCLQndC1INGD0LTQsNC70L7RgdGMINC/0L7Qu9GD0YfQuNGC0Ywg0LjQvdGE0L7RgNC80LDRhtC40Y4g0LTQu9GPINCi0LXRgNC80LjQvdCwXCIsIHRlcm0pXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQod2luZG93LnNwaW5uZXIuaGlkZSwgMzAwKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVJbmZvcm1lckNvbnRlbnQoZGF0YSkge1xyXG4gICAgICAgIGNvbnN0IGluZm9ybWVyQ29udGVudCA9IHRoaXMuaW5mb3JtZXIucXVlcnlTZWxlY3RvcihcIi5pbmZvcm1lcl9fY29udGVudFwiKVxyXG5cclxuICAgICAgICB3aGlsZSAoaW5mb3JtZXJDb250ZW50LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgaW5mb3JtZXJDb250ZW50LnJlbW92ZUNoaWxkKGluZm9ybWVyQ29udGVudC5maXJzdENoaWxkKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5mb3JtZXJDb250ZW50LmlubmVySFRNTCA9IGRhdGFcclxuICAgICAgICB0aGlzLnNob3dJbmZvcm1lcigpXHJcbiAgICAgICAgc2V0VGltZW91dCh3aW5kb3cuc3Bpbm5lci5oaWRlLCAzMDApXHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0luZm9ybWVyKCkge1xyXG4gICAgICAgIHRoaXMuaW5mb3JtZXIuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIilcclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5mb3JtZXJCYWNrLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpXHJcbiAgICAgICAgICAgIHRoaXMuaW5mb3JtZXJCb2R5LmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpXHJcbiAgICAgICAgfSwgMTAwKVxyXG4gICAgfVxyXG5cclxuICAgIGhpZGVJbmZvcm1lcigpIHtcclxuICAgICAgICB0aGlzLmluZm9ybWVyQmFjay5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKVxyXG4gICAgICAgIHRoaXMuaW5mb3JtZXJCb2R5LmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5pbmZvcm1lci5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKSwgNTAwKVxyXG4gICAgfVxyXG59XHJcbndpbmRvdy5pbml0SW5mb3JtZXJzID0gKCkgPT4gSW5mb3JtZXIuZ2V0SW5zdGFuY2VzKCkuaW5pdCgpXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB3aW5kb3cuaW5mb3JtZXIgPSB3aW5kb3cuaW5pdEluZm9ybWVycygpKSIsImNvbnN0IGluaXRNb2RhbCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGJ0bnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZGFsXScpKVxyXG5cclxuICAgIGlmIChidG5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5kYXRhc2V0Lm1vZGFsVGFyZ2V0XHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0gdGhpcy5kYXRhc2V0Lm1vZGFsQWN0aW9uXHJcblxyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3cnOlxyXG4gICAgICAgICAgICAgICAgc2hvd01vZGFsQmFjaygpXHJcbiAgICAgICAgICAgICAgICBzaG93TW9kYWxEaWFsb2codGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3RvZ2dsZSc6XHJcbiAgICAgICAgICAgICAgICB0b2dnbGVNb2RhbERpYWxvZyh0YXJnZXQpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnY2xvc2UnOlxyXG4gICAgICAgICAgICAgICAgaGlkZU1vZGFsRGlhbG9nKClcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoaGlkZU1vZGFsQmFjaywgMjAwKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSkpXHJcbn1cclxuXHJcbmNvbnN0IHNob3dNb2RhbEJhY2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBiYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsX19iYWNrJylcclxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYm9keScpXHJcblxyXG4gICAgYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJylcclxuICAgIGJhY2suY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiBiYWNrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKSwgMTApXHJcbn1cclxuXHJcbmNvbnN0IGhpZGVNb2RhbEJhY2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBiYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsX19iYWNrJylcclxuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYm9keScpXHJcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaGVhZGVyJylcclxuXHJcbiAgICBpZiAoIWJhY2spIHJldHVyblxyXG5cclxuICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpXHJcbiAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG4gICAgaGVhZGVyLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSdcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBiYWNrLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKVxyXG4gICAgICAgIGhlYWRlci5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XHJcbiAgICB9LCAxMDApXHJcbn1cclxuXHJcbmNvbnN0IHNob3dNb2RhbERpYWxvZyA9IChpZCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZClcclxuICAgIGNvbnN0IGRpYWxvZyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2RpYWxvZycpXHJcblxyXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG4gICAgICAgIGRpYWxvZy5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgIH0sIDEwKVxyXG59XHJcblxyXG5jb25zdCBoaWRlTW9kYWxEaWFsb2cgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW9kYWwuc2hvdycpXHJcbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgZGlhbG9nID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fZGlhbG9nJylcclxuXHJcbiAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXHJcbiAgICBkaWFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRhcmdldC5jbGFzc0xpc3QuYWRkKCdoaWRlJyksIDEwMClcclxufVxyXG5cclxuY29uc3QgaW5pdENsb3NlTW9kYWwgPSAoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNPblBvcHVwTW9kYWwgPSBlLnRhcmdldC5jbG9zZXN0KCcubW9kYWxfX2RpYWxvZycpXHJcblxyXG4gICAgICAgIGlmKGlzT25Qb3B1cE1vZGFsKSByZXR1cm5cclxuXHJcbiAgICAgICAgaGlkZU1vZGFsRGlhbG9nKClcclxuICAgICAgICBzZXRUaW1lb3V0KGhpZGVNb2RhbEJhY2ssIDIwMClcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IHRvZ2dsZU1vZGFsRGlhbG9nID0gKGlkKSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxyXG4gICAgY29uc3QgZGlhbG9nID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fZGlhbG9nJylcclxuXHJcbiAgICBoaWRlTW9kYWxEaWFsb2coKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSwgMjAwKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG4gICAgICAgIGRpYWxvZy5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgIH0sIDMwMClcclxufVxyXG5cclxuY29uc3QgaW5pdFRvZ2dsZVZpc2libGVQYXNzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsX190b2dnbGUtdmlzaWJsZS1wYXNzJykpXHJcblxyXG4gICAgaWYgKGJ0bnMubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBidG5zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKVxyXG4gICAgICAgIGNvbnN0IGlzVGV4dCA9IGlucHV0LnR5cGUgPT09ICd0ZXh0J1xyXG5cclxuICAgICAgICBpbnB1dC50eXBlID0gaXNUZXh0ID8gJ3Bhc3N3b3JkJyA6ICd0ZXh0J1xyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgncGFzcy12aXNpYmxlJylcclxuICAgIH0pKVxyXG59XHJcblxyXG5jb25zdCBzaG93TW9kYWwgPSAoaWQpID0+IHtcclxuICAgIHNob3dNb2RhbEJhY2soKVxyXG4gICAgc2hvd01vZGFsRGlhbG9nKGlkKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGluaXRNb2RhbCgpXHJcbiAgICBpbml0Q2xvc2VNb2RhbCgpXHJcbiAgICBpbml0VG9nZ2xlVmlzaWJsZVBhc3MoKVxyXG59KSIsIi8vIFByb2R1Y3QgaW5mb3JtYXRpb24gc2xpZGVyXHJcbmxldCBwcm9kdWN0SW5mb1NsaWRlclxyXG5cclxuY29uc3QgaW5pdFByb2R1Y3RJbmZvU2xpZGVyID0gKCkgPT4ge1xyXG5cclxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucHJvZHVjdC1pbmZvIC5zd2lwZXInKS5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuICAgIHByb2R1Y3RJbmZvU2xpZGVyID0gbmV3IFN3aXBlcignLnByb2R1Y3QtaW5mbyAuc3dpcGVyJywge1xyXG4gICAgICAgIGxvb3A6IGZhbHNlLFxyXG4gICAgICAgIC8vIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcclxuICAgICAgICBvYnNlcnZlcjogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlUGFyZW50czogdHJ1ZSxcclxuICAgICAgICBvYnNlcnZlU2xpZGVDaGlsZHJlbjogdHJ1ZSxcclxuICAgICAgICB3YXRjaE92ZXJmbG93OiB0cnVlLFxyXG5cclxuICAgICAgICAvLyBhdXRvSGVpZ2h0OiB0cnVlLFxyXG4gICAgICAgIC8vIHNwYWNlQmV0d2VlbjogMTAsXHJcblxyXG4gICAgICAgIHNjcm9sbGJhcjoge1xyXG4gICAgICAgICAgICBlbDogJy5zd2lwZXItc2Nyb2xsYmFyJyxcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYnJlYWtwb2ludHM6IHtcclxuICAgICAgICAgICAgNTc2OiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBjaGVja1Byb2R1Y3RJbmZvU2xpZGVyID0gKCkgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gOTkxKSB7XHJcbiAgICAgICAgaWYgKHByb2R1Y3RJbmZvU2xpZGVyKSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RJbmZvU2xpZGVyLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSlcclxuICAgICAgICAgICAgcHJvZHVjdEluZm9TbGlkZXIgPSB1bmRlZmluZWRcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFwcm9kdWN0SW5mb1NsaWRlcikge1xyXG4gICAgICAgIGluaXRQcm9kdWN0SW5mb1NsaWRlcigpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgY29uc3QgaXNQcm9kdWN0UGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLXByb2R1Y3QnKVxyXG4gICAgY29uc3QgaXNBcnRpY2xlUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWFydGljbGUnKVxyXG4gICAgY29uc3QgaXNEb3RzUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLWRvdHMnKVxyXG5cclxuICAgIC8vIEluaXRpYWxpemUgSW5mbyBzbGlkZXIgb25seSBmb3IgUHJvZHVjdCwgQXJ0aWNsZSBhbmQgRG90cyBwYWdlc1xyXG4gICAgaWYgKCFpc1Byb2R1Y3RQYWdlICYmICFpc0FydGljbGVQYWdlICYmICFpc0RvdHNQYWdlKSByZXR1cm5cclxuXHJcbiAgICBjaGVja1Byb2R1Y3RJbmZvU2xpZGVyKClcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5zYWZlQ2FsbChjaGVja1Byb2R1Y3RJbmZvU2xpZGVyKVxyXG4gICAgfSlcclxufSlcclxuIiwiXHJcbmNvbnN0IHJlc2V0QWxsQ2FyZHNQaWNzID0gKG5vZGUpID0+IHtcclxuICAgIGNvbnN0IHBpY3MgPSBBcnJheS5mcm9tKG5vZGUucXVlcnlTZWxlY3RvckFsbCgnLmNhcmRzLXNlcmllc19fcGljJykpXHJcbiAgICBwaWNzLmZvckVhY2gobm9kZSA9PiBub2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKVxyXG59XHJcblxyXG5jb25zdCByZXNldEFsbENhcmRzVGFicyA9IChub2RlKSA9PiB7XHJcbiAgICBjb25zdCB0YWJzID0gQXJyYXkuZnJvbShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJkcy1zZXJpZXNfX3RhYicpKVxyXG4gICAgdGFicy5mb3JFYWNoKG5vZGUgPT4gbm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSlcclxufVxyXG5cclxuY29uc3QgZ2V0VGFyZ2V0Q2FyZHNQaWMgPSAobm9kZSwgZGF0YVRhcmdldFR5cGVWYWwpID0+IHtcclxuICAgIHJldHVybiBub2RlLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXR5cGU9JHtkYXRhVGFyZ2V0VHlwZVZhbH1dYClcclxufVxyXG5cclxuY29uc3QgaW5pdENhcmRzVGFiID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGFiQXJyID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZHMtc2VyaWVzX190YWInKSlcclxuXHJcbiAgICB0YWJBcnIuZm9yRWFjaChub2RlID0+IHtcclxuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmNsb3Nlc3QoJy5jYXJkcy1zZXJpZXNfX2l0ZW0nKVxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQaWNUeXBlID0gdGhpcy5kYXRhc2V0LnRhcmdldFR5cGVcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0UGljID0gZ2V0VGFyZ2V0Q2FyZHNQaWMocGFyZW50LCB0YXJnZXRQaWNUeXBlKVxyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGFjdGl2ZSB0YWJcclxuICAgICAgICAgICAgcmVzZXRBbGxDYXJkc1RhYnMocGFyZW50KVxyXG4gICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGFjdGl2ZSBpbWFnZVxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0UGljKSB7XHJcbiAgICAgICAgICAgICAgICByZXNldEFsbENhcmRzUGljcyhwYXJlbnQpXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRQaWMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXRDYXJkc1RhYilcclxuIiwiLy8gUHJvZHVjdCByZWNvbW1lbmRhdGlvbiBzbGlkZXJcclxubGV0IHByb2R1Y3RSZWNvbW1TbGlkZXJcclxuXHJcbmNvbnN0IGNoZWNrUmVjb21tU2xpZGVyU2Nyb2xsYmFyID0gKHN3aXBlciwgc2Nyb2xsYmFyKSA9PiB7XHJcbiAgICBpZiAoIXNjcm9sbGJhciB8fCBzY3JvbGxiYXIuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSByZXR1cm5cclxuXHJcbiAgICBjb25zdCBpc1Njcm9sbGJhckhpZGUgPSBzY3JvbGxiYXIuY2xhc3NMaXN0XHJcbiAgICAgICAgLmNvbnRhaW5zKCdzd2lwZXItc2Nyb2xsYmFyLWxvY2snKVxyXG5cclxuICAgIGlzU2Nyb2xsYmFySGlkZVxyXG4gICAgICAgID8gc3dpcGVyLmNsYXNzTGlzdC5hZGQoJ3Njcm9sbC1oaWRkZW4nKVxyXG4gICAgICAgIDogc3dpcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Njcm9sbC1oaWRkZW4nKVxyXG59XHJcblxyXG5jb25zdCBjaGVja1NsaWRlcnNCb3R0b21PZmZzZXQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzd2lwZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3dpcGVyJykpXHJcblxyXG4gICAgc3dpcGVycy5mb3JFYWNoKHN3aXBlciA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsYmFyID0gc3dpcGVyLnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXItc2Nyb2xsYmFyJylcclxuICAgICAgICBjaGVja1JlY29tbVNsaWRlclNjcm9sbGJhcihzd2lwZXIsIHNjcm9sbGJhcilcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGluaXRQcm9kdWN0UmVjb21tU2xpZGVyID0gKCkgPT4ge1xyXG5cclxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVjb21tZW5kYXRpb25fX3NsaWRlciAuc3dpcGVyJykubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBwcm9kdWN0UmVjb21tU2xpZGVyID0gbmV3IFN3aXBlcignLnJlY29tbWVuZGF0aW9uX19zbGlkZXIgLnN3aXBlcicsIHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgb2JzZXJ2ZXI6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVBhcmVudHM6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IHRydWUsXHJcbiAgICAgICAgd2F0Y2hPdmVyZmxvdzogdHJ1ZSxcclxuICAgICAgICAvLyBhdXRvSGVpZ2h0OiB0cnVlLFxyXG5cclxuICAgICAgICBzY3JvbGxiYXI6IHtcclxuICAgICAgICAgICAgZWw6ICcuc3dpcGVyLXNjcm9sbGJhcicsXHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgICAgIDU3Njoge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMixcclxuICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICA5OTE6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDMsXHJcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDEwLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAxMjAwOiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDAsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN3aXBlciA9IHRoaXMuZWxcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNjcm9sbGJhciA9IHRoaXMuc2Nyb2xsYmFyLmVsXHJcbiAgICAgICAgICAgICAgICBjaGVja1JlY29tbVNsaWRlclNjcm9sbGJhcihzd2lwZXIsIHNjcm9sbGJhcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IGNoZWNrUHJvZHVjdFJlY29tbVNsaWRlciA9ICgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDEyMDAgJiYgcHJvZHVjdFJlY29tbVNsaWRlcikge1xyXG4gICAgICAgIEFycmF5LmlzQXJyYXkocHJvZHVjdFJlY29tbVNsaWRlcilcclxuICAgICAgICAgICAgPyBwcm9kdWN0UmVjb21tU2xpZGVyLmZvckVhY2goc2xpZGVyID0+IHNsaWRlci5kZXN0cm95KHRydWUsIHRydWUpKVxyXG4gICAgICAgICAgICA6IHByb2R1Y3RSZWNvbW1TbGlkZXIuZGVzdHJveSh0cnVlLCB0cnVlKVxyXG5cclxuICAgICAgICBwcm9kdWN0UmVjb21tU2xpZGVyID0gdW5kZWZpbmVkXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFwcm9kdWN0UmVjb21tU2xpZGVyKSB7XHJcbiAgICAgICAgaW5pdFByb2R1Y3RSZWNvbW1TbGlkZXIoKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGNvbnN0IGlzUHJvZHVjdFBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1wcm9kdWN0JylcclxuICAgIGNvbnN0IGlzQXJ0aWNsZVBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1hcnRpY2xlJylcclxuICAgIGNvbnN0IGlzRG90c1BhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1kb3RzJylcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIFJlY29tbWVuZGF0aW9uIHNsaWRlciBvbmx5IGZvciBQcm9kdWN0LCBBcnRpY2xlIGFuZCBEb3RzIHBhZ2VzXHJcbiAgICBpZiAoIWlzUHJvZHVjdFBhZ2UgJiYgIWlzQXJ0aWNsZVBhZ2UgJiYgIWlzRG90c1BhZ2UpIHJldHVyblxyXG5cclxuICAgIGNoZWNrUHJvZHVjdFJlY29tbVNsaWRlcigpXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgICAgICB3aW5kb3cuc2FmZUNhbGwoY2hlY2tQcm9kdWN0UmVjb21tU2xpZGVyKVxyXG4gICAgICAgIHdpbmRvdy5zYWZlQ2FsbChjaGVja1NsaWRlcnNCb3R0b21PZmZzZXQpXHJcbiAgICB9KVxyXG59KVxyXG4iLCIvKipcclxuICogU2hvdyBhIHNtYWxsIG1lc3NhZ2Ugd2l0aCB0aXRsZSBhbmQgdGV4dCBpbiB0aGUgdG9wIHJpZ2h0IGNvcm5lciBvZiB0aGUgc2NyZWVuLlxyXG4gKiBUaGUgbWV0aG9kIGV4cGVjdHMgYXQgbGVhc3Qgb25lIHBhcmFtZXRlciBwZXIgaW5wdXQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbdGl0bGU9dW5kZWZpbmVkXSAtIFRoZSBoZWFkbGluZSBvZiB0aGUgbWVzc2FnZSBpbiBvbmUgbGluZS5cclxuICogQHBhcmFtIHtzdHJpbmd9IFttZXNzYWdlPXVuZGVmaW5lZF0gLSBPbmUgbGluZSBtZXNzYWdlIHRleHQuXHJcbiAqL1xyXG53aW5kb3cuc2hvd01vZGFsTXNnID0gZnVuY3Rpb24odGl0bGUgPSAnJywgbWVzc2FnZSA9ICcnKSB7XHJcbiAgICBpZiAoIXRpdGxlICYmICFtZXNzYWdlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlRoZXJlJ3Mgbm8gdGl0bGUgb3IgbWVzc2FnZSBmb3Igc2hvd2luZyBpbiBtb2RhbCB3aW5kb3cuXCIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aXRsZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW5jb3JyZWN0IHR5cGUgb2YgdGl0bGUuIEl0IHNob3VsZCBiZSBzdHJpbmcuXCIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBtZXNzYWdlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbmNvcnJlY3QgdHlwZSBvZiBtZXNzYWdlLiBJdCBzaG91bGQgYmUgc3RyaW5nLlwiKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21zZy1jb250YWluZXInKVxyXG4gICAgY29uc3QgW2NhcmQsIGJvZHldID0gY3JlYXRlTW9kYWxNc2dDYXJkKHRpdGxlLCBtZXNzYWdlKVxyXG5cclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjYXJkKVxyXG4gICAgY2hlY2tNb2RhbE1zZ0NvbnRhaW5lcigpXHJcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXknKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4gY2FyZC5jbGFzc0xpc3QuYWRkKCd1bmNvbGxhcHNlZCcpLCA1MClcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG4gICAgfSwgMTAwKVxyXG5cclxuICAgIGhpZGVNb2RhbE1zZyhjYXJkLCBib2R5LCA1MDAwKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja01vZGFsTXNnQ29udGFpbmVyKCkge1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbXNnLWNvbnRhaW5lcicpXHJcbiAgICBjb25zdCBpbm5lckVsbXMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsLW1zZ19fY2FyZCcpXHJcblxyXG4gICAgaW5uZXJFbG1zLmxlbmd0aCA+IDBcclxuICAgICAgICA/IGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuICAgICAgICA6IGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5JylcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTW9kYWxNc2dDYXJkKHRpdGxlLCBtZXNzYWdlKSB7XHJcbiAgICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgnbW9kYWwtbXNnX19jYXJkJylcclxuXHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtbXNnX19ib2R5JylcclxuXHJcbiAgICBjb25zdCBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpXHJcblxyXG4gICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBjb250ZW50LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW1zZ19fY29udGVudCcpXHJcblxyXG4gICAgY29uc3QgY2FwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxyXG4gICAgY2FwdGlvbi50ZXh0Q29udGVudCA9IHRpdGxlXHJcblxyXG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgdGV4dC50ZXh0Q29udGVudCA9IG1lc3NhZ2VcclxuXHJcbiAgICBpZiAodGl0bGUpIGNvbnRlbnQuYXBwZW5kQ2hpbGQoY2FwdGlvbilcclxuICAgIGlmIChtZXNzYWdlKSBjb250ZW50LmFwcGVuZENoaWxkKHRleHQpXHJcblxyXG4gICAgYm9keS5hcHBlbmRDaGlsZChpY29uKVxyXG4gICAgYm9keS5hcHBlbmRDaGlsZChjb250ZW50KVxyXG5cclxuICAgIGNhcmQuYXBwZW5kQ2hpbGQoYm9keSlcclxuXHJcbiAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGlkZU1vZGFsTXNnSGFuZGxlcilcclxuXHJcbiAgICByZXR1cm4gW2NhcmQsIGJvZHldXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZGVNb2RhbE1zZ0hhbmRsZXIoKSB7XHJcbiAgICBjb25zdCBjYXJkID0gdGhpc1xyXG4gICAgY29uc3QgYm9keSA9IGNhcmQucXVlcnlTZWxlY3RvcignLm1vZGFsLW1zZ19fYm9keScpXHJcbiAgICBoaWRlTW9kYWxNc2coY2FyZCwgYm9keSlcclxufVxyXG5cclxuZnVuY3Rpb24gaGlkZU1vZGFsTXNnKGNhcmQsIGJvZHksIHRpbWVvdXQgPSAwKSB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXHJcbiAgICB9LCB0aW1lb3V0KVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScsICdoaWRkZW4nKVxyXG4gICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgndW5jb2xsYXBzZWQnKVxyXG4gICAgfSwgdGltZW91dCArIDEwMClcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjYXJkLnJlbW92ZSgpO1xyXG4gICAgICAgIGNoZWNrTW9kYWxNc2dDb250YWluZXIoKVxyXG4gICAgfSwgdGltZW91dCArIDIwMClcclxufVxyXG4iLCJjb25zdCBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AgPSAoYnV0dG9uKSA9PiB7XHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZXHJcblxyXG4gICAgaWYgKHNjcm9sbFRvcCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbml0U2Nyb2xsVG9Ub3AgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Nyb2xsVG9Ub3AnKVxyXG5cclxuICAgIGlmICghYnV0dG9uKSByZXR1cm5cclxuXHJcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzbW9vdGhTY3JvbGxUbygwKSlcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AoYnV0dG9uKSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0U2Nyb2xsVG9Ub3AoKVxyXG59KSIsImNvbnN0IHNob3dTcGlubmVyID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgc3Bpbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJylcclxuICAgIHNwaW5uZXIuY2xhc3NMaXN0LmFkZCgnZGlzcGxheScpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHNwaW5uZXIuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpLCAxMDApXHJcbn1cclxuXHJcbmNvbnN0IGhpZGVTcGlubmVyID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgc3Bpbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJylcclxuICAgIHNwaW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHNwaW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGlzcGxheScpLCAxMDAwKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3Bpbm5lcicpKSB7XHJcbiAgICAgICAgd2luZG93LnNwaW5uZXIuc2hvdyA9IHNob3dTcGlubmVyXHJcbiAgICAgICAgd2luZG93LnNwaW5uZXIuaGlkZSA9IGhpZGVTcGlubmVyXHJcbiAgICB9XHJcbn0pIiwiIiwiLy8gT3BlbiBhbmQgY2xvc2UgbW9iaWxlIG5hdmlnYXRpb25cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcclxuICAgIGNvbnN0IG5hdkNsb3NlID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtY2xvc2UnKSlcclxuICAgIGNvbnN0IG5hdlRvZ2dsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyX19uYXYtbGlua19tZW51JylcclxuICAgIGNvbnN0IGhlYWRlck5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdicpXHJcbiAgICBjb25zdCBtb2RhbEJhY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19tb2RhbC1iYWNrJylcclxuICAgIGNvbnN0IG5hdlByb2RMaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2LWxpbmtfcHJvZHVjdCcpXHJcbiAgICBjb25zdCBuYXZJdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWl0ZW1fd2l0aC1pbm5lcicpKVxyXG4gICAgY29uc3QgbmF2TGlua3MgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1saW5rJykpXHJcbiAgICBjb25zdCBuYXZDb2xsYXBzZXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1jb2xsYXBzZScpKVxyXG5cclxuICAgIGlmICghbmF2VG9nZ2xlcikgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgdG9nZ2xlTmF2ID0gKGRpcmVjdGlvbikgPT4ge1xyXG4gICAgICAgIGlmIChkaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJylcclxuICAgICAgICAgICAgbmF2VG9nZ2xlci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICBoZWFkZXJOYXYuY2xhc3NMaXN0LmFkZCgnb3BlbicpXHJcbiAgICAgICAgICAgIC8vIG1vZGFsQmFjay5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbmF2UHJvZExpbmsuY2xpY2soKVxyXG4gICAgICAgICAgICB9LCAxMDApXHJcblxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpXHJcbiAgICAgICAgbmF2VG9nZ2xlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIGhlYWRlck5hdi5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJylcclxuICAgICAgICBtb2RhbEJhY2suY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXHJcblxyXG4gICAgICAgIGNvbGxhcHNBbGxOYXZJdGVtKClcclxuICAgIH1cclxuXHJcbiAgICAvLyBDbGljayBvbiBuYXZpZ2F0aW9uIGJ1cmdlclxyXG4gICAgbmF2VG9nZ2xlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZU5hdihmYWxzZSlcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0b2dnbGVOYXYodHJ1ZSlcclxuICAgIH0pXHJcblxyXG4gICAgLy8gQ2xpY2sgb24gbmF2aWdhdGlvbiBjbG9zZSBidXR0b25cclxuICAgIG5hdkNsb3NlLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0b2dnbGVOYXYoZmFsc2UpKVxyXG4gICAgfSlcclxuXHJcbiAgICBtb2RhbEJhY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgdG9nZ2xlTmF2KGZhbHNlKVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBPcGVuIGFuZCBjbG9zZSBOYXZpZ2F0aW9uIGl0ZW1zXHJcbiAgICBjb25zdCBjb2xsYXBzQWxsTmF2SXRlbSA9ICgpID0+IHtcclxuICAgICAgICBuYXZJdGVtcy5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wcGVkJykpXHJcbiAgICAgICAgbmF2TGlua3MuZm9yRWFjaChpID0+IGkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpXHJcbiAgICAgICAgbmF2Q29sbGFwc2VzLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0b2dnbGVOYXZJdGVtID0gKGJ0bikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gYnRuLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJylcclxuXHJcbiAgICAgICAgY29sbGFwc0FsbE5hdkl0ZW0oKVxyXG5cclxuICAgICAgICBpZiAoIWlzQWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbmF2SXRlbSA9IGJ0bi5jbG9zZXN0KCcuaGVhZGVyX19uYXYtaXRlbV93aXRoLWlubmVyJylcclxuXHJcbiAgICAgICAgICAgIGlmIChuYXZJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuYXZDb2xsYXBzZSA9IG5hdkl0ZW0ucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2LWNvbGxhcHNlJylcclxuXHJcbiAgICAgICAgICAgICAgICBuYXZJdGVtLmNsYXNzTGlzdC5hZGQoJ2Ryb3BwZWQnKVxyXG4gICAgICAgICAgICAgICAgbmF2Q29sbGFwc2UuY2xhc3NMaXN0LmFkZCgnb3BlbicpXHJcbiAgICAgICAgICAgICAgICBtb2RhbEJhY2suY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmF2TGlua3MuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdG9nZ2xlTmF2SXRlbSh0aGlzKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59KVxyXG5cclxuLy8gU2VhcmNoaW5nIGFuZCBTdGlja3kgaGVhZGVyXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgICBcclxuICAgXHJcbiAgICBcclxuICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKVxyXG4gICAgY29uc3Qgc2VhcmNoVG9nZ2xlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2J1dHRvbnMtbGlua19zZWFyY2gnKVxyXG4gICAgY29uc3Qgc2VhcmNoQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtY2xvc2UnKVxyXG4gICAgY29uc3Qgc2VhcmNoUGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gnKVxyXG4gICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtaW5wdXQnKVxyXG4gICAgY29uc3Qgc2VhcmNoUmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtcmVzZXQnKVxyXG4gICAgY29uc3Qgc2VhcmNoSGludHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtaGludHMnKVxyXG5cclxuICAgIGlmICghc2VhcmNoVG9nZ2xlcikgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgdG9nZ2xlU2VhcmNoUGFuZWwgPSAoaGlkZSA9IGZhbHNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNWaXNpYmxlID0gc2VhcmNoUGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXNpYmxlJylcclxuICAgICAgICBjb25zdCB0aW1lb3V0ID0gMTAwXHJcblxyXG4gICAgICAgIGlmICghaXNWaXNpYmxlICYmICFoaWRlKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGUnKVxyXG4gICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX3dpdGgtc2VhcmNoLXBhbmVsJylcclxuICAgICAgICAgICAgc2VhcmNoVG9nZ2xlci5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2hQYW5lbC5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgfSwgdGltZW91dClcclxuXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VhcmNoVG9nZ2xlci5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCA5OTIpIHtcclxuICAgICAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgICAgIHNlYXJjaFJlc2V0LmNsaWNrKClcclxuICAgICAgICAgICAgcmVzZXRIYW5kbGVyRm9ybUhlbHBlcnNFdmVudExpc3RlbmVycygpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZScpXHJcbiAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdoZWFkZXJfd2l0aC1zZWFyY2gtcGFuZWwnKVxyXG4gICAgICAgIH0sIDIwMClcclxuICAgIH1cclxuXHJcbiAgICBzZWFyY2hUb2dnbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKClcclxuICAgICAgICBzZWFyY2hJbnB1dC5mb2N1cygpXHJcbiAgICB9KVxyXG5cclxuICAgIHNlYXJjaENsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKClcclxuICAgIH0pXHJcblxyXG4gICAgLy8gY29uc3QgU0VBUkNIX1JFUVVFU1RfVVJMID0gJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3Mvc2VhcmNoLmpzb24nXHJcbiAgICAvLyBjb25zdCBTRUFSQ0hfUkVRVUVTVF9VUkwgPSAnaHR0cHM6Ly90ZXN0LXRlY2hub2xpZ2h0djIubWFzc2l2ZS5ydS9hcGkvcHJvZHVjdC9zZWFyY2gnXHJcblxyXG4gICAgY29uc3QgU0VBUkNIX1JFUVVFU1RfVVJMID0gJy9hcGkvcHJvZHVjdC9zZWFyY2gnXHJcbiAgICAvLyBjb25zdCBTRUFSQ0hfUkVRVUVTVF9VUkwgPSAnaHR0cHM6Ly90ZWNobm9saWdodC5ydS9hcGkvcHJvZHVjdC9zZWFyY2gnXHJcbiAgICBjb25zdCBUSFJPVFRMRV9USU1FT1VUID0gMzAwXHJcbiAgICBsZXQgc2VhcmNoUmVxdWVzdFRpbWVvdXRJZFxyXG5cclxuICAgIGNvbnN0IHNldFN0cm9uZ1RleHQgPSAoc3RyLCBxdWVyeSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChxdWVyeSwgJ2dpJylcclxuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UocmVnZXgsIGA8c3Ryb25nPiQmPC9zdHJvbmc+YClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwcmludFF1ZXJ5UmVzdWx0ID0gKGRhdGEsIHF1ZXJ5KSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCfQn9C+0LvRg9GH0LjQu9C4INC/0L7QuNGB0LrQvtCy0YPRjiDQstGL0LTQsNGH0YMnLCBkYXRhKTtcclxuXHJcbiAgICAgICAgLy8gUmVzZXQgYWxsIGNoaWxkcmVuIG5vZGVzIG9mIHNlYXJjaCBoaW50c1xyXG4gICAgICAgIHdoaWxlIChzZWFyY2hIaW50cy5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaEhpbnRzLnJlbW92ZUNoaWxkKHNlYXJjaEhpbnRzLmZpcnN0Q2hpbGQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTZXQgbGluaywgc2ltaWxhciBvciBObyBSZXN1bHRcclxuICAgICAgICBjb25zdCBsaW5rcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgbGlua3MuY2xhc3NMaXN0LmFkZCgnaGVhZGVyX19zZWFyY2gtbGlua3MnKVxyXG5cclxuICAgICAgICBjb25zdCBzaW1pbGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICBzaW1pbGFyLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl9fc2VhcmNoLXNpbWlsYXInKVxyXG5cclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgLy8gTm8gcmVzdWx0c1xyXG4gICAgICAgICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICAgICAgICAgIHNwYW4uY2xhc3NMaXN0LmFkZCgnbm8tcmVzdWx0cycpXHJcbiAgICAgICAgICAgIHNwYW4uaW5uZXJUZXh0ID0gJ9Cf0L4g0JLQsNGI0LXQvNGDINC30LDQv9GA0L7RgdGDINC90LjRh9C10LPQviDQvdC1INC90LDQudC00LXQvdC+J1xyXG4gICAgICAgICAgICBsaW5rcy5hcHBlbmRDaGlsZChzcGFuKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIExpbmtzXHJcbiAgICAgICAgICAgIGNvbnN0IGhpbnQgPSBkYXRhWzBdXHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcclxuICAgICAgICAgICAgbGluay5ocmVmID0gaGludC51cmxcclxuICAgICAgICAgICAgbGluay5pbm5lckhUTUwgPSBzZXRTdHJvbmdUZXh0KGhpbnQudGl0bGUsIHF1ZXJ5KVxyXG4gICAgICAgICAgICBsaW5rcy5hcHBlbmRDaGlsZChsaW5rKVxyXG5cclxuICAgICAgICAgICAgLy8gU2ltaWxhclxyXG4gICAgICAgICAgICBzaW1pbGFyLmlubmVySFRNTCA9ICc8aDU+0YHQvNC+0YLRgNC40YLQtSDQv9C+0YXQvtC20LjQtTwvaDU+J1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBudW0gaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bSA8IDEpIGNvbnRpbnVlXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTGlua1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGludCA9IGRhdGFbbnVtXVxyXG4gICAgICAgICAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxyXG4gICAgICAgICAgICAgICAgbGluay5ocmVmID0gaGludC51cmxcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJbWFnZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcGljU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgICAgICAgICAgcGljU3Bhbi5jbGFzc0xpc3QuYWRkKCdwaWMnKVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXHJcbiAgICAgICAgICAgICAgICBpbWcuc3JjID0gaGludC5pbWFnZVxyXG4gICAgICAgICAgICAgICAgaW1nLmFsdCA9IGhpbnQudGl0bGVcclxuICAgICAgICAgICAgICAgIHBpY1NwYW4uYXBwZW5kQ2hpbGQoaW1nKVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRleHRcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3Bhbi5jbGFzc0xpc3QuYWRkKCd0ZXh0JylcclxuICAgICAgICAgICAgICAgIHRleHRTcGFuLmlubmVySFRNTCA9IHNldFN0cm9uZ1RleHQoaGludC50aXRsZSwgcXVlcnkpXHJcblxyXG4gICAgICAgICAgICAgICAgbGluay5hcHBlbmRDaGlsZChwaWNTcGFuKVxyXG4gICAgICAgICAgICAgICAgbGluay5hcHBlbmRDaGlsZCh0ZXh0U3BhbilcclxuICAgICAgICAgICAgICAgIHNpbWlsYXIuYXBwZW5kQ2hpbGQobGluaylcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobnVtID4gNikgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VhcmNoSGludHMuYXBwZW5kQ2hpbGQobGlua3MpXHJcbiAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpXHJcblxyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgc2VhcmNoSGludHMuYXBwZW5kQ2hpbGQoc2ltaWxhcilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCd0YPQttC90L4g0YLQvtC70YzQutC+INC00LvRjyDQv9C+0LvQvdC+0LPQviDQvNC10L3RjlxyXG4gICAgICAgIC8vIHNldEhhbmRsZXJUb0hlbHBlcnMoKVxyXG5cclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCA5OTIpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZmV0Y2hTZWFyY2hpbmdEYXRhID0gYXN5bmMgKHF1ZXJ5KSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goU0VBUkNIX1JFUVVFU1RfVVJMICsgYD9xdWVyeT0ke3F1ZXJ5fWApXHJcblxyXG4gICAgICAgICAgICBpZiAoIXJlcy5vaykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfQntGI0LjQsdC60LAg0LfQsNC/0YDQvtGB0LAg0L/QvtC40YHQutCwJylcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICAgICAgcHJpbnRRdWVyeVJlc3VsdChkYXRhLCBxdWVyeSlcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2VhcmNoSGFuZGxlckZvcm1IZWxwZXJzRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaFJlc2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHNlYXJjaFJlcXVlc3RUaW1lb3V0SWQpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VhcmNoUmVzZXQuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpXHJcblxyXG4gICAgICAgIC8vICoqKiBGZXRjaGluZyBzZWFyY2ggcmVxdWVzdHMgYW5kIHNob3cgcmVzdWx0cyAtLS0gU1RBUlRcclxuICAgICAgICBjbGVhclRpbWVvdXQoc2VhcmNoUmVxdWVzdFRpbWVvdXRJZClcclxuICAgICAgICBzZWFyY2hSZXF1ZXN0VGltZW91dElkID0gc2V0VGltZW91dChcclxuICAgICAgICAgICAgKCkgPT4gZmV0Y2hTZWFyY2hpbmdEYXRhKHRoaXMudmFsdWUpLFxyXG4gICAgICAgICAgICBUSFJPVFRMRV9USU1FT1VUXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC8vICoqKiBGZXRjaGluZyBzZWFyY2ggcmVxdWVzdHMgYW5kIHNob3cgcmVzdWx0cyAtLS0gRklOSVNIXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0Jywgc2VhcmNoSGFuZGxlckZvcm1IZWxwZXJzRXZlbnRMaXN0ZW5lcnMpXHJcbiAgICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHNlYXJjaEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzKVxyXG5cclxuICAgIHNlYXJjaFJlc2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgc2VhcmNoUmVzZXQuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgcmVzZXRIYW5kbGVyRm9ybUhlbHBlcnNFdmVudExpc3RlbmVycygpXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJylcclxuICAgIH0pXHJcblxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fc2VhcmNoLWZvcm0nKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBlID0+IHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgbGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1saW5rcyBhJyk/LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xyXG4gICAgICAgICAgICBpZiAobGluayAmJiBsaW5rICE9PSBcIiNcIikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFsaW5rLnN0YXJ0c1dpdGgoJ2h0dHAnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8v0L/RgNC40LLQvtC00LjQvCDQuiDQsNCx0YHQvtC70Y7RgtC90L7QvNGDINC/0YPRgtC4XHJcbiAgICAgICAgICAgICAgICAgICAgbGluayA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBgJHtsaW5rfWA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGxpbmspXHJcbiAgICAgICAgICAgICAgICB1cmwuc2VhcmNoUGFyYW1zLnNldCgnc2VhcmNoJywgc2VhcmNoSW5wdXQudmFsdWUpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh1cmwuaHJlZilcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsLmhyZWZcclxuICAgICAgICAgICAgICAgIH0sIDUwMClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvcilcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNTZWFyY2hUb2dnbGUgPSBlLnRhcmdldFxyXG4gICAgICAgICAgICAuY2xvc2VzdCgnLmhlYWRlcl9fYnV0dG9ucy1saW5rX3NlYXJjaCcpXHJcblxyXG4gICAgICAgIGNvbnN0IGlzU2VhcmNoUGFuZWwgPSBlLnRhcmdldFxyXG4gICAgICAgICAgICAuY2xvc2VzdCgnLmhlYWRlcl9fc2VhcmNoJylcclxuXHJcbiAgICAgICAgY29uc3QgaXNUYWNoRGV2aWNlID0gd2luZG93LmlubmVyV2lkdGggPCA5OTJcclxuXHJcbiAgICAgICAgaWYgKCFpc1RhY2hEZXZpY2UgJiYgIWlzU2VhcmNoUGFuZWwgJiYgIWlzU2VhcmNoVG9nZ2xlKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKHRydWUpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBTZXQgaGVscCB0ZXh0IGZyb20gaGVscGVyIGJ1dHRvbiB1bmRlciB0aGUgc2VhcmNoIGlucHV0IHRvIHRoZSBzZWFyY2ggdmFsdWVcclxuICAgIGNvbnN0IHJlcXVlc3RDb21wbGV0aW9uID0gKGUpID0+IHtcclxuICAgICAgICBjb25zdCBhZGRpdGlvblZhbHVlID0gZS50YXJnZXQuaW5uZXJUZXh0XHJcbiAgICAgICAgc2VhcmNoSW5wdXQudmFsdWUgPSBgJHtzZWFyY2hJbnB1dC52YWx1ZX0gJHthZGRpdGlvblZhbHVlfWBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzZXRIYW5kbGVyVG9IZWxwZXJzID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlYXJjaEhlbHBlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19zZWFyY2gtaGVscHMgc3BhbicpKVxyXG5cclxuICAgICAgICBzZWFyY2hIZWxwZXJzLmZvckVhY2goYnRuID0+IGJ0blxyXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXF1ZXN0Q29tcGxldGlvbikpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzZXRIYW5kbGVyRm9ybUhlbHBlcnNFdmVudExpc3RlbmVycyA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBzZWFyY2hIZWxwZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fc2VhcmNoLWhlbHBzIHNwYW4nKSlcclxuXHJcbiAgICAgICAgc2VhcmNoSGVscGVycy5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgICAgIGJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHJlcXVlc3RDb21wbGV0aW9uKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy8gU3RpY2t5IGhlYWRlclxyXG4gICAgbGV0IGJlZm9yZVNjcm9sbFRvcCA9IDBcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVhZGVyXCIpXHJcbiAgICAgICAgY29uc3QgaGVhZGVySGVpZ2h0ID0gaGVhZGVyLmNsaWVudEhlaWdodFxyXG4gICAgICAgIGNvbnN0IGRlbGF5ID0gJy43cydcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRTY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWVxyXG5cclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiA5OTEpIHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTY3JvbGxUb3AgPiB3aW5kb3dIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdjb21wcmVzc2VkJylcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdjb21wcmVzc2VkJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50U2Nyb2xsVG9wID4gMTAwICYmIGN1cnJlbnRTY3JvbGxUb3AgPiBiZWZvcmVTY3JvbGxUb3ApIHtcclxuICAgICAgICAgICAgY29uc3QgaXNWaXNpYmxlU2VhcmNoID0gc2VhcmNoUGFuZWxcclxuICAgICAgICAgICAgICAgIC5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICAgICAgbGV0IGludGVydmFsSWRcclxuXHJcbiAgICAgICAgICAgIGlmIChpc1Zpc2libGVTZWFyY2gpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlci5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSBkZWxheVxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwodHJ1ZSlcclxuICAgICAgICAgICAgICAgIGludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRyYW5zaXRpb25EZWxheSA9ICcwcydcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSWQpXHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBoZWFkZXIuc3R5bGUudG9wID0gYC0ke2hlYWRlckhlaWdodH1weGBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBoZWFkZXIuc3R5bGUudG9wID0gMFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmVmb3JlU2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBUb2dnbGUgc2VhcmNoIHBhbmVsXHJcbiAgICBjb25zdCBjdXJyZW50VXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZilcclxuICAgIGlmIChjdXJyZW50VXJsLnNlYXJjaFBhcmFtcy5oYXMoJ3NlYXJjaCcpKSB7XHJcbiAgICAgICAgc2VhcmNoSW5wdXQudmFsdWUgPSBjdXJyZW50VXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3NlYXJjaCcpXHJcbiAgICAgICAgdG9nZ2xlU2VhcmNoUGFuZWwoKVxyXG4gICAgfVxyXG59KVxyXG5cclxuLy8gQ2FydCB1cGRhdGUgbGlzdGVuaW5nXHJcbmNvbnN0IHNldENhcnRVcGRhdGVMaXN0ZW5lciA9ICgpID0+IHtcclxuICAgIGNvbnN0IGNhcnRQcm9kdWN0Q291bnROb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NhcnRQcm9kdWN0Q291bnQnKVxyXG5cclxuICAgIGlmICghY2FydFByb2R1Y3RDb3VudE5vZGUpIHJldHVyblxyXG5cclxuICAgIGNhcnRQcm9kdWN0Q291bnROb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NhcnRVcGRhdGVFdmVudCcsIGZ1bmN0aW9uIChlKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RzID0gd2luZG93LkNBUlQucHJvZHVjdHNcclxuICAgICAgICBsZXQgcHJvZHVjdENvdW50ID0gMFxyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZXJhdG9yIG9mIHByb2R1Y3RzKSB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RDb3VudCArPSBpdGVyYXRvci5jb3VudFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FydFByb2R1Y3RDb3VudE5vZGUuaW5uZXJUZXh0ID0gcHJvZHVjdENvdW50XHJcbiAgICAgICAgY2FydFByb2R1Y3RDb3VudE5vZGUuZGF0YXNldC5jb3VudCA9IHByb2R1Y3RDb3VudC50b1N0cmluZygpXHJcbiAgICAgICAgY2FydFByb2R1Y3RDb3VudE5vZGUuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2FydFByb2R1Y3RDb3VudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKSwgMTAwMClcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coZS5kZXRhaWwubWVzc2FnZSlcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgc2V0Q2FydFVwZGF0ZUxpc3RlbmVyKVxyXG5cclxuLy8gT3BlbiBhbmQgY2xvc2Ugc3ViTGlzdHNcclxuY29uc3QgdG9nZ2xlU3ViTmF2TGlzdHMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB0b2dnbGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWlubmVyLXRvZ2dsZScpKVxyXG5cclxuICAgIGNvbnN0IGNsb3NlQWxsVG9nZ2xlcnMgPSAoKSA9PiB7XHJcbiAgICAgICAgdG9nZ2xlcnMuZm9yRWFjaChlbCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdyYXAgPSBlbC5jbG9zZXN0KCcuaGVhZGVyX19uYXYtaW5uZXItY2FwdGlvbicpXHJcbiAgICAgICAgICAgIHdyYXAuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBlZCcpXHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb2xsYXBzZSA9IHdyYXAucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2LXN1Ymxpc3QtY29sbGFwc2UnKVxyXG4gICAgICAgICAgICBjb2xsYXBzZS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJylcclxuXHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGVycy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHdyYXAgPSBlbC5jbG9zZXN0KCcuaGVhZGVyX19uYXYtaW5uZXItY2FwdGlvbicpXHJcbiAgICAgICAgY29uc3QgY29sbGFwc2UgPSB3cmFwLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1zdWJsaXN0LWNvbGxhcHNlJylcclxuICAgICAgICBjb25zdCBpc0N1cnJlbnREcm9wcGVkID0gd3JhcC5jbGFzc0xpc3QuY29udGFpbnMoJ2Ryb3BwZWQnKVxyXG5cclxuICAgICAgICAvLyBjbG9zZUFsbFRvZ2dsZXJzKClcclxuXHJcbiAgICAgICAgLy8gVG9nZ2xlIGN1cnJlbnRcclxuICAgICAgICBpZiAoIWlzQ3VycmVudERyb3BwZWQpIHtcclxuICAgICAgICAgICAgd3JhcC5jbGFzc0xpc3QuYWRkKCdkcm9wcGVkJylcclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgY29sbGFwc2UuY2xhc3NMaXN0LmFkZCgnb3BlbicpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd3JhcC5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wcGVkJylcclxuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICAgICAgY29sbGFwc2UuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpXHJcbiAgICAgICAgfVxyXG4gICAgfSkpXHJcblxyXG4gICAgLy8gQ2xvc2UgYWxsIHN1Ym5hdiBsaXN0IG9uIG91dCBjbGlja1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICBjb25zdCBpc1RhcmdldCA9IGUudGFyZ2V0XHJcbiAgICAgICAgICAgIC5jbGFzc0xpc3RcclxuICAgICAgICAgICAgLmNvbnRhaW5zKCdoZWFkZXJfX25hdi1pbm5lci10b2dnbGUnKVxyXG5cclxuICAgICAgICBpZiAoIWlzVGFyZ2V0KSBjbG9zZUFsbFRvZ2dsZXJzKClcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgdG9nZ2xlU3ViTmF2TGlzdHMpXHJcbiIsIi8vIERlbGV0aW5nIGJsb2NraW5nIG9mIGFsbCBhbmltYXRpb24gZm9yIGZpeCBhbmltYXRpb24gYXJ0ZWZhY3RzXHJcbmNvbnN0IHJlbW92ZUFuaW1hdGlvbkJsb2NrZXIgPSAoKSA9PiB7XHJcbiAgICBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50cmFuc2l0aW9uLWJsb2NrZXInKSlcclxuICAgICAgICAuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKCd0cmFuc2l0aW9uLWJsb2NrZXInKSlcclxufVxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHJlbW92ZUFuaW1hdGlvbkJsb2NrZXIpXHJcblxyXG4vLyBCbG9ja2luZyBhbGwgYW5pbWF0aW9uIGF0IHRoZSB3aW5kb3cgcmVzaXppbmcgcHJvY2Vzc1xyXG5jb25zdCBhZGRBbmltYXRpb25CbG9ja2VyID0gKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd0cmFuc2l0aW9uLWJsb2NrZXInKVxyXG59XHJcblxyXG5sZXQgYmxvY2tBbmltYXRpb25UaW1lclxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xyXG4gICAgY2xlYXJUaW1lb3V0KGJsb2NrQW5pbWF0aW9uVGltZXIpXHJcbiAgICB3aW5kb3cuc2FmZUNhbGwoYWRkQW5pbWF0aW9uQmxvY2tlcilcclxuXHJcbiAgICBibG9ja0FuaW1hdGlvblRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LnNhZmVDYWxsKHJlbW92ZUFuaW1hdGlvbkJsb2NrZXIpXHJcbiAgICB9LCAzMDApXHJcbn0pXHJcblxyXG4vLyBIYW5kbGUgbGluayB3aXRoIHNtb290aCBhbmltYXRpb24gdG8gYW5jaG9yIHBsYWNlIG9uIHRoZSBwYWdlXHJcbmNvbnN0IHNtb290aExpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmXj1cIiNcIl0nKVxyXG5mb3IgKGxldCBzbW9vdGhMaW5rIG9mIHNtb290aExpbmtzKSB7XHJcbiAgICBzbW9vdGhMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgY29uc3QgaWQgPSBzbW9vdGhMaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpXHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAke2lkfWApXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldE9mZnNldCA9IHRhcmdldE5vZGUub2Zmc2V0VG9wXHJcbiAgICAgICAgICAgIGNvbnN0IGRldmljZU9mZnNldCA9IHdpbmRvdy5vdXRlcldpZHRoID4gNzY4ID8gLTEwMCA6IC0yMFxyXG5cclxuICAgICAgICAgICAgc21vb3RoU2Nyb2xsVG8odGFyZ2V0T2Zmc2V0ICsgZGV2aWNlT2Zmc2V0LCA3MDApXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlRoZXJlJ3Mgbm8gdGFyZ2V0IG5vZGUgZm9yIHNjcm9sbGluZyB0byBwbGFjZS4gVGhlIHNlbGVjdG9yIGlzbid0IGNvcnJlY3QhXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn07XHJcblxyXG4vLyBBbmltYXRpb24gaXRlbXMgd2hlbiB1c2VyIGhhcyBzY3JvbGxlZCBzY3JlZW4gdG8gcGxhY2Ugb2YgaXRlbVxyXG5jb25zdCBjaGVja0FuaW1hdGlvbkVsbXMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBhbmltYXRpb25FbG1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuYW5pbWF0aW9uLWVsZW1lbnQnKSlcclxuXHJcbiAgICByZXR1cm4gYW5pbWF0aW9uRWxtcy5sZW5ndGggPiAwXHJcbn1cclxuXHJcbmNvbnN0IHNob3dBbmltRWxlbWVudHMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBlbG1zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcuYW5pbWF0aW9uLWVsZW1lbnQnKSlcclxuXHJcbiAgICBjb25zdCBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXRcclxuICAgIGNvbnN0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxyXG4gICAgLy8gY29uc3QgcG9pbnRPZkRpc3BsYXkgPSB3aW5kb3dIZWlnaHQgLyAxLjIgLy8gZm9yIHNob3cgb24gdGhlIGhhbGYgb2YgdGhlIHNjcmVlblxyXG4gICAgY29uc3QgcG9pbnRPZkRpc3BsYXkgPSB3aW5kb3dIZWlnaHRcclxuXHJcbiAgICBlbG1zLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2VGcm9tVG9wID0gcmVjdC50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXRcclxuXHJcbiAgICAgICAgaWYgKGRpc3RhbmNlRnJvbVRvcCAtIHBvaW50T2ZEaXNwbGF5IDwgc2Nyb2xsVG9wKSB7XHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FuaW1hdGlvbi1lbGVtZW50JylcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIGlmICghY2hlY2tBbmltYXRpb25FbG1zKCkpIHtcclxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2hvd0FuaW1FbGVtZW50cylcclxuICAgIH1cclxufVxyXG5cclxuY29uc3Qgc2V0QW5pbWF0aW9uRWxtcyA9ICgpID0+IHtcclxuICAgIGlmIChjaGVja0FuaW1hdGlvbkVsbXMoKSkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzaG93QW5pbUVsZW1lbnRzKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKHNob3dBbmltRWxlbWVudHMpXHJcbiAgICB3aW5kb3cuc2FmZUNhbGwoc2V0QW5pbWF0aW9uRWxtcylcclxufSlcclxuXHJcbi8vIFBob25lIG1hc2tpbmdcclxuY29uc3QgaW5pdFBob25lc01hc2sgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBwaG9uZUlucHV0cyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnW3R5cGU9XCJ0ZWxcIl06bm90KC5jYXJ0X19jYWxjIFt0eXBlPVwidGVsXCJdKScpKVxyXG5cclxuICAgIHBob25lSW5wdXRzLmZvckVhY2gocGhvbmUgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBob25lTWFza09wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIG1hc2s6ICcrezd9ICgwMDApIDAwMC0wMC0wMCcsXHJcbiAgICAgICAgICAgIGxhenk6IHRydWUsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyQ2hhcjogJyMnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBob25lTWFzayA9IElNYXNrKFxyXG4gICAgICAgICAgICBwaG9uZSxcclxuICAgICAgICAgICAgcGhvbmVNYXNrT3B0aW9uc1xyXG4gICAgICAgIClcclxuXHJcbiAgICAgICAgcGhvbmUuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoKSA9PiBwaG9uZU1hc2sudXBkYXRlT3B0aW9ucyh7bGF6eTogZmFsc2V9KSlcclxuICAgICAgICBwaG9uZS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgKCkgPT4gcGhvbmVNYXNrLnVwZGF0ZU9wdGlvbnMoe2xhenk6IHRydWV9KSlcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKGluaXRQaG9uZXNNYXNrKVxyXG59KVxyXG5cclxuLy8gRml4aW5nIGNoYXQtMjQgd2lkZ2V0IHBvc2l0aW9uIC0tIFNUQVJUXHJcbmxldCBjaGF0MjRJbnRlcnZhbElkID0gbnVsbFxyXG5sZXQgY2hhdDI0VGltZW91dElkID0gbnVsbFxyXG5sZXQgY2hhcnQyNFN0eWxlTm9kZSA9IG51bGxcclxubGV0IGNoYXJ0MjROb2RlID0gbnVsbFxyXG5cclxuY29uc3QgZml4Q2hhdDI0V2lkZ2V0UG9zaXRpb24gPSAoKSA9PiB7XHJcbiAgICBjaGFydDI0Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NoYXQtMjQnKVxyXG5cclxuICAgIGlmICghY2hhcnQyNE5vZGUpIHJldHVyblxyXG5cclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDEwMjQgJiYgIWNoYXJ0MjRTdHlsZU5vZGUpIHtcclxuICAgICAgICBjaGFydDI0U3R5bGVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxyXG5cclxuICAgICAgICBjaGFydDI0U3R5bGVOb2RlLmlubmVySFRNTCA9IGBcclxuICAgICAgICAgICAgLnN0YXJ0QnRuLnN0YXJ0QnRuLS1vdXRzaWRlLnN0YXJ0QnRuLS1ib3R0b20ge1xyXG4gICAgICAgICAgICAgICAgYm90dG9tOiA2N3B4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC5zdGFydEJ0bi5zdGFydEJ0bi0tb3BlbiB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoNTAlKSBzY2FsZSgwLjYpICFpbXBvcnRhbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjaGFydDI0Tm9kZS5zaGFkb3dSb290LnByZXBlbmQoY2hhcnQyNFN0eWxlTm9kZSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gMTAyNCAmJiBjaGFydDI0U3R5bGVOb2RlICE9PSBudWxsKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NoYXJ0MjRTdHlsZU5vZGUnLCBjaGFydDI0U3R5bGVOb2RlKTtcclxuICAgICAgICBjaGFydDI0U3R5bGVOb2RlLnJlbW92ZSgpXHJcbiAgICAgICAgY2hhcnQyNFN0eWxlTm9kZSA9IG51bGxcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckludGVydmFsKGNoYXQyNEludGVydmFsSWQpXHJcbiAgICBjaGF0MjRJbnRlcnZhbElkID0gbnVsbFxyXG5cclxuICAgIGNsZWFyVGltZW91dChjaGF0MjRUaW1lb3V0SWQpXHJcbiAgICBjaGF0MjRUaW1lb3V0SWQgPSBudWxsXHJcbn1cclxuXHJcbmNvbnN0IGNoYXQyNFJlbmRlckxpc3RlbmVyID0gKCkgPT4ge1xyXG4gICAgY2hhdDI0SW50ZXJ2YWxJZCA9IHNldEludGVydmFsKGZpeENoYXQyNFdpZGdldFBvc2l0aW9uLCAxMDApXHJcbn1cclxuXHJcbmNvbnN0IGhhcmRSZW1vdmVDaGF0MjRSZW5kZXJMaXN0ZW5lciA9ICgpID0+IHtcclxuICAgIGNoYXQyNFRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGlmIChjaGF0MjRJbnRlcnZhbElkKSBjbGVhckludGVydmFsKGNoYXQyNEludGVydmFsSWQpXHJcbiAgICB9LCAxMDAwMClcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwoY2hhdDI0UmVuZGVyTGlzdGVuZXIpO1xyXG4gICAgd2luZG93LnNhZmVDYWxsKGhhcmRSZW1vdmVDaGF0MjRSZW5kZXJMaXN0ZW5lcik7XHJcbn0pXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgMTAyNCkge1xyXG4gICAgICAgIHdpbmRvdy5zYWZlQ2FsbChjaGF0MjRSZW5kZXJMaXN0ZW5lcilcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhcnQyNFN0eWxlTm9kZSkgY2hhcnQyNFN0eWxlTm9kZS5yZW1vdmUoKVxyXG59KVxyXG4vLyBGaXhpbmcgY2hhdC0yNCB3aWRnZXQgcG9zaXRpb24gLS0gRklOSVNIIiwiLyoqXHJcbiAqINCk0LvQsNCzLCDRg9C60LDQt9GL0LLQsNGO0YnQuNC5INC90LAg0YDQtdC20LjQvCDRgNCw0LfRgNCw0LHQvtGC0LrQuC5cclxuICogQHR5cGUge2Jvb2xlYW59XHJcbiAqXHJcbiAqINCU0LvRjyDRgdC10YDQstC10YDQsCDQstC10YDRgdGC0LrQuCDRgdC+0LHQuNGA0LDRgtGMINC4INC/0YPRiNC40YLRjCDQsiDRgNC10LbQuNC80LUgREVWX01PREUgPSB0cnVlXHJcbiAqINCd0LAg0L/RgNC+0LQg0Lgg0LTQtdCyINGB0L7QsdC40YDQsNGC0Ywg0Lgg0L/Rg9GI0LjRgtGMINCyINGA0LXQttC40LzQtSBERVZfTU9ERSA9IGZhbHNlXHJcbiAqXHJcbiAqINCSINGA0LXQttC40LzQtSBERVZfTU9ERSA9IHRydWUsINC/0YDQuCDQu9C+0LrQsNC70YzQvdC+0Lkg0YDQsNC30YDQsNCx0L7RgtC60LUsXHJcbiAqINGC0LDQutC20LUg0L3QtdC+0LHRhdC+0LTQuNC80L4g0L/RgNCw0LLQuNGC0Ywg0L/Rg9GC0Ywg0LTQviDRhNCw0LnQu9CwIG1haW4uanNcclxuICpcclxuICog0J/RgNC40LwuOiA8c2NyaXB0IHNyYz1cImh0dHA6Ly9sb2NhbGhvc3Q60L3QvtC80LXRgF/Qv9C+0YLQsC9qcy9tYWluLmpzXCIgZGVmZXI+PC9zY3JpcHQ+XHJcbiAqL1xyXG5jb25zdCBERVZfTU9ERSA9IHdpbmRvdy5NT0RFID09PSAnZGV2JyAvLyBkZXYgLSB0cnVlLCBidWlsZCAtIGZhbHNlXHJcblxyXG4vLyBJbml0IGNhcnQgY3VzdG9tIEV2ZW50XHJcbmNvbnN0IGNhcnRFdmVudCA9IG5ldyBDdXN0b21FdmVudCgnY2FydFVwZGF0ZUV2ZW50Jywge1xyXG4gICAgZGV0YWlsOiB7XHJcbiAgICAgICAgbWVzc2FnZTogJ0ZpcmVkIGNhcnQgcHJvZHVjdCB1cGRhdGVkIGN1c3RvbSBFdmVudCEnXHJcbiAgICB9LFxyXG4gICAgYnViYmxlczogZmFsc2UsXHJcbiAgICBjYW5jZWxhYmxlOiBmYWxzZVxyXG59KVxyXG5cclxuY29uc3Qgbm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YSA9IChkYXRhKSA9PiB7XHJcbiAgICBjb25zdCBwcm9kdWN0cyA9IFtdXHJcblxyXG4gICAgaWYgKGRhdGEuZG90cykge1xyXG4gICAgICAgIGRhdGEuZG90cy5mb3JFYWNoKGRvdCA9PiB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RzLnB1c2goe2FydGljbGU6IGRvdC5pZCwgY291bnQ6IGRvdC5jb3VudH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEucHJvZHVjdHMpIHtcclxuICAgICAgICBkYXRhLnByb2R1Y3RzLmZvckVhY2gocHJvZHVjdCA9PiB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RzLnB1c2goe2FydGljbGU6IHByb2R1Y3QuYXJ0aWNsZSwgY291bnQ6IHByb2R1Y3QuY291bnR9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwcm9kdWN0c1xyXG59XHJcblxyXG4vLyBNZXRob2RzIHRvIHdvcmsgd2l0aCBjYXJ0IGZvciBQUk9EVUNUU1xyXG53aW5kb3cuc2V0UHJvZHVjdFRvQ2FydCA9IGFzeW5jICh7YXJ0LCBjb3VudH0pID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5zaG93KVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YnQsNC10Lwg0YTQuNC60YHQuNGA0L7QstCw0L3QvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YLQvtCy0LDRgNCwINCyINC60L7RgNC30LjQvdC1OicsIGFydCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2FydCcsIGFydClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICBjb25zdCByZXMgPSBERVZfTU9ERVxyXG4gICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1zZXQuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9zZXQnLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YHRgtC40LvQuCDRgtC+0LLQsNGAINCyINC60L7RgNC30LjQvdC1LiDQn9C+0LvRg9GH0LjQu9C4INC+0YLQstC10YInLCBkYXRhKVxyXG5cclxuICAgICAgICByZXR1cm4gZGF0YVxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0YDQsNC30LzQtdGJ0LXQvdC40Y8g0YLQvtCy0LDRgNCwINCyINCa0L7RgNC30LjQvdC1ISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGRQcm9kdWN0VG9DYXJ0ID0gYXN5bmMgKHthcnQsIGNvdW50fSkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLnNob3cpXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ9CU0L7QsdCw0LLQu9C10L3QuNC1INGC0L7QstCw0YDQsCDQsiDQutC+0YDQt9C40L3RgzonLCBhcnQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdhcnQnLCBhcnQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICA/IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtYWRkLmpzb24nKVxyXG4gICAgICAgIDogYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvYWRkJywge21ldGhvZDogJ1BPU1QnLCBib2R5OiBmb3JtRGF0YX0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygn0JTQvtCx0LDQstC40LvQuCDRgtC+0LLQsNGAINCyINC60L7RgNC30LjQvdGDLiDQn9C+0LvRg9GH0LjQu9C4INC00LDQvdC90YvQtScsIGRhdGEpXHJcbiAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINC00L7QsdCw0LLQu9C10L3QuNGPINGC0L7QstCw0YDQsCDQsiDQmtC+0YDQt9C40L3RgyEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5yZW1vdmVQcm9kdWN0RnJvbUNhcnQgPSBhc3luYyAoe2FydCwgY291bnR9KSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuc2hvdylcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygn0KPQtNCw0LvQtdC90LjQtSDRgtC+0LLQsNGA0LAg0LjQtyDQutC+0YDQt9C40L3RizonLCBhcnQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdhcnQnLCBhcnQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICA/IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtZGVsLmpzb24nKVxyXG4gICAgICAgIDogYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvZGVsJywge21ldGhvZDogJ1BPU1QnLCBib2R5OiBmb3JtRGF0YX0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygn0KPQtNCw0LvQuNC70Lgg0YLQvtCy0LDRgCDQuNC3INC60L7RgNC30LjQvdGLLiDQn9C+0LvRg9GH0LjQu9C4INC00LDQvdC90YvQtScsIGRhdGEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDRg9C00LDQu9C10L3QuNGPINGC0L7QstCw0YDQsCDQuNC3INCa0L7RgNC30LjQvdGLISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIE1ldGhvZHMgdG8gd29yayB3aXRoIGNhcnQgZm9yIERPVFNcclxud2luZG93LnNldERvdFRvQ2FydCA9IGFzeW5jICh7aWQsIGNvdW50fSkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLnNob3cpXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ9Cg0LDQt9C80LXRidCw0LXQvCDRhNC40LrRgdC40YDQvtCy0LDQvdC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQlNC+0YLQvtCyINCyINC60L7RgNC30LjQvdC1OicsIGlkLCAnIC0gJywgY291bnQpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnaWQnLCBpZClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICBjb25zdCByZXMgPSBERVZfTU9ERVxyXG4gICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1zZXREb3QuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9zZXQnLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YHRgtC40LvQuCDQlNC+0YLRiyDQsiDQutC+0YDQt9C40L3QtS4g0J/QvtC70YPRh9C40LvQuCDQvtGC0LLQtdGCJywgZGF0YSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDRgNCw0LfQvNC10YnQtdC90LjRjyDQlNC+0YLQvtCyINCyINCa0L7RgNC30LjQvdC1ISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5hZGREb3RUb0NhcnQgPSBhc3luYyAob3JkZXIpID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5zaG93KVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCfQlNC+0LHQsNCy0LvQtdC90LjQtSDQtNC+0YLQsCDQsiDQutC+0YDQt9C40L3Rgy4g0J7RgtC/0YDQsNCy0LvRj9C10Lwg0LTQsNC90L3Ri9C1OicsIG9yZGVyKVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LWFkZERvdC5qc29uJylcclxuICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2FkZERvdCcsIHttZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkob3JkZXIpfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcbiAgICAgICAgd2luZG93LnNob3dNb2RhbE1zZyhcItCU0L7QsdCw0LLQuNC70Lgg0JTQvtGCINCyINC60L7RgNC30LjQvdGDLiDQn9C+0LvRg9GH0LjQu9C4INC00LDQvdC90YvQtVwiLCBkYXRhKVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDQtNC+0LHQsNCy0LvQtdC90LjRjyDQlNC+0YLQsCDQsiDQmtC+0YDQt9C40L3RgyEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cucmVtb3ZlRG90RnJvbUNhcnQgPSBhc3luYyAoe2lkLCBjb3VudH0pID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5zaG93KVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCfQo9C00LDQu9C10L3QuNC1INCU0L7RgtCwINC40Lcg0LrQvtGA0LfQuNC90Ys6JywgaWQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdpZCcsIGlkKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdjb3VudCcsIGNvdW50KVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LWRlbERvdC5qc29uJylcclxuICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2RlbERvdCcsIHttZXRob2Q6ICdQT1NUJywgYm9keTogZm9ybURhdGF9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ9Cj0LTQsNC70LjQu9C4IERvdCDQuNC3INC60L7RgNC30LjQvdGLLiDQn9C+0LvRg9GH0LjQu9C4INC00LDQvdC90YvQtScsIGRhdGEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDRg9C00LDQu9C10L3QuNGPINCU0L7RgtCwINC40Lcg0JrQvtGA0LfQuNC90YshINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vIENhcnQgUHJveHlcclxuY29uc3QgY2FydEdldCA9ICh0YXJnZXQsIHByb3ApID0+IHtcclxuICAgIHJldHVybiB0YXJnZXRbcHJvcF1cclxufVxyXG5cclxuY29uc3QgY2FydFNldCA9ICh0YXJnZXQsIHByb3AsIHZhbCkgPT4ge1xyXG5cclxuXHJcbiAgICBpZiAocHJvcCA9PT0gJ3Byb2R1Y3RzJykge1xyXG4gICAgICAgIC8vINCf0YDQvtCy0LXRgNGM0YLQtSwg0L7RgtC70LjRh9Cw0LXRgtGB0Y8g0LvQuCDQvdC+0LLQvtC1INC30L3QsNGH0LXQvdC40LUg0L7RgiDRgdGC0LDRgNC+0LPQviDQt9C90LDRh9C10L3QuNGPLlxyXG4gICAgICAgIGNvbnN0IGlzX3NhbWUgPSAodGFyZ2V0LnByb2R1Y3RzLmxlbmd0aCA9PT0gdmFsLmxlbmd0aCkgJiYgdGFyZ2V0LnByb2R1Y3RzLmV2ZXJ5KFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZWxlbWVudCwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LmFydGljbGUgPT09IHZhbFtpbmRleF0uYXJ0aWNsZSAmJiBlbGVtZW50LmNvdW50ID09PSB2YWxbaW5kZXhdLmNvdW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAoIWlzX3NhbWUpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1NFVFRJTkcnKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RhcmdldCcsIHRhcmdldCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdwcm9wJywgcHJvcCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd2YWwnLCB2YWwpO1xyXG5cclxuICAgICAgICAgICAgdGFyZ2V0LnByb2R1Y3RzID0gWy4uLnZhbF07XHJcbiAgICAgICAgICAgIGNhcnRFdmVudC5kZXRhaWwucHJvZHVjdHMgPSB0YXJnZXQucHJvZHVjdHM7XHJcbiAgICAgICAgICAgIC8vIERpc3BhdGNoaW5nIGN1c3RvbSBjYXJ0IHVwZGF0ZSBFdmVudFxyXG4gICAgICAgICAgICBjb25zdCBjYXJ0UHJvZHVjdENvdW50Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2FydFByb2R1Y3RDb3VudFwiKTtcclxuICAgICAgICAgICAgaWYgKGNhcnRQcm9kdWN0Q291bnROb2RlKSBjYXJ0UHJvZHVjdENvdW50Tm9kZS5kaXNwYXRjaEV2ZW50KGNhcnRFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlXHJcbn1cclxuXHJcbmNvbnN0IGluaXRDYXJ0ID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgaWYgKCF3aW5kb3cuQ0FSVCkge1xyXG5cclxuICAgICAgICBjb25zdCByZXMgPSBERVZfTU9ERVxyXG4gICAgICAgICAgICA/IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtZ2V0Lmpzb24nKVxyXG4gICAgICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2dldCcsIHttZXRob2Q6ICdQT1NUJ30pXHJcblxyXG4gICAgICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuXHJcbiAgICAgICAgICAgIHdpbmRvdy5DQVJUID0gbmV3IFByb3h5KHtcclxuICAgICAgICAgICAgICAgIHByb2R1Y3RzOiBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBjYXJ0R2V0LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBjYXJ0U2V0XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygn0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutC+0YDQt9C40L3RgyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBTVEFSVCcpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnUmVzcG9uc2UgZGF0YScsIGRhdGEpXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd3aW5kb3cuQ0FSVCcsIHdpbmRvdy5DQVJUKVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygn0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQutC+0YDQt9C40L3RgyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBGSU5JU0gnKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINC30LDQv9GA0L7RgdCwINCa0L7RgNC30LjQvdGLISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXRDYXJ0KVxyXG5cclxuLy8gc2V0VGltZW91dCgoKSA9PiB7XHJcbi8vICAgICAvLyDQvtGC0LrQu9Cw0LTRi9Cy0LDQtdC8INC90LAgMSDQvNC40L3Rg9GC0YNcclxuLy8gICAgIHdpbmRvdy5jYXJ0VXBkYXRlSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChhc3luYyAoKSA9PiB7XHJcbi8vICAgICAgICAgaWYgKHdpbmRvdy5DQVJUICE9PSB1bmRlZmluZWQgJiYgIURFVl9NT0RFKSB7XHJcbi8vICAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2dldCcsIHttZXRob2Q6ICdQT1NUJ30pXHJcbi8vICAgICAgICAgICAgIGlmIChyZXMub2spIHtcclxuLy8gICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbi8vICAgICAgICAgICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfSwgMzAwMDApXHJcbi8vIH0sIDYwMDAwKSJdfQ==
