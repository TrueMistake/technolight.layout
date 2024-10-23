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
                clearModalVideo()
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

const clearModalVideo = () => {
    const modal = document.querySelector('#modalVideo')
    if (modal) {
        modal.querySelector('.modal__title').innerHTML = ''
        modal.querySelector('.modal__video').innerHTML = ''
    }
}

const initCloseModal = () => {
    document.addEventListener('click', (e) => {
        const isOnPopupModal = e.target.closest('.modal__dialog')
        const downloadTablePreview = e.target.closest('.download__table-preview');

        if(isOnPopupModal) return
        if(downloadTablePreview) return

        hideModalDialog()
        clearModalVideo()
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

const insertVideoIntoTarget = (videoUrl, targetSelector) => {
    const videoId = videoUrl.split('/').filter(Boolean).pop();
    const embedLink = `https://rutube.ru/play/embed/${videoId}/`
    const videoElement = document.createElement('iframe');
    videoElement.src = embedLink;
    videoElement.frameBorder = 0;
    videoElement.allow = 'clipboard-write; autoplay';
    videoElement.setAttribute('webkitAllowFullScreen', '');
    videoElement.setAttribute('mozallowfullscreen', '');
    videoElement.setAttribute('allowFullScreen', '');

    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
        targetElement.appendChild(videoElement);
    } else {
        console.error('Элемент с указанным селектором не найден.');
    }
}


window.addEventListener('load', () => {
    initModal()
    initCloseModal()
    initToggleVisiblePass()

    document.addEventListener('click', function (event) {
        const downloadTablePreview = event.target.closest('.download__table-preview');
        if (downloadTablePreview) {
            showModalBack();

            const urlVideo = downloadTablePreview.dataset.video;
            const body = document.querySelector('#body');
            body.classList.add('modal-open');

            const modalVideo = document.querySelector('#modalVideo');
            modalVideo.classList.remove('hide');
            modalVideo.classList.add('show');

            modalVideo.querySelector('.modal__title').innerHTML = downloadTablePreview.querySelector('img').getAttribute('alt');

            insertVideoIntoTarget(urlVideo, '.modal__video');
        }
    });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsZWFyUGhvbmUuanMiLCJkZWJvdW5jZS5qcyIsImRvd25sb2FkRmlsZS5qcyIsImV2ZW50LmpzIiwiZm9ybWF0TnVtYmVyLmpzIiwiZ2V0VXJsUGFyYW1ldGVyQnlOYW1lLmpzIiwic2F2ZUNhbGwuanMiLCJzbW9vdGhTY3JvbGxUby5qcyIsInRocm90dGxlLmpzIiwidmFsaWRhdGVFbWFpbC5qcyIsInZhbGlkYXRlUGhvbmUuanMiLCJhY2NvdW50LWZvcm1zL3NjcmlwdC5qcyIsImNhcmRzLXNlcmllcy9zY3JpcHQuanMiLCJmaWx0ZXJzL3NjcmlwdC5qcyIsImluZm9ybWVyL3Njcml0cC5qcyIsIm1vZGFscy9zY3JpcHQuanMiLCJjYXJkcy1pdGVtL3NjcmlwdC5qcyIsInByb2R1Y3QtaW5mby9zY3JpcHQuanMiLCJyZWNvbW1lbmRhdGlvbi9zY3JpcHQuanMiLCJzaG93LW1vZGFsLW1zZy9zY3JpcHQuanMiLCJzcGlubmVyL3NjcmlwdC5qcyIsInNjcm9sbC10by10b3Avc2NyaXB0LmpzIiwiZm9vdGVyL3NjcmlwdC5qcyIsImhlYWRlci9zY3JpcHQuanMiLCJtYWluLmpzIiwiY2FydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdlhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaGRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENsZWFyIHBob25lIG9mIHNwYWNlcywgYnJhY2tldHMsXHJcbiAqIGRhc2hlcyBhbmQgcGx1cyBzaWduLiBMZWF2ZSBvbmx5IG51bWJlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwaG9uZSAtIFRoZSBwaG9uZSwgdGhhdCBuZWVkcyB0byBjbGVhci5cclxuICogQHJldHVybnMge251bWJlcn0gLSBQaG9uZSBudW1iZXIgYXMgYSBudW1iZXIgdHlwZS5cclxuICovXHJcbndpbmRvdy5jbGVhclBob25lID0gKHBob25lKSA9PiB7XHJcbiAgICByZXR1cm4gcGFyc2VJbnQocGhvbmUucmVwbGFjZSgvXFxEL2csIFwiXCIpKVxyXG59XHJcbiIsIndpbmRvdy5kZWJvdW5jZSA9IChmdW5jLCBtcykgPT4ge1xyXG4gICAgbGV0IHRpbWVvdXRJZFxyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpc1xyXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBhcmd1bWVudHNcclxuXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZClcclxuXHJcbiAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncylcclxuICAgICAgICB9LCBtcylcclxuICAgIH1cclxufVxyXG4iLCIvKipcclxuICogRG93bmxvYWRzIGEgZmlsZSBmcm9tIHRoZSBzcGVjaWZpZWQgVVJMIGFuZCB0cmlnZ2VycyBhIGRvd25sb2FkIGluIHRoZSBicm93c2VyLlxyXG4gKiBcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFRoZSBVUkwgb2YgdGhlIGZpbGUgdG8gYmUgZG93bmxvYWRlZC5cclxuICovXHJcbndpbmRvdy5kb3dubG9hZEZpbGUgPSAodXJsLCBmaWxlbmFtZT1udWxsLCBkZWZhdWx0RXh0ZW5zaW9uID0gJ2JpbicpICA9PiB7XHJcbiAgICBpZiAodXJsID09PSB1bmRlZmluZWQgfHwgdXJsID09PSBudWxsIHx8IHVybCA9PT0gXCJcIikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vINCf0L7QutCw0LfQsNGC0Ywg0YHQv9C40L3QvdC10YBcclxuICAgIGlmICh3aW5kb3cuc3Bpbm5lciAmJiB0eXBlb2Ygd2luZG93LnNwaW5uZXIuc2hvdyA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgd2luZG93LnNwaW5uZXIuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCh0L7Qt9C00LDQtdC8INC90L7QstGL0LkgWE1MSHR0cFJlcXVlc3RcclxuICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgeGhyLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcclxuICAgIHhoci5yZXNwb25zZVR5cGUgPSBcImJsb2JcIjtcclxuXHJcbiAgICAvLyDQntCx0YDQsNCx0L7RgtGH0LjQuiDQt9Cw0LLQtdGA0YjQtdC90LjRjyDQt9Cw0LPRgNGD0LfQutC4XHJcbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAvLyDQn9C+0L/Ri9GC0LrQsCDQv9C+0LvRg9GH0LjRgtGMINGA0LDRgdGI0LjRgNC10L3QuNC1INC40Lcg0LfQsNCz0L7Qu9C+0LLQutC+0LJcclxuICAgICAgICAgICAgbGV0IGV4dGVuc2lvbiA9IGRlZmF1bHRFeHRlbnNpb247XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnREaXNwb3NpdGlvbiA9IHhoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtRGlzcG9zaXRpb25cIik7XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50RGlzcG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gY29udGVudERpc3Bvc2l0aW9uLm1hdGNoKC9maWxlbmFtZT1cIj8oKC4qKVxcLiguKikpXCI/Lyk7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2hbMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpbGVuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gbWF0Y2hbMl07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbiA9IG1hdGNoWzNdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDQodC+0LfQtNCw0LXQvCBVUkwg0LTQu9GPINC30LDQs9GA0YPQttC10L3QvdC+0LPQviDRhNCw0LnQu9CwXHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2JVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHhoci5yZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAvLyDQodC+0LfQtNCw0LXQvCDQstGA0LXQvNC10L3QvdGL0Lkg0Y3Qu9C10LzQtdC90YIgPGE+INC00LvRjyDRgdC60LDRh9C40LLQsNC90LjRjyDRhNCw0LnQu9CwXHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgICAgICAgICAgYS5ocmVmID0gYmxvYlVybDtcclxuICAgICAgICAgICAgYS5kb3dubG9hZCA9IGAke2ZpbGVuYW1lfS4ke2V4dGVuc2lvbn1gOyAvLyDQo9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDQuNC80Y8g0YTQsNC50LvQsCDRgSDRgNCw0YHRiNC40YDQtdC90LjQtdC8XHJcblxyXG4gICAgICAgICAgICAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0Y3Qu9C10LzQtdC90YIg0LIgRE9NINC4INC40L3QuNGG0LjQuNGA0YPQtdC8INGB0LrQsNGH0LjQstCw0L3QuNC1XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgIGEuY2xpY2soKTtcclxuXHJcbiAgICAgICAgICAgIC8vINCj0LTQsNC70Y/QtdC8INGN0LvQtdC80LXQvdGCINC40LcgRE9NXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSk7XHJcblxyXG4gICAgICAgICAgICAvLyDQntGB0LLQvtCx0L7QttC00LDQtdC8IFVSTCDQvtCx0YrQtdC60YLQsFxyXG4gICAgICAgICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKGJsb2JVcmwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0KHQutGA0YvRgtGMINGB0L/QuNC90L3QtdGAXHJcbiAgICAgICAgaWYgKHdpbmRvdy5zcGlubmVyICYmIHR5cGVvZiB3aW5kb3cuc3Bpbm5lci5oaWRlID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgd2luZG93LnNwaW5uZXIuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8g0J7QsdGA0LDQsdC+0YLRh9C40Log0L7RiNC40LHQvtC6XHJcbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCLQntGI0LjQsdC60LAg0L/RgNC4INC30LDQs9GA0YPQt9C60LUg0YTQsNC50LvQsFwiKTtcclxuXHJcbiAgICAgICAgLy8g0KHQutGA0YvRgtGMINGB0L/QuNC90L3QtdGAINCyINGB0LvRg9GH0LDQtSDQvtGI0LjQsdC60LhcclxuICAgICAgICBpZiAod2luZG93LnNwaW5uZXIgJiYgdHlwZW9mIHdpbmRvdy5zcGlubmVyLmhpZGUgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICB3aW5kb3cuc3Bpbm5lci5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCDQt9Cw0L/RgNC+0YFcclxuICAgIHhoci5zZW5kKCk7XHJcbn0iLCJ3aW5kb3cuY3VzdG9tRXZlbnQgPSB7XHJcbiAgb246IChldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spID0+IHtcclxuICAgIHdpbmRvdy5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjayk7XHJcbiAgfSxcclxuICBvZmY6IChldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spID0+IHtcclxuICAgIHdpbmRvdy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjayk7XHJcbiAgfSxcclxuICBvbmNlOiAoZXZlbnROYW1lLCBldmVudENhbGxiYWNrKSA9PiB7XHJcbiAgICBjb25zdCBoYW5kbGVyID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgIGV2ZW50Q2FsbGJhY2soZXZlbnQpO1xyXG4gICAgICB0aGlzLm9mZihldmVudE5hbWUsIGhhbmRsZXIpO1xyXG4gICAgfTtcclxuICAgIHRoaXMub24oZXZlbnROYW1lLCBoYW5kbGVyKTtcclxuICB9LFxyXG4gIGVtaXQ6IChldmVudE5hbWUsIGV2ZW50RGF0YSkgPT4ge1xyXG4gICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XHJcbiAgICAgIGRldGFpbDogZXZlbnREYXRhLFxyXG4gICAgICBidWJibGVzOiBmYWxzZSxcclxuICAgICAgY2FuY2VsYWJsZTogZmFsc2VcclxuICAgIH0pO1xyXG4gICAgd2luZG93LmRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgcmV0dXJuIGV2ZW50O1xyXG4gIH1cclxufTtcclxuIiwiLyoqXHJcbiAqIEZvcm1hdHRpbmcgbnVtYmVyIHRvIHRoZSBsb2NhbCB2YWx1ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlcn0gbnVtYmVyIC0gVmFsdWUgZm9yIGZvcm1hdHRpbmcuXHJcbiAqL1xyXG5cclxud2luZG93LmZvcm1hdE51bWJlciA9IChudW1iZXIpID0+IHtcclxuICAgIGNvbnN0IHZhbHVlID0gcGFyc2VJbnQobnVtYmVyLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxzL2csIFwiXCIpKVxyXG4gICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgXCIgXCIpO1xyXG59XHJcbiIsIi8qKlxyXG4gKiBHZXR0aW5nIGdldCBwYXJhbWV0ZXIgZnJvbSB0aGUgdXJsXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNlYXJjaCBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbdXJsXSAtIFRoZSBVUkwgYWRkcmVzcy4gSWYgdGhpcyBwYXJhbWV0ZXIgaXMgbm90IHBhc3NlZCwgdGhlbiB0aGUgc2VhcmNoLCBieSBkZWZhdWx0LCB3aWxsIG9jY3VyIGluIHRoZSBjdXJyZW50IFVSTC5cclxuICovXHJcbndpbmRvdy5nZXRVcmxQYXJhbWV0ZXJCeU5hbWUgPSBmdW5jdGlvbihuYW1lLCB1cmwpIHtcclxuICAgIGlmICghbmFtZSkgcmV0dXJuXHJcblxyXG4gICAgaWYgKCF1cmwpIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXHJcblxyXG4gICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW1xcXV0vZywgXCJcXFxcJCZcIilcclxuXHJcbiAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiWz8mXVwiICsgbmFtZSArIFwiKD0oW14mI10qKXwmfCN8JClcIiksXHJcbiAgICAgICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcclxuXHJcbiAgICAgICAgaWYgKCFyZXN1bHRzKSByZXR1cm4gbnVsbFxyXG5cclxuICAgIGlmICghcmVzdWx0c1syXSkgcmV0dXJuICcnXHJcblxyXG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpXHJcbn1cclxuIiwiLyoqXHJcbiAqINCx0LXQt9C+0L/QsNGB0L3Ri9C5INCy0YvQt9C+0LIg0YTRg9C90LrRhtC40LhcclxuICogQHBhcmFtIGZuIGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7KCp8KilbXVtdfSBhcmdzXHJcbiAqL1xyXG53aW5kb3cuc2FmZUNhbGwgPSBmdW5jdGlvbihmbiwgLi4uYXJncykge1xyXG4gIHRyeSB7XHJcbiAgICBmbi5jYWxsKHRoaXMgfHwgd2luZG93LCAuLi5hcmdzKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCJbU2FmZSBDYWxsXTogXCIsIGZuLCBlKTtcclxuICB9XHJcbn07IiwiLyoqXHJcbiAqIFNtb290aGx5IHNjcm9sbHMgdGhlIHBhZ2UgdG8gdGhlIHNwZWNpZmllZCBwb3NpdGlvbi5cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIC0gVGhlIHBvc2l0aW9uIHRvIHNjcm9sbCB0by5cclxuICogQHBhcmFtIHtudW1iZXJ9IFtkdXJhdGlvbj01MDBdIC0gVGhlIGR1cmF0aW9uIG9mIHRoZSBhbmltYXRpb24gaW4gbWlsbGlzZWNvbmRzLlxyXG4gKi9cclxuZnVuY3Rpb24gc21vb3RoU2Nyb2xsVG8ocG9zaXRpb24sIGR1cmF0aW9uID0gNTAwKSB7XHJcbiAgICBjb25zdCBzdGFydFBvc2l0aW9uID0gd2luZG93LnBhZ2VZT2Zmc2V0XHJcbiAgICBjb25zdCBkaXN0YW5jZSA9IHBvc2l0aW9uIC0gc3RhcnRQb3NpdGlvblxyXG4gICAgbGV0IHN0YXJ0VGltZXN0YW1wID0gbnVsbFxyXG5cclxuICAgIGZ1bmN0aW9uIHN0ZXAodGltZXN0YW1wKSB7XHJcbiAgICAgICAgaWYgKCFzdGFydFRpbWVzdGFtcCkgc3RhcnRUaW1lc3RhbXAgPSB0aW1lc3RhbXBcclxuXHJcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSB0aW1lc3RhbXAgLSBzdGFydFRpbWVzdGFtcFxyXG4gICAgICAgIGNvbnN0IHNjcm9sbFkgPSBlYXNlSW5PdXRDdWJpYyhwcm9ncmVzcywgc3RhcnRQb3NpdGlvbiwgZGlzdGFuY2UsIGR1cmF0aW9uKVxyXG5cclxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc2Nyb2xsWSlcclxuXHJcbiAgICAgICAgaWYgKHByb2dyZXNzIDwgZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBlYXNlSW5PdXRDdWJpYyh0LCBiLCBjLCBkKSB7XHJcbiAgICAgICAgdCAvPSBkXHJcbiAgICAgICAgdC0tXHJcbiAgICAgICAgcmV0dXJuIGMgKiAodCAqIHQgKiB0ICsgMSkgKyBiXHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKVxyXG59XHJcbiIsIndpbmRvdy50aHJvdHRsZSA9IChmdW5jLCBtcykgPT4ge1xyXG4gICAgbGV0IGlzVGhyb3R0bGVkID0gZmFsc2UsXHJcbiAgICAgICAgc2F2ZWRBcmdzLFxyXG4gICAgICAgIHNhdmVkVGhpc1xyXG5cclxuICAgIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XHJcblxyXG4gICAgICAgIGlmIChpc1Rocm90dGxlZCkgeyAvLyAyXHJcbiAgICAgICAgICAgIHNhdmVkQXJncyA9IGFyZ3VtZW50c1xyXG4gICAgICAgICAgICBzYXZlZFRoaXMgPSB0aGlzXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpIC8vIDFcclxuXHJcbiAgICAgICAgaXNUaHJvdHRsZWQgPSB0cnVlXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlzVGhyb3R0bGVkID0gZmFsc2UgLy8gM1xyXG4gICAgICAgICAgICBpZiAoc2F2ZWRBcmdzKSB7XHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmFwcGx5KHNhdmVkVGhpcywgc2F2ZWRBcmdzKVxyXG4gICAgICAgICAgICAgICAgc2F2ZWRBcmdzID0gc2F2ZWRUaGlzID0gbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgbXMpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHdyYXBwZXJcclxufSIsIi8qKlxyXG4gKiBFbWFpbCBhZGRyZXNzIHZlcmlmaWNhdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwsIHRoYXQgbmVlZHMgdG8gdmFsaWRhdGluZy5cclxuICovXHJcbndpbmRvdy52YWxpZGF0ZUVtYWlsID0gKGVtYWlsKSA9PiB7XHJcbiAgICAvLyBSZWd1bGFyIGV4cHJlc3Npb24gZm9yIGVtYWlsXHJcbiAgICBjb25zdCBlbWFpbFJlZ2V4ID0gL15bXlxcc0BdK0BbXlxcc0BdK1xcLlteXFxzQF0rJC9cclxuICAgIHJldHVybiBlbWFpbFJlZ2V4LnRlc3QoZW1haWwpXHJcbn1cclxuIiwiLyoqXHJcbiAqIFBob25lIG51bWJlciB2ZXJpZmljYXRpb25cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHBob25lIC0gVGhlIHBob25lLCB0aGF0IG5lZWRzIHRvIHZhbGlkYXRpbmcuXHJcbiAqL1xyXG53aW5kb3cudmFsaWRhdGVQaG9uZSA9IChwaG9uZSkgPT4ge1xyXG4gICAgLy8gUmVndWxhciBleHByZXNzaW9uIGZvciBwaG9uZVxyXG4gICAgY29uc3QgcGhvbmVSZWdleCA9IC9eN1xcZHsxMH0kL1xyXG4gICAgcmV0dXJuIHBob25lUmVnZXgudGVzdChwaG9uZSlcclxufVxyXG4iLCJjb25zdCBpbml0VG9nZ2xlVmlzaWJsZUZvcm1QYXNzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvZ2dsZS12aXNpYmxlLXBhc3MnKSlcclxuXHJcbiAgICBpZiAoYnRucy5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpXHJcbiAgICAgICAgY29uc3QgaXNUZXh0ID0gaW5wdXQudHlwZSA9PT0gJ3RleHQnXHJcblxyXG4gICAgICAgIGlucHV0LnR5cGUgPSBpc1RleHQgPyAncGFzc3dvcmQnIDogJ3RleHQnXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QudG9nZ2xlKCdwYXNzLXZpc2libGUnKVxyXG4gICAgfSkpXHJcbn1cclxuXHJcbi8vIGNvbnN0IHJlc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlciA9IChpbnB1dE5vZGUpID0+IHtcclxuLy8gICAgIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0Tm9kZS5jbG9zZXN0KCdsYWJlbCcpXHJcbi8vICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLWVycm9yJylcclxuLy8gfVxyXG5cclxuLy8gY29uc3Qgc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlciA9IChpbnB1dE5vZGUsIGVycm9yVGV4dCkgPT4ge1xyXG4vLyAgICAgY29uc3QgY29udGFpbmVyID0gaW5wdXROb2RlLmNsb3Nlc3QoJ2xhYmVsJylcclxuLy8gICAgIGNvbnN0IG1lc3NhZ2UgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmVycm9yLW1lc3NhZ2UnKVxyXG5cclxuLy8gICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdoYXMtZXJyb3InKVxyXG4vLyAgICAgbWVzc2FnZS5pbm5lclRleHQgPSBlcnJvclRleHRcclxuXHJcbi8vICAgICBpbnB1dE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XHJcbi8vICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1lcnJvcicpXHJcbi8vICAgICB9KVxyXG4vLyB9XHJcblxyXG4vLyBjb25zdCBpbml0QWNjb3VudEZvcm0gPSAoKSA9PiB7XHJcbi8vICAgICBjb25zdCBmb3JtcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY291bnQtZm9ybV9fZm9ybScpKVxyXG4vLyAgICAgaWYgKGZvcm1zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4vLyAgICAgZm9ybXMuZm9yRWFjaChmb3JtID0+IGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4vLyAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuLy8gICAgICAgICBjb25zdCBmb3JtVmFsaWQgPSB7ZW1haWw6IHRydWUsIHBhc3M6IHRydWUsIH1cclxuLy8gICAgICAgICBjb25zdCBlbWFpbCA9IHRoaXMucXVlcnlTZWxlY3RvcignW25hbWU9XCJlbWFpbFwiXScpXHJcbi8vICAgICAgICAgY29uc3QgcGFzcyAgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwicGFzc1wiXScpXHJcbi8vICAgICAgICAgY29uc3QgZm9ybVR5cGUgPSB0aGlzLmRhdGFzZXQuZm9ybVR5cGVcclxuXHJcbi8vICAgICAgICAgcmVzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKGVtYWlsKVxyXG4vLyAgICAgICAgIGlmIChmb3JtVHlwZSAhPT0gJ3JlY292ZXJ5Jykge1xyXG4vLyAgICAgICAgICAgICByZXNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIocGFzcylcclxuLy8gICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgIC8vIENoZWNrIGVtYWlsXHJcbi8vICAgICAgICAgaWYgKGVtYWlsLnZhbHVlICE9PSAnJykge1xyXG4vLyAgICAgICAgICAgICBpZiAod2luZG93LnZhbGlkYXRlRW1haWwoZW1haWwudmFsdWUpKSB7XHJcbi8vICAgICAgICAgICAgICAgICBmb3JtVmFsaWQuZW1haWwgPSB0cnVlXHJcbi8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbi8vICAgICAgICAgICAgICAgICBzZXRFcnJvck9uQWNjb3VudEZvcm1Db250cm9sbGVyKGVtYWlsLCAn0J3QtdC60L7RgNGA0LXQutGC0L3Ri9C5INCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLIScpXHJcbi8vICAgICAgICAgICAgICAgICBmb3JtVmFsaWQuZW1haWwgPSBmYWxzZVxyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgc2V0RXJyb3JPbkFjY291bnRGb3JtQ29udHJvbGxlcihlbWFpbCwgJ9Cd0LXQvtCx0YXQvtC00LjQvNC+INGD0LrQsNC30LDRgtGMINCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLIScpXHJcbi8vICAgICAgICAgICAgIGZvcm1WYWxpZC5lbWFpbCA9IGZhbHNlXHJcbi8vICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAvLyBDaGVjayBwYXNzXHJcbi8vICAgICAgICAgaWYgKGZvcm1UeXBlICE9PSAncmVjb3ZlcnknKSB7XHJcbi8vICAgICAgICAgICAgIGlmIChwYXNzLnZhbHVlLmxlbmd0aCA8IDgpIHtcclxuLy8gICAgICAgICAgICAgICAgIHNldEVycm9yT25BY2NvdW50Rm9ybUNvbnRyb2xsZXIocGFzcywgJ9Cd0LXQutC+0YDRgNC10LrRgtC90YvQuSDQv9Cw0YDQvtC70YwuINCU0LvQuNC90L3QsCDQv9Cw0YDQvtC70Y8g0LTQvtC70LbQvdCwINCx0YvRgtGMINC90LUg0LzQtdC90LXQtSA4INGB0LjQvNCy0L7Qu9C+0LIhJylcclxuLy8gICAgICAgICAgICAgICAgIGZvcm1WYWxpZC5wYXNzID0gZmFsc2VcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgLy8gU2VuZ2luZyBmb3JtIGRhdGFcclxuLy8gICAgICAgICBpZiAoZm9ybVZhbGlkLmVtYWlsICYmIGZvcm1WYWxpZC5wYXNzKSB7XHJcbi8vICAgICAgICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xyXG5cclxuLy8gICAgICAgICAgICAgLy8g0J7QsdGP0LfQsNGC0LXQu9GM0L3QviDRg9C00LDQu9C40YLRjCDQv9C+0YHQu9C1INCy0L3QtdC00YDQtdC90LjRj1xyXG4vLyAgICAgICAgICAgICBmb3IgKGxldCBbbmFtZSwgdmFsdWVdIG9mIGZvcm1EYXRhKSB7XHJcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtuYW1lfTogJHt2YWx1ZX1gKTtcclxuLy8gICAgICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZldGNoaW5nIHJlcXVlc3QgZm9yIHVwZGF0aW5nIHVzZXIgZGF0YScpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH0pKVxyXG4vLyB9XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIC8vIGluaXRBY2NvdW50Rm9ybSgpXHJcbiAgICBpbml0VG9nZ2xlVmlzaWJsZUZvcm1QYXNzKClcclxufSkiLCJcclxuY29uc3QgcmVzZXRBbGxDYXJkc1BpY3MgPSAobm9kZSkgPT4ge1xyXG4gICAgY29uc3QgcGljcyA9IEFycmF5LmZyb20obm9kZS5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZHMtc2VyaWVzX19waWMnKSlcclxuICAgIHBpY3MuZm9yRWFjaChub2RlID0+IG5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpXHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0QWxsQ2FyZHNUYWJzID0gKG5vZGUpID0+IHtcclxuICAgIGNvbnN0IHRhYnMgPSBBcnJheS5mcm9tKG5vZGUucXVlcnlTZWxlY3RvckFsbCgnLmNhcmRzLXNlcmllc19fdGFiJykpXHJcbiAgICB0YWJzLmZvckVhY2gobm9kZSA9PiBub2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKVxyXG59XHJcblxyXG5jb25zdCBnZXRUYXJnZXRDYXJkc1BpYyA9IChub2RlLCBkYXRhVGFyZ2V0VHlwZVZhbCkgPT4ge1xyXG4gICAgcmV0dXJuIG5vZGUucXVlcnlTZWxlY3RvcihgW2RhdGEtdHlwZT0ke2RhdGFUYXJnZXRUeXBlVmFsfV1gKVxyXG59XHJcblxyXG5jb25zdCBpbml0Q2FyZHNUYWIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB0YWJBcnIgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXJkcy1zZXJpZXNfX3RhYicpKVxyXG5cclxuICAgIHRhYkFyci5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSByZXR1cm5cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuY2xvc2VzdCgnLmNhcmRzLXNlcmllc19faXRlbScpXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFBpY1R5cGUgPSB0aGlzLmRhdGFzZXQudGFyZ2V0VHlwZVxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQaWMgPSBnZXRUYXJnZXRDYXJkc1BpYyhwYXJlbnQsIHRhcmdldFBpY1R5cGUpXHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgYWN0aXZlIHRhYlxyXG4gICAgICAgICAgICByZXNldEFsbENhcmRzVGFicyhwYXJlbnQpXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuXHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgYWN0aXZlIGltYWdlXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRQaWMpIHtcclxuICAgICAgICAgICAgICAgIHJlc2V0QWxsQ2FyZHNQaWNzKHBhcmVudClcclxuICAgICAgICAgICAgICAgIHRhcmdldFBpYy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgaW5pdENhcmRzVGFiKVxyXG4iLCIvLyBGaWx0ZXJzXHJcbmNvbnN0IHNob3dOb0ZpbHRlck1zZyA9ICgpID0+IHtcclxuICB0cnkge1xyXG5cclxuXHJcbiAgICBjb25zdCBtc2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRlc2NyaXB0aW9uX19tc2dcIik7XHJcblxyXG4gICAgaWYgKCFtc2cpIHJldHVybjtcclxuICAgIG1zZy5jbGFzc0xpc3QuYWRkKFwiZGlzcGxheVwiKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gbXNnLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpLCAxMDApO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGhpZGVOb0ZpbHRlck1zZyA9ICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgbXNnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kZXNjcmlwdGlvbl9fbXNnXCIpO1xyXG5cclxuICAgIGlmICghbXNnKSByZXR1cm47XHJcblxyXG4gICAgbXNnLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xyXG4gICAgbXNnLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNwbGF5XCIpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGNoZWNrTm9GaWx0ZXJNc2cgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gZG9jdW1lbnRcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1maWx0ZXJdOm5vdCguaGlkZSlcIik7XHJcblxyXG4gICAgaXRlbXMubGVuZ3RoID09PSAwXHJcbiAgICAgID8gc2hvd05vRmlsdGVyTXNnKClcclxuICAgICAgOiBoaWRlTm9GaWx0ZXJNc2coKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBoaWRlRmlsdGVyTGlzdCA9IChmaWx0ZXJMaXN0KSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGZpbHRlckxpc3QuZm9yRWFjaChmaWx0ZXIgPT4ge1xyXG4gICAgICBmaWx0ZXIuY2xhc3NMaXN0LnJlbW92ZShcImRyb3BwZWRcIik7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gZmlsdGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIiksIDMwMCk7XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBzaG93RmlsdGVyRHJvcCA9IChub2RlKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gbm9kZS5jbGFzc0xpc3QuYWRkKFwiZHJvcHBlZFwiKSwgMTApO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGhpZGVGaWx0ZXJEcm9wID0gKG5vZGUpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgZmlsdGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzX19pdGVtXCIpKTtcclxuXHJcbiAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgaGlkZUZpbHRlckxpc3QoZmlsdGVycyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IGNsZWFuZWRGaWx0ZXJzID0gZmlsdGVycy5maWx0ZXIoZmlsdGVyID0+IGZpbHRlciAhPT0gbm9kZSk7XHJcbiAgICBoaWRlRmlsdGVyTGlzdChjbGVhbmVkRmlsdGVycyk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgaW5pdEZpbHRlcnNEcm9wID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBmaWx0ZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzX19saXN0IC5maWx0ZXJzX19pdGVtXCIpKTtcclxuXHJcbiAgICBmaWx0ZXJzLmZvckVhY2goZmlsdGVyID0+IHtcclxuICAgICAgZmlsdGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpO1xyXG5cclxuICAgICAgICBpZiAoaXNBY3RpdmUpIHtcclxuICAgICAgICAgIGhpZGVGaWx0ZXJEcm9wKCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoaWRlRmlsdGVyRHJvcCh0aGlzKTtcclxuICAgICAgICBzaG93RmlsdGVyRHJvcCh0aGlzKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBpbml0RmlsdGVyc1Jlc2V0ID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpc1BhZ2VDYXRhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdlLWNhdGFsb2dcIik7XHJcbiAgICBpZiAoaXNQYWdlQ2F0YWxvZykgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5maWx0ZXJzX19yZXNldCAuZmlsdGVyc19faXRlbVwiKTtcclxuXHJcbiAgICBpZiAoIXJlc2V0KSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgZmlsdGVyZWRTZWN0aW9uID0gZG9jdW1lbnRcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2VjdGlvbl9maWx0ZXJlZFwiKTtcclxuXHJcbiAgICByZXNldC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY2xvc2VzdChcIi5maWx0ZXJzXCIpO1xyXG5cclxuICAgICAgY29uc3Qgc2libGluZ0ZpbHRlcnMgPSBjb250YWluZXJcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzX19saXN0IC5maWx0ZXJzX19pdGVtXCIpO1xyXG5cclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzX19vcHRpb25zXCIpKTtcclxuXHJcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpbHRlcnMgaW5wdXRbdHlwZT1cXFwicmFkaW9cXFwiXTpub3QoW3ZhbHVlPVxcXCJyZXNldFxcXCJdKVwiKSk7XHJcblxyXG4gICAgICBjb25zdCBjYXJkcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWZpbHRlcl1cIikpO1xyXG5cclxuICAgICAgY29uc3QgZGVsZXRlZFR5cGVzID0gSlNPTi5wYXJzZShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtZGVsZXRlZC10eXBlc11cIilcclxuICAgICAgICAuZGF0YXNldC5kZWxldGVkVHlwZXMpO1xyXG5cclxuICAgICAgaGlkZUZpbHRlckxpc3Qoc2libGluZ0ZpbHRlcnMpO1xyXG4gICAgICBzcGlubmVyLnNob3coKTtcclxuICAgICAgZmlsdGVyZWRTZWN0aW9uLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LmFkZChcImZpbHRlcmluZ1wiKSk7XHJcbiAgICAgIG9wdGlvbnMuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKFwiY2hlY2tlZFwiKSk7IC8vIGhpZGUgcnNldCBvcHRpb24gYnV0dG9uXHJcbiAgICAgIGNvbnRyb2xsZXJzLmZvckVhY2goY29udHJvbGxlciA9PiBjb250cm9sbGVyLmNoZWNrZWQgPSBmYWxzZSk7IC8vIHJlc2V0IGFsbCBpbnB1dCBjb250cm9sbGVyc1xyXG4gICAgICByZXNldEFsbENvbnRyb2xsZXJzSW5JdGVtcygpO1xyXG4gICAgICByZXNldC5jbG9zZXN0KFwiLmZpbHRlcnNfX3Jlc2V0XCIpLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIC8vIHNob3cgaGlkZGVuIGNhcmRzIGFzIGRlbGV0ZSBkYXRhLWRpc3BsYXkgYXR0cmlidXRlc1xyXG4gICAgICAgIGNhcmRzLmZvckVhY2goY2FyZCA9PiB7XHJcbiAgICAgICAgICBmb3IgKGNvbnN0IHR5cGUgb2YgZGVsZXRlZFR5cGVzKSB7XHJcbiAgICAgICAgICAgIGNhcmQucmVtb3ZlQXR0cmlidXRlKGBkYXRhLWRpc3BsYXktJHt0eXBlfWApO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjaGVja0ZpbHRlcmVkU2VjdGlvbigpO1xyXG4gICAgICB9LCAxMDAwKTtcclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGNoZWNrRmlsdGVyZWRTZWN0aW9uID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBzZWN0aW9ucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zZWN0aW9uX2ZpbHRlcmVkXCIpKTtcclxuXHJcbiAgICBzZWN0aW9ucy5mb3JFYWNoKHNlY3Rpb24gPT4ge1xyXG4gICAgICBjb25zdCBmaWx0ZXJlZEl0ZW1zID0gQXJyYXkuZnJvbShzZWN0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1maWx0ZXJdXCIpKTtcclxuICAgICAgY29uc3Qgc2hvd25JdGVtcyA9IGZpbHRlcmVkSXRlbXMuZmlsdGVyKGkgPT4gIWkuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGlkZVwiKSk7XHJcblxyXG4gICAgICBpZiAoc2hvd25JdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHNwaW5uZXIuaGlkZSgpO1xyXG4gICAgc2VjdGlvbnMuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKFwiZmlsdGVyaW5nXCIpKTtcclxuXHJcbiAgICBzaG93QW5pbUVsZW1lbnRzKCk7XHJcbiAgICBzZXRBbmltYXRpb25FbG1zKCk7XHJcbiAgICBjaGVja05vRmlsdGVyTXNnKCk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgaGFzRGF0YURpc3BsYXlBdHRyaWJ1dGUgPSAobm9kZSkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzO1xyXG5cclxuICAgIGxldCBoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZSA9IGZhbHNlO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlc1tpXS5uYW1lO1xyXG5cclxuICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUuc3RhcnRzV2l0aChcImRhdGEtZGlzcGxheVwiKSkge1xyXG4gICAgICAgIGhhc0RhdGFEaXNwbGF5QXR0cmlidXRlID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBoYXNEYXRhRGlzcGxheUF0dHJpYnV0ZTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBjaGVja0ZpbHRlcmVkSXRlbSA9IChwcm9wLCB2YWwpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1maWx0ZXJdXCIpKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgaXRlbXMuZm9yRWFjaChpID0+IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShpLmRhdGFzZXQuZmlsdGVyKTtcclxuICAgICAgICBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShkYXRhW3Byb3BdKTtcclxuXHJcbiAgICAgICAgY29uc3QgaXNNYXRjaGVkID0gaXNBcnJheVxyXG4gICAgICAgICAgPyBkYXRhW3Byb3BdLmluY2x1ZGVzKHZhbClcclxuICAgICAgICAgIDogZGF0YVtwcm9wXSA9PT0gdmFsO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKGlzTWF0Y2hlZCkge1xyXG4gICAgICAgICAgaS5yZW1vdmVBdHRyaWJ1dGUoYGRhdGEtZGlzcGxheS0ke3Byb3B9YCk7XHJcbiAgICAgICAgICBpZiAoIWhhc0RhdGFEaXNwbGF5QXR0cmlidXRlKGkpKSBpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xyXG4gICAgICAgICAgaS5zZXRBdHRyaWJ1dGUoYGRhdGEtZGlzcGxheS0ke3Byb3B9YCwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hlY2tGaWx0ZXJlZFNlY3Rpb24oKTtcclxuICAgICAgfSk7XHJcbiAgICB9LCAxMDAwKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBhY3RpdmVDb2xvckluSXRlbSA9ICh2YWwpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS10YXJnZXQtdHlwZT1cIiR7dmFsfVwiXWApKTtcclxuXHJcbiAgICBpdGVtcy5mb3JFYWNoKGkgPT4gaS5jbGljaygpKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBpbml0RmlsdGVyU2VsZWN0ID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpc1BhZ2VDYXRhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wYWdlLWNhdGFsb2dcIik7XHJcbiAgICBpZiAoaXNQYWdlQ2F0YWxvZykgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGNvbnRyb2xsZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzIGlucHV0W3R5cGU9XFxcInJhZGlvXFxcIl06bm90KFt2YWx1ZT1cXFwicmVzZXRcXFwiXSlcIikpO1xyXG5cclxuICAgIGNvbnN0IGZpbHRlcmVkU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2VjdGlvbl9maWx0ZXJlZFwiKTtcclxuXHJcbiAgICBjb25zdCByZXNldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlsdGVyc19fcmVzZXRcIik7XHJcblxyXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgZmlsdGVyZWRTZWN0aW9uLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LmFkZChcImZpbHRlcmluZ1wiKSk7XHJcbiAgICAgIHNwaW5uZXIuc2hvdygpO1xyXG4gICAgICBjaGVja0ZpbHRlcmVkSXRlbSh0aGlzLm5hbWUsIHRoaXMudmFsdWUpO1xyXG4gICAgICBhY3RpdmVDb2xvckluSXRlbSh0aGlzLnZhbHVlKTtcclxuICAgICAgdGhpcy5jbG9zZXN0KFwiLmZpbHRlcnNfX29wdGlvbnNcIikuY2xhc3NMaXN0LmFkZChcImNoZWNrZWRcIik7XHJcbiAgICAgIHJlc2V0QnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJkaXNhYmxlZFwiKTtcclxuICAgIH0pKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCByZW1vdmVEYXRhRmlsdGVyQXR0cmlidXRlID0gKHByb3ApID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS1kaXNwbGF5LSR7cHJvcH1dYCkpO1xyXG5cclxuICAgIGl0ZW1zLmZvckVhY2goaSA9PiB7XHJcbiAgICAgIGkucmVtb3ZlQXR0cmlidXRlKGBkYXRhLWRpc3BsYXktJHtwcm9wfWApO1xyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgY2hlY2tBbGxJdGVtc0hhc0Rpc3BsYXlBdHRyaWJ1dGVzID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1maWx0ZXJdXCIpKTtcclxuXHJcbiAgICBpdGVtcy5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICBpZiAoIWhhc0RhdGFEaXNwbGF5QXR0cmlidXRlKGkpKSB7XHJcbiAgICAgICAgaS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZVwiKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgcmVzZXRBbGxDb250cm9sbGVyc0J5TmFtZSA9IChuYW1lKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT0ke25hbWV9XWApKTtcclxuICAgIGl0ZW1zLmZvckVhY2goaSA9PiBpLmNoZWNrZWQgPSBmYWxzZSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgcmVzZXRBbGxDb250cm9sbGVyc0luSXRlbXMgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHRhYkxpc3RzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkcy1zZXJpZXNfX2NvbnRyb2xzXCIpKTtcclxuXHJcbiAgICB0YWJMaXN0cy5mb3JFYWNoKGxpc3QgPT4ge1xyXG4gICAgICBsaXN0LnF1ZXJ5U2VsZWN0b3IoXCIuY2FyZHMtc2VyaWVzX190YWJcIik/LmNsaWNrKCk7XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCLQstGR0YDRgdGC0LrQsFwiLCBlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBjaGVja0FsbEZpbHRlclJlc2V0QnRuID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpc0NoZWNrZWRGaWx0ZXIgPSBkb2N1bWVudFxyXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5maWx0ZXJzX19saXN0IGlucHV0OmNoZWNrZWRcIik7XHJcblxyXG4gICAgY29uc3QgcmVzZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZpbHRlcnNfX3Jlc2V0XCIpO1xyXG5cclxuICAgIGlzQ2hlY2tlZEZpbHRlci5sZW5ndGggPT09IDBcclxuICAgICAgPyByZXNldC5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIilcclxuICAgICAgOiByZXNldC5jbGFzc0xpc3QucmVtb3ZlKFwiZGlzYWJsZWRcIik7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY29uc29sZS53YXJuKFwi0LLRkdGA0YHRgtC60LBcIiwgZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgaW5pdFJlc2V0RmlsdGVyUHJvcCA9ICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaXNQYWdlQ2F0YWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGFnZS1jYXRhbG9nXCIpO1xyXG4gICAgaWYgKGlzUGFnZUNhdGFsb2cpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBjb250cm9sbGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmlsdGVycyBpbnB1dFt2YWx1ZT1cXFwicmVzZXRcXFwiXVwiKSk7XHJcbiAgICBjb25zdCBzZWN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2VjdGlvbl9maWx0ZXJlZFwiKTtcclxuXHJcbiAgICBjb250cm9sbGVycy5mb3JFYWNoKGVsID0+IGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBzZWN0aW9ucy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoXCJmaWx0ZXJpbmdcIikpO1xyXG4gICAgICBzcGlubmVyLnNob3coKTtcclxuICAgICAgdGhpcy5jbG9zZXN0KFwiLmZpbHRlcnNfX29wdGlvbnNcIikuY2xhc3NMaXN0LnJlbW92ZShcImNoZWNrZWRcIik7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICByZW1vdmVEYXRhRmlsdGVyQXR0cmlidXRlKHRoaXMubmFtZSk7XHJcbiAgICAgICAgY2hlY2tBbGxJdGVtc0hhc0Rpc3BsYXlBdHRyaWJ1dGVzKCk7XHJcbiAgICAgICAgY2hlY2tGaWx0ZXJlZFNlY3Rpb24oKTtcclxuICAgICAgICByZXNldEFsbENvbnRyb2xsZXJzQnlOYW1lKHRoaXMubmFtZSk7XHJcbiAgICAgICAgcmVzZXRBbGxDb250cm9sbGVyc0luSXRlbXMoKTtcclxuICAgICAgICBjaGVja0FsbEZpbHRlclJlc2V0QnRuKCk7XHJcbiAgICAgIH0sIDEwMDApO1xyXG4gICAgfSkpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGluaXRGaWx0ZXJzRHJvcCgpO1xyXG4gICAgaW5pdEZpbHRlcnNSZXNldCgpO1xyXG4gICAgaW5pdEZpbHRlclNlbGVjdCgpO1xyXG4gICAgaW5pdFJlc2V0RmlsdGVyUHJvcCgpO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUud2FybihcItCy0ZHRgNGB0YLQutCwXCIsIGUpO1xyXG4gIH1cclxufSk7IiwiY2xhc3MgSW5mb3JtZXIge1xyXG4gICAgc3RhdGljIF9pbnN0YW5jZXNcclxuXHJcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2VzKCkge1xyXG4gICAgICAgIGlmICghSW5mb3JtZXIuX2luc3RhbmNlcykge1xyXG4gICAgICAgICAgICBJbmZvcm1lci5faW5zdGFuY2VzID0gbmV3IEluZm9ybWVyKClcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIEluZm9ybWVyLl9pbnN0YW5jZXNcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluZm9ybWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvcm1lclwiKVxyXG4gICAgICAgIGlmICghdGhpcy5pbmZvcm1lcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCLQndCwINGB0YLRgNCw0L3QuNGG0LUg0L7RgtGB0YPRgtGB0YLQstGD0LXRgiBodG1sINC+0LHQtdGA0YLQutCwINC00LvRjyDQmNC90YTQvtGA0LzQtdGA0LBcIilcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5mb3JtZXJCb2R5ID0gdGhpcy5pbmZvcm1lci5xdWVyeVNlbGVjdG9yKFwiLmluZm9ybWVyX19ib2R5XCIpXHJcbiAgICAgICAgdGhpcy5pbmZvcm1lckJhY2sgPSB0aGlzLmluZm9ybWVyLnF1ZXJ5U2VsZWN0b3IoXCIuaW5mb3JtZXJfX2JhY2tcIilcclxuICAgICAgICB0aGlzLmluZm9ybWVyQ2xvc2UgPSB0aGlzLmluZm9ybWVyLnF1ZXJ5U2VsZWN0b3IoXCIuaW5mb3JtZXJfX2Nsb3NlXCIpXHJcbiAgICAgICAgdGhpcy5pbml0KClcclxuICAgIH1cclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5idG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwic3BhbltkYXRhLXRlcm1dXCIpKVxyXG4gICAgICAgIHRoaXMuaW5pdEV2ZW50TGlzdGVuZXJzKClcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRFdmVudExpc3RlbmVycygpIHtcclxuICAgICAgICB0aGlzLmJ0bnMuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZ2V0SW5mb3JtYXRpb24oYnRuLmRhdGFzZXQudGVybSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB0aGlzLmluZm9ybWVyQmFjay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5oaWRlSW5mb3JtZXIoKSlcclxuICAgICAgICB0aGlzLmluZm9ybWVyQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuaGlkZUluZm9ybWVyKCkpXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZ2V0SW5mb3JtYXRpb24odGVybSkge1xyXG4gICAgICAgIHdpbmRvdy5zcGlubmVyLnNob3coKVxyXG5cclxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwidGVybVwiLCB0ZXJtKVxyXG5cclxuICAgICAgICBjb25zdCByZXMgPSBERVZfTU9ERSA/XHJcbiAgICAgICAgICAgIGF3YWl0IGZldGNoKFwiaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9pbmZvcm0uaHRtbFwiKSA6XHJcbiAgICAgICAgICAgIGF3YWl0IGZldGNoKFwiL2FwaS90ZXJtXCIsIHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICBib2R5OiBmb3JtRGF0YVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZXMudGV4dCgpXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5mb3JtZXJDb250ZW50KGh0bWwpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwi0J3QtSDRg9C00LDQu9C+0YHRjCDQv9C+0LvRg9GH0LjRgtGMINC40L3RhNC+0YDQvNCw0YbQuNGOINC00LvRjyDQotC10YDQvNC40L3QsFwiLCB0ZXJtKVxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHdpbmRvdy5zcGlubmVyLmhpZGUsIDMwMClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlSW5mb3JtZXJDb250ZW50KGRhdGEpIHtcclxuICAgICAgICBjb25zdCBpbmZvcm1lckNvbnRlbnQgPSB0aGlzLmluZm9ybWVyLnF1ZXJ5U2VsZWN0b3IoXCIuaW5mb3JtZXJfX2NvbnRlbnRcIilcclxuXHJcbiAgICAgICAgd2hpbGUgKGluZm9ybWVyQ29udGVudC5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgIGluZm9ybWVyQ29udGVudC5yZW1vdmVDaGlsZChpbmZvcm1lckNvbnRlbnQuZmlyc3RDaGlsZClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGluZm9ybWVyQ29udGVudC5pbm5lckhUTUwgPSBkYXRhXHJcbiAgICAgICAgdGhpcy5zaG93SW5mb3JtZXIoKVxyXG4gICAgICAgIHNldFRpbWVvdXQod2luZG93LnNwaW5uZXIuaGlkZSwgMzAwKVxyXG4gICAgfVxyXG5cclxuICAgIHNob3dJbmZvcm1lcigpIHtcclxuICAgICAgICB0aGlzLmluZm9ybWVyLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmluZm9ybWVyQmFjay5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKVxyXG4gICAgICAgICAgICB0aGlzLmluZm9ybWVyQm9keS5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKVxyXG4gICAgICAgIH0sIDEwMClcclxuICAgIH1cclxuXHJcbiAgICBoaWRlSW5mb3JtZXIoKSB7XHJcbiAgICAgICAgdGhpcy5pbmZvcm1lckJhY2suY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIilcclxuICAgICAgICB0aGlzLmluZm9ybWVyQm9keS5jbGFzc0xpc3QucmVtb3ZlKFwidmlzaWJsZVwiKVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaW5mb3JtZXIuY2xhc3NMaXN0LnJlbW92ZShcInZpc2libGVcIiksIDUwMClcclxuICAgIH1cclxufVxyXG53aW5kb3cuaW5pdEluZm9ybWVycyA9ICgpID0+IEluZm9ybWVyLmdldEluc3RhbmNlcygpLmluaXQoKVxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4gd2luZG93LmluZm9ybWVyID0gd2luZG93LmluaXRJbmZvcm1lcnMoKSkiLCJjb25zdCBpbml0TW9kYWwgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2RhbF0nKSlcclxuXHJcbiAgICBpZiAoYnRucy5sZW5ndGggPT09IDApIHJldHVyblxyXG5cclxuICAgIGJ0bnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5kYXRhc2V0Lm1vZGFsVGFyZ2V0XHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0gdGhpcy5kYXRhc2V0Lm1vZGFsQWN0aW9uXHJcblxyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3cnOlxyXG4gICAgICAgICAgICAgICAgc2hvd01vZGFsQmFjaygpXHJcbiAgICAgICAgICAgICAgICBzaG93TW9kYWxEaWFsb2codGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3RvZ2dsZSc6XHJcbiAgICAgICAgICAgICAgICB0b2dnbGVNb2RhbERpYWxvZyh0YXJnZXQpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnY2xvc2UnOlxyXG4gICAgICAgICAgICAgICAgaGlkZU1vZGFsRGlhbG9nKClcclxuICAgICAgICAgICAgICAgIGNsZWFyTW9kYWxWaWRlbygpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGhpZGVNb2RhbEJhY2ssIDIwMClcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0pKVxyXG59XHJcblxyXG5jb25zdCBzaG93TW9kYWxCYWNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fYmFjaycpXHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JvZHknKVxyXG5cclxuICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpXHJcbiAgICBiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4gYmFjay5jbGFzc0xpc3QuYWRkKCdzaG93JyksIDEwKVxyXG59XHJcblxyXG5jb25zdCBoaWRlTW9kYWxCYWNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fYmFjaycpXHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JvZHknKVxyXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2hlYWRlcicpXHJcblxyXG4gICAgaWYgKCFiYWNrKSByZXR1cm5cclxuXHJcbiAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKVxyXG4gICAgYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JylcclxuICAgIGhlYWRlci5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYmFjay5jbGFzc0xpc3QuYWRkKCdoaWRlJylcclxuICAgICAgICBoZWFkZXIucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xyXG4gICAgfSwgMTAwKVxyXG59XHJcblxyXG5jb25zdCBzaG93TW9kYWxEaWFsb2cgPSAoaWQpID0+IHtcclxuICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXHJcbiAgICBjb25zdCBkaWFsb2cgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLm1vZGFsX19kaWFsb2cnKVxyXG5cclxuICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgICAgICBkaWFsb2cuY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcbiAgICB9LCAxMClcclxufVxyXG5cclxuY29uc3QgaGlkZU1vZGFsRGlhbG9nID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1vZGFsLnNob3cnKVxyXG4gICAgaWYgKCF0YXJnZXQpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IGRpYWxvZyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX2RpYWxvZycpXHJcblxyXG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG4gICAgZGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnaGlkZScpLCAxMDApXHJcbn1cclxuXHJcbmNvbnN0IGNsZWFyTW9kYWxWaWRlbyA9ICgpID0+IHtcclxuICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21vZGFsVmlkZW8nKVxyXG4gICAgaWYgKG1vZGFsKSB7XHJcbiAgICAgICAgbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsX190aXRsZScpLmlubmVySFRNTCA9ICcnXHJcbiAgICAgICAgbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsX192aWRlbycpLmlubmVySFRNTCA9ICcnXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGluaXRDbG9zZU1vZGFsID0gKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzT25Qb3B1cE1vZGFsID0gZS50YXJnZXQuY2xvc2VzdCgnLm1vZGFsX19kaWFsb2cnKVxyXG4gICAgICAgIGNvbnN0IGRvd25sb2FkVGFibGVQcmV2aWV3ID0gZS50YXJnZXQuY2xvc2VzdCgnLmRvd25sb2FkX190YWJsZS1wcmV2aWV3Jyk7XHJcblxyXG4gICAgICAgIGlmKGlzT25Qb3B1cE1vZGFsKSByZXR1cm5cclxuICAgICAgICBpZihkb3dubG9hZFRhYmxlUHJldmlldykgcmV0dXJuXHJcblxyXG4gICAgICAgIGhpZGVNb2RhbERpYWxvZygpXHJcbiAgICAgICAgY2xlYXJNb2RhbFZpZGVvKClcclxuICAgICAgICBzZXRUaW1lb3V0KGhpZGVNb2RhbEJhY2ssIDIwMClcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IHRvZ2dsZU1vZGFsRGlhbG9nID0gKGlkKSA9PiB7XHJcbiAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGlkKVxyXG4gICAgY29uc3QgZGlhbG9nID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fZGlhbG9nJylcclxuXHJcbiAgICBoaWRlTW9kYWxEaWFsb2coKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSwgMjAwKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG4gICAgICAgIGRpYWxvZy5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxuICAgIH0sIDMwMClcclxufVxyXG5cclxuY29uc3QgaW5pdFRvZ2dsZVZpc2libGVQYXNzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYnRucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsX190b2dnbGUtdmlzaWJsZS1wYXNzJykpXHJcblxyXG4gICAgaWYgKGJ0bnMubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBidG5zLmZvckVhY2goZWwgPT4gZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXQnKVxyXG4gICAgICAgIGNvbnN0IGlzVGV4dCA9IGlucHV0LnR5cGUgPT09ICd0ZXh0J1xyXG5cclxuICAgICAgICBpbnB1dC50eXBlID0gaXNUZXh0ID8gJ3Bhc3N3b3JkJyA6ICd0ZXh0J1xyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgncGFzcy12aXNpYmxlJylcclxuICAgIH0pKVxyXG59XHJcblxyXG5jb25zdCBzaG93TW9kYWwgPSAoaWQpID0+IHtcclxuICAgIHNob3dNb2RhbEJhY2soKVxyXG4gICAgc2hvd01vZGFsRGlhbG9nKGlkKVxyXG59XHJcblxyXG5jb25zdCBpbnNlcnRWaWRlb0ludG9UYXJnZXQgPSAodmlkZW9VcmwsIHRhcmdldFNlbGVjdG9yKSA9PiB7XHJcbiAgICBjb25zdCB2aWRlb0lkID0gdmlkZW9Vcmwuc3BsaXQoJy8nKS5maWx0ZXIoQm9vbGVhbikucG9wKCk7XHJcbiAgICBjb25zdCBlbWJlZExpbmsgPSBgaHR0cHM6Ly9ydXR1YmUucnUvcGxheS9lbWJlZC8ke3ZpZGVvSWR9L2BcclxuICAgIGNvbnN0IHZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xyXG4gICAgdmlkZW9FbGVtZW50LnNyYyA9IGVtYmVkTGluaztcclxuICAgIHZpZGVvRWxlbWVudC5mcmFtZUJvcmRlciA9IDA7XHJcbiAgICB2aWRlb0VsZW1lbnQuYWxsb3cgPSAnY2xpcGJvYXJkLXdyaXRlOyBhdXRvcGxheSc7XHJcbiAgICB2aWRlb0VsZW1lbnQuc2V0QXR0cmlidXRlKCd3ZWJraXRBbGxvd0Z1bGxTY3JlZW4nLCAnJyk7XHJcbiAgICB2aWRlb0VsZW1lbnQuc2V0QXR0cmlidXRlKCdtb3phbGxvd2Z1bGxzY3JlZW4nLCAnJyk7XHJcbiAgICB2aWRlb0VsZW1lbnQuc2V0QXR0cmlidXRlKCdhbGxvd0Z1bGxTY3JlZW4nLCAnJyk7XHJcblxyXG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0U2VsZWN0b3IpO1xyXG4gICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcclxuICAgICAgICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKHZpZGVvRWxlbWVudCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Ct0LvQtdC80LXQvdGCINGBINGD0LrQsNC30LDQvdC90YvQvCDRgdC10LvQtdC60YLQvtGA0L7QvCDQvdC1INC90LDQudC00LXQvS4nKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaW5pdE1vZGFsKClcclxuICAgIGluaXRDbG9zZU1vZGFsKClcclxuICAgIGluaXRUb2dnbGVWaXNpYmxlUGFzcygpXHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBjb25zdCBkb3dubG9hZFRhYmxlUHJldmlldyA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuZG93bmxvYWRfX3RhYmxlLXByZXZpZXcnKTtcclxuICAgICAgICBpZiAoZG93bmxvYWRUYWJsZVByZXZpZXcpIHtcclxuICAgICAgICAgICAgc2hvd01vZGFsQmFjaygpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdXJsVmlkZW8gPSBkb3dubG9hZFRhYmxlUHJldmlldy5kYXRhc2V0LnZpZGVvO1xyXG4gICAgICAgICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2JvZHknKTtcclxuICAgICAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtb2RhbFZpZGVvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21vZGFsVmlkZW8nKTtcclxuICAgICAgICAgICAgbW9kYWxWaWRlby5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XHJcbiAgICAgICAgICAgIG1vZGFsVmlkZW8uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG5cclxuICAgICAgICAgICAgbW9kYWxWaWRlby5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX3RpdGxlJykuaW5uZXJIVE1MID0gZG93bmxvYWRUYWJsZVByZXZpZXcucXVlcnlTZWxlY3RvcignaW1nJykuZ2V0QXR0cmlidXRlKCdhbHQnKTtcclxuXHJcbiAgICAgICAgICAgIGluc2VydFZpZGVvSW50b1RhcmdldCh1cmxWaWRlbywgJy5tb2RhbF9fdmlkZW8nKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSkiLCIvLyBBZGQgcHJvZHVjdCB0byBmYXZvcml0ZXNcclxuY29uc3QgYWRkVG9GYXZvcml0ZXNDbGlja0hhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgY29uc3QgX3RoaXMgPSBlLnRhcmdldFxyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IF90aGlzLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKVxyXG4gICAgY29uc3QgdGl0bGUgPSBfdGhpcy5kYXRhc2V0LnRpdGxlXHJcbiAgICBjb25zdCBtZXNzYWdlID0gX3RoaXMuZGF0YXNldC5tZXNzYWdlXHJcbiAgICBjb25zdCBoZWFkZXJGYXZvcml0ZXMgPSBkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19idXR0b25zLWxpbmtfZmF2b3JpdGVzIC5oZWFkZXJfX2J1dHRvbnMtY291bnQnKVxyXG4gICAgY29uc3QgY3VycmVudEZhdm9yaXRlc0NvdW50ID0gcGFyc2VJbnQoaGVhZGVyRmF2b3JpdGVzLmlubmVyVGV4dClcclxuXHJcbiAgICBpZiAoIWlzU2VsZWN0ZWQpIHtcclxuICAgICAgICBfdGhpcy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpXHJcbiAgICAgICAgaGVhZGVyRmF2b3JpdGVzLmlubmVyVGV4dCA9IGN1cnJlbnRGYXZvcml0ZXNDb3VudCArIDFcclxuICAgICAgICBoZWFkZXJGYXZvcml0ZXMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gaGVhZGVyRmF2b3JpdGVzLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyksIDEwMDApXHJcblxyXG4gICAgICAgIHNob3dNb2RhbE1zZyh0aXRsZSwgbWVzc2FnZSlcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcign0JfQtNC10YHRjCDQvdCw0LTQviDQsdGD0LTQtdGCINC90LDQv9C40YHQsNGC0Ywg0LDRgdC40L3RhdGA0L7QvdC90YvQuSDQt9Cw0L/RgNC+0YEg0LTQvtCx0LDQstC70LXQvdC40Y8g0YLQvtCy0LDRgNCwINCyINC40LfQsdGA0LDQvdC90YvQtScpO1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIF90aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcclxuICAgIGhlYWRlckZhdm9yaXRlcy5pbm5lclRleHQgPSBjdXJyZW50RmF2b3JpdGVzQ291bnQgLSAxXHJcbiAgICAvLyBjb25zb2xlLmVycm9yKCdBc3luYyBxdWVyeSB0byBERUxFVEUgc2VsZWN0ZWQgcHJvZHVjdCBmcm9tIEZhdm9yaXRlcycpO1xyXG59XHJcblxyXG5jb25zdCBpbml0QWRkVG9GYXZvcml0ZXMgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcucHJvZHVjdC1pdGVtX19mYXZvcml0ZXMnKSlcclxuXHJcbiAgICBidG5zLmZvckVhY2goYnRuID0+IGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZFRvRmF2b3JpdGVzQ2xpY2tIYW5kbGVyKSlcclxufVxyXG5cclxuLy8gQWRkIHByb2R1Y3QgdG8gY2FydFxyXG5jb25zdCBhZGRUb0NhcnRDbGlja0hhbmRsZXIgPSAoZSkgPT4ge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgY29uc3QgX3RoaXMgPSBlLnRhcmdldFxyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IF90aGlzLmNsYXNzTGlzdC5jb250YWlucygnc2VsZWN0ZWQnKVxyXG4gICAgY29uc3QgdGl0bGUgPSBfdGhpcy5kYXRhc2V0LnRpdGxlXHJcbiAgICBjb25zdCBtZXNzYWdlID0gX3RoaXMuZGF0YXNldC5tZXNzYWdlXHJcblxyXG4gICAgaWYgKCFpc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgX3RoaXMuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxyXG4gICAgICAgIHNob3dNb2RhbE1zZyh0aXRsZSwgbWVzc2FnZSlcclxuXHJcbiAgICAgICAgLy8gUHVzaCBjdXJyZW50IHByb2R1Y3QgdG8gQ2FydCBHbG9iYWwgT2JqZWN0ICh3aW5kb3cuQ0FSVClcclxuICAgICAgICB3aW5kb3cuYWRkUHJvZHVjdFRvQ2FydCh7IGFydDogX3RoaXMuZGF0YXNldC5wcm9kdWN0SWQsIGNvdW50OiAxIH0pXHJcblxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIF90aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcclxuICAgIHNob3dNb2RhbE1zZyh0aXRsZSwgJ9Cj0LTQsNC70LXQvSDQuNC3INC60L7RgNC30LjQvdGLJylcclxuXHJcbiAgICAvLyBSZW1vdmUgY3VycmVudCBwcm9kdWN0IGZyb20gQ2FydCBHbG9iYWwgT2JqZWN0ICh3aW5kb3cuQ0FSVClcclxuICAgIHdpbmRvdy5yZW1vdmVQcm9kdWN0RnJvbUNhcnQoeyBhcnQ6IF90aGlzLmRhdGFzZXQucHJvZHVjdElkLCBjb3VudDogMSB9KVxyXG59XHJcbmNvbnN0IGluaXRBZGRUb0NhcnQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidG5zID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcucHJvZHVjdC1pdGVtX19jYXJ0JykpXHJcblxyXG4gICAgYnRucy5mb3JFYWNoKGJ0biA9PiBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGRUb0NhcnRDbGlja0hhbmRsZXIpKVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGluaXRBZGRUb0Zhdm9yaXRlcygpXHJcbiAgICBpbml0QWRkVG9DYXJ0KClcclxufSkiLCIvLyBQcm9kdWN0IGluZm9ybWF0aW9uIHNsaWRlclxyXG5sZXQgcHJvZHVjdEluZm9TbGlkZXJcclxuXHJcbmNvbnN0IGluaXRQcm9kdWN0SW5mb1NsaWRlciA9ICgpID0+IHtcclxuXHJcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnByb2R1Y3QtaW5mbyAuc3dpcGVyJykubGVuZ3RoID09PSAwKSByZXR1cm5cclxuXHJcbiAgICBwcm9kdWN0SW5mb1NsaWRlciA9IG5ldyBTd2lwZXIoJy5wcm9kdWN0LWluZm8gLnN3aXBlcicsIHtcclxuICAgICAgICBsb29wOiBmYWxzZSxcclxuICAgICAgICAvLyBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXHJcbiAgICAgICAgb2JzZXJ2ZXI6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVBhcmVudHM6IHRydWUsXHJcbiAgICAgICAgb2JzZXJ2ZVNsaWRlQ2hpbGRyZW46IHRydWUsXHJcbiAgICAgICAgd2F0Y2hPdmVyZmxvdzogdHJ1ZSxcclxuXHJcbiAgICAgICAgLy8gYXV0b0hlaWdodDogdHJ1ZSxcclxuICAgICAgICAvLyBzcGFjZUJldHdlZW46IDEwLFxyXG5cclxuICAgICAgICBzY3JvbGxiYXI6IHtcclxuICAgICAgICAgICAgZWw6ICcuc3dpcGVyLXNjcm9sbGJhcicsXHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgICAgIDU3Njoge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuY29uc3QgY2hlY2tQcm9kdWN0SW5mb1NsaWRlciA9ICgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+IDk5MSkge1xyXG4gICAgICAgIGlmIChwcm9kdWN0SW5mb1NsaWRlcikge1xyXG4gICAgICAgICAgICBwcm9kdWN0SW5mb1NsaWRlci5kZXN0cm95KHRydWUsIHRydWUpXHJcbiAgICAgICAgICAgIHByb2R1Y3RJbmZvU2xpZGVyID0gdW5kZWZpbmVkXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcHJvZHVjdEluZm9TbGlkZXIpIHtcclxuICAgICAgICBpbml0UHJvZHVjdEluZm9TbGlkZXIoKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIGNvbnN0IGlzUHJvZHVjdFBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1wcm9kdWN0JylcclxuICAgIGNvbnN0IGlzQXJ0aWNsZVBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1hcnRpY2xlJylcclxuICAgIGNvbnN0IGlzRG90c1BhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFnZS1kb3RzJylcclxuXHJcbiAgICAvLyBJbml0aWFsaXplIEluZm8gc2xpZGVyIG9ubHkgZm9yIFByb2R1Y3QsIEFydGljbGUgYW5kIERvdHMgcGFnZXNcclxuICAgIGlmICghaXNQcm9kdWN0UGFnZSAmJiAhaXNBcnRpY2xlUGFnZSAmJiAhaXNEb3RzUGFnZSkgcmV0dXJuXHJcblxyXG4gICAgY2hlY2tQcm9kdWN0SW5mb1NsaWRlcigpXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgICAgICB3aW5kb3cuc2FmZUNhbGwoY2hlY2tQcm9kdWN0SW5mb1NsaWRlcilcclxuICAgIH0pXHJcbn0pXHJcbiIsIi8vIFByb2R1Y3QgcmVjb21tZW5kYXRpb24gc2xpZGVyXHJcbmxldCBwcm9kdWN0UmVjb21tU2xpZGVyXHJcblxyXG5jb25zdCBjaGVja1JlY29tbVNsaWRlclNjcm9sbGJhciA9IChzd2lwZXIsIHNjcm9sbGJhcikgPT4ge1xyXG4gICAgaWYgKCFzY3JvbGxiYXIgfHwgc2Nyb2xsYmFyLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJykgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgaXNTY3JvbGxiYXJIaWRlID0gc2Nyb2xsYmFyLmNsYXNzTGlzdFxyXG4gICAgICAgIC5jb250YWlucygnc3dpcGVyLXNjcm9sbGJhci1sb2NrJylcclxuXHJcbiAgICBpc1Njcm9sbGJhckhpZGVcclxuICAgICAgICA/IHN3aXBlci5jbGFzc0xpc3QuYWRkKCdzY3JvbGwtaGlkZGVuJylcclxuICAgICAgICA6IHN3aXBlci5jbGFzc0xpc3QucmVtb3ZlKCdzY3JvbGwtaGlkZGVuJylcclxufVxyXG5cclxuY29uc3QgY2hlY2tTbGlkZXJzQm90dG9tT2Zmc2V0ID0gKCkgPT4ge1xyXG4gICAgY29uc3Qgc3dpcGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlcicpKVxyXG5cclxuICAgIHN3aXBlcnMuZm9yRWFjaChzd2lwZXIgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNjcm9sbGJhciA9IHN3aXBlci5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyLXNjcm9sbGJhcicpXHJcbiAgICAgICAgY2hlY2tSZWNvbW1TbGlkZXJTY3JvbGxiYXIoc3dpcGVyLCBzY3JvbGxiYXIpXHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBpbml0UHJvZHVjdFJlY29tbVNsaWRlciA9ICgpID0+IHtcclxuXHJcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJlY29tbWVuZGF0aW9uX19zbGlkZXIgLnN3aXBlcicpLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgcHJvZHVjdFJlY29tbVNsaWRlciA9IG5ldyBTd2lwZXIoJy5yZWNvbW1lbmRhdGlvbl9fc2xpZGVyIC5zd2lwZXInLCB7XHJcbiAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgIG9ic2VydmVyOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVQYXJlbnRzOiB0cnVlLFxyXG4gICAgICAgIG9ic2VydmVTbGlkZUNoaWxkcmVuOiB0cnVlLFxyXG4gICAgICAgIHdhdGNoT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgLy8gYXV0b0hlaWdodDogdHJ1ZSxcclxuXHJcbiAgICAgICAgc2Nyb2xsYmFyOiB7XHJcbiAgICAgICAgICAgIGVsOiAnLnN3aXBlci1zY3JvbGxiYXInLFxyXG4gICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgICAgICA1NzY6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXHJcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IDEwLFxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgOTkxOiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAzLFxyXG4gICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAxMCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgMTIwMDoge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG4gICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAwLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzd2lwZXIgPSB0aGlzLmVsXHJcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JvbGxiYXIgPSB0aGlzLnNjcm9sbGJhci5lbFxyXG4gICAgICAgICAgICAgICAgY2hlY2tSZWNvbW1TbGlkZXJTY3JvbGxiYXIoc3dpcGVyLCBzY3JvbGxiYXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5jb25zdCBjaGVja1Byb2R1Y3RSZWNvbW1TbGlkZXIgPSAoKSA9PiB7XHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPiAxMjAwICYmIHByb2R1Y3RSZWNvbW1TbGlkZXIpIHtcclxuICAgICAgICBBcnJheS5pc0FycmF5KHByb2R1Y3RSZWNvbW1TbGlkZXIpXHJcbiAgICAgICAgICAgID8gcHJvZHVjdFJlY29tbVNsaWRlci5mb3JFYWNoKHNsaWRlciA9PiBzbGlkZXIuZGVzdHJveSh0cnVlLCB0cnVlKSlcclxuICAgICAgICAgICAgOiBwcm9kdWN0UmVjb21tU2xpZGVyLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSlcclxuXHJcbiAgICAgICAgcHJvZHVjdFJlY29tbVNsaWRlciA9IHVuZGVmaW5lZFxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcHJvZHVjdFJlY29tbVNsaWRlcikge1xyXG4gICAgICAgIGluaXRQcm9kdWN0UmVjb21tU2xpZGVyKClcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBjb25zdCBpc1Byb2R1Y3RQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtcHJvZHVjdCcpXHJcbiAgICBjb25zdCBpc0FydGljbGVQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtYXJ0aWNsZScpXHJcbiAgICBjb25zdCBpc0RvdHNQYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtZG90cycpXHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBSZWNvbW1lbmRhdGlvbiBzbGlkZXIgb25seSBmb3IgUHJvZHVjdCwgQXJ0aWNsZSBhbmQgRG90cyBwYWdlc1xyXG4gICAgaWYgKCFpc1Byb2R1Y3RQYWdlICYmICFpc0FydGljbGVQYWdlICYmICFpc0RvdHNQYWdlKSByZXR1cm5cclxuXHJcbiAgICBjaGVja1Byb2R1Y3RSZWNvbW1TbGlkZXIoKVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgICAgICAgd2luZG93LnNhZmVDYWxsKGNoZWNrUHJvZHVjdFJlY29tbVNsaWRlcilcclxuICAgICAgICB3aW5kb3cuc2FmZUNhbGwoY2hlY2tTbGlkZXJzQm90dG9tT2Zmc2V0KVxyXG4gICAgfSlcclxufSlcclxuIiwiLyoqXHJcbiAqIFNob3cgYSBzbWFsbCBtZXNzYWdlIHdpdGggdGl0bGUgYW5kIHRleHQgaW4gdGhlIHRvcCByaWdodCBjb3JuZXIgb2YgdGhlIHNjcmVlbi5cclxuICogVGhlIG1ldGhvZCBleHBlY3RzIGF0IGxlYXN0IG9uZSBwYXJhbWV0ZXIgcGVyIGlucHV0LlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW3RpdGxlPXVuZGVmaW5lZF0gLSBUaGUgaGVhZGxpbmUgb2YgdGhlIG1lc3NhZ2UgaW4gb25lIGxpbmUuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbWVzc2FnZT11bmRlZmluZWRdIC0gT25lIGxpbmUgbWVzc2FnZSB0ZXh0LlxyXG4gKi9cclxud2luZG93LnNob3dNb2RhbE1zZyA9IGZ1bmN0aW9uKHRpdGxlID0gJycsIG1lc3NhZ2UgPSAnJykge1xyXG4gICAgaWYgKCF0aXRsZSAmJiAhbWVzc2FnZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGVyZSdzIG5vIHRpdGxlIG9yIG1lc3NhZ2UgZm9yIHNob3dpbmcgaW4gbW9kYWwgd2luZG93LlwiKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgdGl0bGUgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkluY29ycmVjdCB0eXBlIG9mIHRpdGxlLiBJdCBzaG91bGQgYmUgc3RyaW5nLlwiKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgbWVzc2FnZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW5jb3JyZWN0IHR5cGUgb2YgbWVzc2FnZS4gSXQgc2hvdWxkIGJlIHN0cmluZy5cIilcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19tc2ctY29udGFpbmVyJylcclxuICAgIGNvbnN0IFtjYXJkLCBib2R5XSA9IGNyZWF0ZU1vZGFsTXNnQ2FyZCh0aXRsZSwgbWVzc2FnZSlcclxuXHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FyZClcclxuICAgIGNoZWNrTW9kYWxNc2dDb250YWluZXIoKVxyXG4gICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IGNhcmQuY2xhc3NMaXN0LmFkZCgndW5jb2xsYXBzZWQnKSwgNTApXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJylcclxuICAgIH0sIDEwMClcclxuXHJcbiAgICBoaWRlTW9kYWxNc2coY2FyZCwgYm9keSwgNTAwMClcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tNb2RhbE1zZ0NvbnRhaW5lcigpIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX21zZy1jb250YWluZXInKVxyXG4gICAgY29uc3QgaW5uZXJFbG1zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC1tc2dfX2NhcmQnKVxyXG5cclxuICAgIGlubmVyRWxtcy5sZW5ndGggPiAwXHJcbiAgICAgICAgPyBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnZGlzcGxheScpXHJcbiAgICAgICAgOiBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnZGlzcGxheScpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU1vZGFsTXNnQ2FyZCh0aXRsZSwgbWVzc2FnZSkge1xyXG4gICAgY29uc3QgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ21vZGFsLW1zZ19fY2FyZCcpXHJcblxyXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ21vZGFsLW1zZ19fYm9keScpXHJcblxyXG4gICAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKVxyXG5cclxuICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgY29udGVudC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1tc2dfX2NvbnRlbnQnKVxyXG5cclxuICAgIGNvbnN0IGNhcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcclxuICAgIGNhcHRpb24udGV4dENvbnRlbnQgPSB0aXRsZVxyXG5cclxuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgIHRleHQudGV4dENvbnRlbnQgPSBtZXNzYWdlXHJcblxyXG4gICAgaWYgKHRpdGxlKSBjb250ZW50LmFwcGVuZENoaWxkKGNhcHRpb24pXHJcbiAgICBpZiAobWVzc2FnZSkgY29udGVudC5hcHBlbmRDaGlsZCh0ZXh0KVxyXG5cclxuICAgIGJvZHkuYXBwZW5kQ2hpbGQoaWNvbilcclxuICAgIGJvZHkuYXBwZW5kQ2hpbGQoY29udGVudClcclxuXHJcbiAgICBjYXJkLmFwcGVuZENoaWxkKGJvZHkpXHJcblxyXG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhpZGVNb2RhbE1zZ0hhbmRsZXIpXHJcblxyXG4gICAgcmV0dXJuIFtjYXJkLCBib2R5XVxyXG59XHJcblxyXG5mdW5jdGlvbiBoaWRlTW9kYWxNc2dIYW5kbGVyKCkge1xyXG4gICAgY29uc3QgY2FyZCA9IHRoaXNcclxuICAgIGNvbnN0IGJvZHkgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1tc2dfX2JvZHknKVxyXG4gICAgaGlkZU1vZGFsTXNnKGNhcmQsIGJvZHkpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhpZGVNb2RhbE1zZyhjYXJkLCBib2R5LCB0aW1lb3V0ID0gMCkge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxyXG4gICAgfSwgdGltZW91dClcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnLCAnaGlkZGVuJylcclxuICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3VuY29sbGFwc2VkJylcclxuICAgIH0sIHRpbWVvdXQgKyAxMDApXHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY2FyZC5yZW1vdmUoKTtcclxuICAgICAgICBjaGVja01vZGFsTXNnQ29udGFpbmVyKClcclxuICAgIH0sIHRpbWVvdXQgKyAyMDApXHJcbn1cclxuIiwiY29uc3Qgc2hvd1NwaW5uZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzcGlubmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKVxyXG4gICAgc3Bpbm5lci5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3Bpbm5lci5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyksIDEwMClcclxufVxyXG5cclxuY29uc3QgaGlkZVNwaW5uZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBzcGlubmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwaW5uZXInKVxyXG4gICAgc3Bpbm5lci5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gc3Bpbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5JyksIDEwMDApXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJykpIHtcclxuICAgICAgICB3aW5kb3cuc3Bpbm5lci5zaG93ID0gc2hvd1NwaW5uZXJcclxuICAgICAgICB3aW5kb3cuc3Bpbm5lci5oaWRlID0gaGlkZVNwaW5uZXJcclxuICAgIH1cclxufSkiLCJjb25zdCBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AgPSAoYnV0dG9uKSA9PiB7XHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5zY3JvbGxZXHJcblxyXG4gICAgaWYgKHNjcm9sbFRvcCA+IHdpbmRvd0hlaWdodCkge1xyXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5JylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXknKVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBpbml0U2Nyb2xsVG9Ub3AgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Nyb2xsVG9Ub3AnKVxyXG5cclxuICAgIGlmICghYnV0dG9uKSByZXR1cm5cclxuXHJcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBzbW9vdGhTY3JvbGxUbygwKSlcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiBzaG93QnV0dG9uU2Nyb2xsVG9Ub3AoYnV0dG9uKSlcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICBpbml0U2Nyb2xsVG9Ub3AoKVxyXG59KSIsIiIsIi8vIE9wZW4gYW5kIGNsb3NlIG1vYmlsZSBuYXZpZ2F0aW9uXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgICBjb25zdCBuYXZDbG9zZSA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fbmF2LWNsb3NlJykpXHJcbiAgICBjb25zdCBuYXZUb2dnbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3Rlcl9fbmF2LWxpbmtfbWVudScpXHJcbiAgICBjb25zdCBoZWFkZXJOYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYnKVxyXG4gICAgY29uc3QgbW9kYWxCYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbW9kYWwtYmFjaycpXHJcbiAgICBjb25zdCBuYXZQcm9kTGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1saW5rX3Byb2R1Y3QnKVxyXG4gICAgY29uc3QgbmF2SXRlbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1pdGVtX3dpdGgtaW5uZXInKSlcclxuICAgIGNvbnN0IG5hdkxpbmtzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtbGluaycpKVxyXG4gICAgY29uc3QgbmF2Q29sbGFwc2VzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtY29sbGFwc2UnKSlcclxuXHJcbiAgICBpZiAoIW5hdlRvZ2dsZXIpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZU5hdiA9IChkaXJlY3Rpb24pID0+IHtcclxuICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpXHJcbiAgICAgICAgICAgIG5hdlRvZ2dsZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuICAgICAgICAgICAgaGVhZGVyTmF2LmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgICAgICAvLyBtb2RhbEJhY2suY2xhc3NMaXN0LmFkZCgnc2hvdycpXHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG5hdlByb2RMaW5rLmNsaWNrKClcclxuICAgICAgICAgICAgfSwgMTAwKVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKVxyXG4gICAgICAgIG5hdlRvZ2dsZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICBoZWFkZXJOYXYuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpXHJcbiAgICAgICAgbW9kYWxCYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG5cclxuICAgICAgICBjb2xsYXBzQWxsTmF2SXRlbSgpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2xpY2sgb24gbmF2aWdhdGlvbiBidXJnZXJcclxuICAgIG5hdlRvZ2dsZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICB0b2dnbGVOYXYoZmFsc2UpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdG9nZ2xlTmF2KHRydWUpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIENsaWNrIG9uIG5hdmlnYXRpb24gY2xvc2UgYnV0dG9uXHJcbiAgICBuYXZDbG9zZS5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdG9nZ2xlTmF2KGZhbHNlKSlcclxuICAgIH0pXHJcblxyXG4gICAgbW9kYWxCYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIHRvZ2dsZU5hdihmYWxzZSlcclxuICAgIH0pXHJcblxyXG4gICAgLy8gT3BlbiBhbmQgY2xvc2UgTmF2aWdhdGlvbiBpdGVtc1xyXG4gICAgY29uc3QgY29sbGFwc0FsbE5hdkl0ZW0gPSAoKSA9PiB7XHJcbiAgICAgICAgbmF2SXRlbXMuZm9yRWFjaChpID0+IGkuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBlZCcpKVxyXG4gICAgICAgIG5hdkxpbmtzLmZvckVhY2goaSA9PiBpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpKVxyXG4gICAgICAgIG5hdkNvbGxhcHNlcy5mb3JFYWNoKGkgPT4gaS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJykpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdG9nZ2xlTmF2SXRlbSA9IChidG4pID0+IHtcclxuICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IGJ0bi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgIGNvbGxhcHNBbGxOYXZJdGVtKClcclxuXHJcbiAgICAgICAgaWYgKCFpc0FjdGl2ZSkge1xyXG4gICAgICAgICAgICBidG4uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG5hdkl0ZW0gPSBidG4uY2xvc2VzdCgnLmhlYWRlcl9fbmF2LWl0ZW1fd2l0aC1pbm5lcicpXHJcblxyXG4gICAgICAgICAgICBpZiAobmF2SXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmF2Q29sbGFwc2UgPSBuYXZJdGVtLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1jb2xsYXBzZScpXHJcblxyXG4gICAgICAgICAgICAgICAgbmF2SXRlbS5jbGFzc0xpc3QuYWRkKCdkcm9wcGVkJylcclxuICAgICAgICAgICAgICAgIG5hdkNvbGxhcHNlLmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgICAgICAgICAgbW9kYWxCYWNrLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5hdkxpbmtzLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZU5hdkl0ZW0odGhpcylcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufSlcclxuXHJcbi8vIFNlYXJjaGluZyBhbmQgU3RpY2t5IGhlYWRlclxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgXHJcbiAgIFxyXG4gICAgXHJcbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJylcclxuICAgIGNvbnN0IHNlYXJjaFRvZ2dsZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19idXR0b25zLWxpbmtfc2VhcmNoJylcclxuICAgIGNvbnN0IHNlYXJjaENsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fc2VhcmNoLWNsb3NlJylcclxuICAgIGNvbnN0IHNlYXJjaFBhbmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fc2VhcmNoJylcclxuICAgIGNvbnN0IHNlYXJjaElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fc2VhcmNoLWlucHV0JylcclxuICAgIGNvbnN0IHNlYXJjaFJlc2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fc2VhcmNoLXJlc2V0JylcclxuICAgIGNvbnN0IHNlYXJjaEhpbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fc2VhcmNoLWhpbnRzJylcclxuXHJcbiAgICBpZiAoIXNlYXJjaFRvZ2dsZXIpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IHRvZ2dsZVNlYXJjaFBhbmVsID0gKGhpZGUgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzVmlzaWJsZSA9IHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5jb250YWlucygndmlzaWJsZScpXHJcbiAgICAgICAgY29uc3QgdGltZW91dCA9IDEwMFxyXG5cclxuICAgICAgICBpZiAoIWlzVmlzaWJsZSAmJiAhaGlkZSkge1xyXG4gICAgICAgICAgICBzZWFyY2hQYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlJylcclxuICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl93aXRoLXNlYXJjaC1wYW5lbCcpXHJcbiAgICAgICAgICAgIHNlYXJjaFRvZ2dsZXIuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoUGFuZWwuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpXHJcbiAgICAgICAgICAgIH0sIHRpbWVvdXQpXHJcblxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlYXJjaFRvZ2dsZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcclxuICAgICAgICBzZWFyY2hQYW5lbC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgOTkyKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaEhpbnRzLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgICAgICBzZWFyY2hSZXNldC5jbGljaygpXHJcbiAgICAgICAgICAgIHJlc2V0SGFuZGxlckZvcm1IZWxwZXJzRXZlbnRMaXN0ZW5lcnMoKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHNlYXJjaFBhbmVsLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGUnKVxyXG4gICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyX3dpdGgtc2VhcmNoLXBhbmVsJylcclxuICAgICAgICB9LCAyMDApXHJcbiAgICB9XHJcblxyXG4gICAgc2VhcmNoVG9nZ2xlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB0b2dnbGVTZWFyY2hQYW5lbCgpXHJcbiAgICAgICAgc2VhcmNoSW5wdXQuZm9jdXMoKVxyXG4gICAgfSlcclxuXHJcbiAgICBzZWFyY2hDbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB0b2dnbGVTZWFyY2hQYW5lbCgpXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIGNvbnN0IFNFQVJDSF9SRVFVRVNUX1VSTCA9ICdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL3NlYXJjaC5qc29uJ1xyXG4gICAgLy8gY29uc3QgU0VBUkNIX1JFUVVFU1RfVVJMID0gJ2h0dHBzOi8vdGVzdC10ZWNobm9saWdodHYyLm1hc3NpdmUucnUvYXBpL3Byb2R1Y3Qvc2VhcmNoJ1xyXG5cclxuICAgIGNvbnN0IFNFQVJDSF9SRVFVRVNUX1VSTCA9ICcvYXBpL3Byb2R1Y3Qvc2VhcmNoJ1xyXG4gICAgLy8gY29uc3QgU0VBUkNIX1JFUVVFU1RfVVJMID0gJ2h0dHBzOi8vdGVjaG5vbGlnaHQucnUvYXBpL3Byb2R1Y3Qvc2VhcmNoJ1xyXG4gICAgY29uc3QgVEhST1RUTEVfVElNRU9VVCA9IDMwMFxyXG4gICAgbGV0IHNlYXJjaFJlcXVlc3RUaW1lb3V0SWRcclxuXHJcbiAgICBjb25zdCBzZXRTdHJvbmdUZXh0ID0gKHN0ciwgcXVlcnkpID0+IHtcclxuICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAocXVlcnksICdnaScpXHJcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlZ2V4LCBgPHN0cm9uZz4kJjwvc3Ryb25nPmApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcHJpbnRRdWVyeVJlc3VsdCA9IChkYXRhLCBxdWVyeSkgPT4ge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygn0J/QvtC70YPRh9C40LvQuCDQv9C+0LjRgdC60L7QstGD0Y4g0LLRi9C00LDRh9GDJywgZGF0YSk7XHJcblxyXG4gICAgICAgIC8vIFJlc2V0IGFsbCBjaGlsZHJlbiBub2RlcyBvZiBzZWFyY2ggaGludHNcclxuICAgICAgICB3aGlsZSAoc2VhcmNoSGludHMuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICBzZWFyY2hIaW50cy5yZW1vdmVDaGlsZChzZWFyY2hIaW50cy5maXJzdENoaWxkKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IGxpbmssIHNpbWlsYXIgb3IgTm8gUmVzdWx0XHJcbiAgICAgICAgY29uc3QgbGlua3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgIGxpbmtzLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcl9fc2VhcmNoLWxpbmtzJylcclxuXHJcbiAgICAgICAgY29uc3Qgc2ltaWxhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgc2ltaWxhci5jbGFzc0xpc3QuYWRkKCdoZWFkZXJfX3NlYXJjaC1zaW1pbGFyJylcclxuXHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIE5vIHJlc3VsdHNcclxuICAgICAgICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgICAgICBzcGFuLmNsYXNzTGlzdC5hZGQoJ25vLXJlc3VsdHMnKVxyXG4gICAgICAgICAgICBzcGFuLmlubmVyVGV4dCA9ICfQn9C+INCS0LDRiNC10LzRgyDQt9Cw0L/RgNC+0YHRgyDQvdC40YfQtdCz0L4g0L3QtSDQvdCw0LnQtNC10L3QvidcclxuICAgICAgICAgICAgbGlua3MuYXBwZW5kQ2hpbGQoc3BhbilcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBMaW5rc1xyXG4gICAgICAgICAgICBjb25zdCBoaW50ID0gZGF0YVswXVxyXG4gICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXHJcbiAgICAgICAgICAgIGxpbmsuaHJlZiA9IGhpbnQudXJsXHJcbiAgICAgICAgICAgIGxpbmsuaW5uZXJIVE1MID0gc2V0U3Ryb25nVGV4dChoaW50LnRpdGxlLCBxdWVyeSlcclxuICAgICAgICAgICAgbGlua3MuYXBwZW5kQ2hpbGQobGluaylcclxuXHJcbiAgICAgICAgICAgIC8vIFNpbWlsYXJcclxuICAgICAgICAgICAgc2ltaWxhci5pbm5lckhUTUwgPSAnPGg1PtGB0LzQvtGC0YDQuNGC0LUg0L/QvtGF0L7QttC40LU8L2g1PidcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgbnVtIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChudW0gPCAxKSBjb250aW51ZVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIExpbmtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhpbnQgPSBkYXRhW251bV1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcclxuICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IGhpbnQudXJsXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSW1hZ2VcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBpY1NwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgICAgICAgICAgICAgIHBpY1NwYW4uY2xhc3NMaXN0LmFkZCgncGljJylcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IGhpbnQuaW1hZ2VcclxuICAgICAgICAgICAgICAgIGltZy5hbHQgPSBoaW50LnRpdGxlXHJcbiAgICAgICAgICAgICAgICBwaWNTcGFuLmFwcGVuZENoaWxkKGltZylcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUZXh0XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICAgICAgICAgICAgdGV4dFNwYW4uY2xhc3NMaXN0LmFkZCgndGV4dCcpXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3Bhbi5pbm5lckhUTUwgPSBzZXRTdHJvbmdUZXh0KGhpbnQudGl0bGUsIHF1ZXJ5KVxyXG5cclxuICAgICAgICAgICAgICAgIGxpbmsuYXBwZW5kQ2hpbGQocGljU3BhbilcclxuICAgICAgICAgICAgICAgIGxpbmsuYXBwZW5kQ2hpbGQodGV4dFNwYW4pXHJcbiAgICAgICAgICAgICAgICBzaW1pbGFyLmFwcGVuZENoaWxkKGxpbmspXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG51bSA+IDYpIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmFwcGVuZENoaWxkKGxpbmtzKVxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHNlYXJjaEhpbnRzLmFwcGVuZENoaWxkKHNpbWlsYXIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQndGD0LbQvdC+INGC0L7Qu9GM0LrQviDQtNC70Y8g0L/QvtC70L3QvtCz0L4g0LzQtdC90Y5cclxuICAgICAgICAvLyBzZXRIYW5kbGVyVG9IZWxwZXJzKClcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgOTkyKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZldGNoU2VhcmNoaW5nRGF0YSA9IGFzeW5jIChxdWVyeSkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKFNFQVJDSF9SRVFVRVNUX1VSTCArIGA/cXVlcnk9JHtxdWVyeX1gKVxyXG5cclxuICAgICAgICAgICAgaWYgKCFyZXMub2spIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcign0J7RiNC40LHQutCwINC30LDQv9GA0L7RgdCwINC/0L7QuNGB0LrQsCcpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgICAgIHByaW50UXVlcnlSZXN1bHQoZGF0YSwgcXVlcnkpXHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNlYXJjaEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlID09PSAnJykge1xyXG4gICAgICAgICAgICBzZWFyY2hSZXNldC5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJylcclxuICAgICAgICAgICAgc2VhcmNoSGludHMuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpXHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChzZWFyY2hSZXF1ZXN0VGltZW91dElkKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlYXJjaFJlc2V0LmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKVxyXG5cclxuICAgICAgICAvLyAqKiogRmV0Y2hpbmcgc2VhcmNoIHJlcXVlc3RzIGFuZCBzaG93IHJlc3VsdHMgLS0tIFNUQVJUXHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHNlYXJjaFJlcXVlc3RUaW1lb3V0SWQpXHJcbiAgICAgICAgc2VhcmNoUmVxdWVzdFRpbWVvdXRJZCA9IHNldFRpbWVvdXQoXHJcbiAgICAgICAgICAgICgpID0+IGZldGNoU2VhcmNoaW5nRGF0YSh0aGlzLnZhbHVlKSxcclxuICAgICAgICAgICAgVEhST1RUTEVfVElNRU9VVFxyXG4gICAgICAgIClcclxuICAgICAgICAvLyAqKiogRmV0Y2hpbmcgc2VhcmNoIHJlcXVlc3RzIGFuZCBzaG93IHJlc3VsdHMgLS0tIEZJTklTSFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHNlYXJjaEhhbmRsZXJGb3JtSGVscGVyc0V2ZW50TGlzdGVuZXJzKVxyXG4gICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBzZWFyY2hIYW5kbGVyRm9ybUhlbHBlcnNFdmVudExpc3RlbmVycylcclxuXHJcbiAgICBzZWFyY2hSZXNldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIHNlYXJjaFJlc2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgIHNlYXJjaEhpbnRzLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKVxyXG4gICAgICAgIHJlc2V0SGFuZGxlckZvcm1IZWxwZXJzRXZlbnRMaXN0ZW5lcnMoKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpXHJcbiAgICB9KVxyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX3NlYXJjaC1mb3JtJykuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19zZWFyY2gtbGlua3MgYScpPy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcclxuICAgICAgICAgICAgaWYgKGxpbmsgJiYgbGluayAhPT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgICAgIGlmICghbGluay5zdGFydHNXaXRoKCdodHRwJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL9C/0YDQuNCy0L7QtNC40Lwg0Log0LDQsdGB0L7Qu9GO0YLQvdC+0LzRgyDQv9GD0YLQuFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgYCR7bGlua31gO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChsaW5rKVxyXG4gICAgICAgICAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoJ3NlYXJjaCcsIHNlYXJjaElucHV0LnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsLmhyZWYpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybC5ocmVmXHJcbiAgICAgICAgICAgICAgICB9LCA1MDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oZXJyb3IpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzU2VhcmNoVG9nZ2xlID0gZS50YXJnZXRcclxuICAgICAgICAgICAgLmNsb3Nlc3QoJy5oZWFkZXJfX2J1dHRvbnMtbGlua19zZWFyY2gnKVxyXG5cclxuICAgICAgICBjb25zdCBpc1NlYXJjaFBhbmVsID0gZS50YXJnZXRcclxuICAgICAgICAgICAgLmNsb3Nlc3QoJy5oZWFkZXJfX3NlYXJjaCcpXHJcblxyXG4gICAgICAgIGNvbnN0IGlzVGFjaERldmljZSA9IHdpbmRvdy5pbm5lcldpZHRoIDwgOTkyXHJcblxyXG4gICAgICAgIGlmICghaXNUYWNoRGV2aWNlICYmICFpc1NlYXJjaFBhbmVsICYmICFpc1NlYXJjaFRvZ2dsZSkge1xyXG4gICAgICAgICAgICB0b2dnbGVTZWFyY2hQYW5lbCh0cnVlKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgLy8gU2V0IGhlbHAgdGV4dCBmcm9tIGhlbHBlciBidXR0b24gdW5kZXIgdGhlIHNlYXJjaCBpbnB1dCB0byB0aGUgc2VhcmNoIHZhbHVlXHJcbiAgICBjb25zdCByZXF1ZXN0Q29tcGxldGlvbiA9IChlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYWRkaXRpb25WYWx1ZSA9IGUudGFyZ2V0LmlubmVyVGV4dFxyXG4gICAgICAgIHNlYXJjaElucHV0LnZhbHVlID0gYCR7c2VhcmNoSW5wdXQudmFsdWV9ICR7YWRkaXRpb25WYWx1ZX1gXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2V0SGFuZGxlclRvSGVscGVycyA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBzZWFyY2hIZWxwZXJzID0gQXJyYXkuZnJvbShkb2N1bWVudFxyXG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmhlYWRlcl9fc2VhcmNoLWhlbHBzIHNwYW4nKSlcclxuXHJcbiAgICAgICAgc2VhcmNoSGVscGVycy5mb3JFYWNoKGJ0biA9PiBidG5cclxuICAgICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVxdWVzdENvbXBsZXRpb24pKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlc2V0SGFuZGxlckZvcm1IZWxwZXJzRXZlbnRMaXN0ZW5lcnMgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoSGVscGVycyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX3NlYXJjaC1oZWxwcyBzcGFuJykpXHJcblxyXG4gICAgICAgIHNlYXJjaEhlbHBlcnMuZm9yRWFjaChidG4gPT4ge1xyXG4gICAgICAgICAgICBidG4ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXF1ZXN0Q29tcGxldGlvbilcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFN0aWNreSBoZWFkZXJcclxuICAgIGxldCBiZWZvcmVTY3JvbGxUb3AgPSAwXHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcclxuICAgICAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgICAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlYWRlclwiKVxyXG4gICAgICAgIGNvbnN0IGhlYWRlckhlaWdodCA9IGhlYWRlci5jbGllbnRIZWlnaHRcclxuICAgICAgICBjb25zdCBkZWxheSA9ICcuN3MnXHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50U2Nyb2xsVG9wID0gd2luZG93LnNjcm9sbFlcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID4gOTkxKSB7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2Nyb2xsVG9wID4gd2luZG93SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnY29tcHJlc3NlZCcpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnY29tcHJlc3NlZCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY3VycmVudFNjcm9sbFRvcCA+IDEwMCAmJiBjdXJyZW50U2Nyb2xsVG9wID4gYmVmb3JlU2Nyb2xsVG9wKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzVmlzaWJsZVNlYXJjaCA9IHNlYXJjaFBhbmVsXHJcbiAgICAgICAgICAgICAgICAuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXNpYmxlJylcclxuXHJcbiAgICAgICAgICAgIGxldCBpbnRlcnZhbElkXHJcblxyXG4gICAgICAgICAgICBpZiAoaXNWaXNpYmxlU2VhcmNoKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIuc3R5bGUudHJhbnNpdGlvbkRlbGF5ID0gZGVsYXlcclxuICAgICAgICAgICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKHRydWUpXHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlci5zdHlsZS50cmFuc2l0aW9uRGVsYXkgPSAnMHMnXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKVxyXG4gICAgICAgICAgICAgICAgfSwgMTAwMClcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRvcCA9IGAtJHtoZWFkZXJIZWlnaHR9cHhgXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaGVhZGVyLnN0eWxlLnRvcCA9IDBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGJlZm9yZVNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVG9nZ2xlIHNlYXJjaCBwYW5lbFxyXG4gICAgY29uc3QgY3VycmVudFVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpXHJcbiAgICBpZiAoY3VycmVudFVybC5zZWFyY2hQYXJhbXMuaGFzKCdzZWFyY2gnKSkge1xyXG4gICAgICAgIHNlYXJjaElucHV0LnZhbHVlID0gY3VycmVudFVybC5zZWFyY2hQYXJhbXMuZ2V0KCdzZWFyY2gnKVxyXG4gICAgICAgIHRvZ2dsZVNlYXJjaFBhbmVsKClcclxuICAgIH1cclxufSlcclxuXHJcbi8vIENhcnQgdXBkYXRlIGxpc3RlbmluZ1xyXG5jb25zdCBzZXRDYXJ0VXBkYXRlTGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjYXJ0UHJvZHVjdENvdW50Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYXJ0UHJvZHVjdENvdW50JylcclxuXHJcbiAgICBpZiAoIWNhcnRQcm9kdWN0Q291bnROb2RlKSByZXR1cm5cclxuXHJcbiAgICBjYXJ0UHJvZHVjdENvdW50Tm9kZS5hZGRFdmVudExpc3RlbmVyKCdjYXJ0VXBkYXRlRXZlbnQnLCBmdW5jdGlvbiAoZSkge1xyXG5cclxuICAgICAgICBjb25zdCBwcm9kdWN0cyA9IHdpbmRvdy5DQVJULnByb2R1Y3RzXHJcbiAgICAgICAgbGV0IHByb2R1Y3RDb3VudCA9IDBcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVyYXRvciBvZiBwcm9kdWN0cykge1xyXG4gICAgICAgICAgICBwcm9kdWN0Q291bnQgKz0gaXRlcmF0b3IuY291bnRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNhcnRQcm9kdWN0Q291bnROb2RlLmlubmVyVGV4dCA9IHByb2R1Y3RDb3VudFxyXG4gICAgICAgIGNhcnRQcm9kdWN0Q291bnROb2RlLmRhdGFzZXQuY291bnQgPSBwcm9kdWN0Q291bnQudG9TdHJpbmcoKVxyXG4gICAgICAgIGNhcnRQcm9kdWN0Q291bnROb2RlLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNhcnRQcm9kdWN0Q291bnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyksIDEwMDApXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGUuZGV0YWlsLm1lc3NhZ2UpXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHNldENhcnRVcGRhdGVMaXN0ZW5lcilcclxuXHJcbi8vIE9wZW4gYW5kIGNsb3NlIHN1Ykxpc3RzXHJcbmNvbnN0IHRvZ2dsZVN1Yk5hdkxpc3RzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgdG9nZ2xlcnMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXJfX25hdi1pbm5lci10b2dnbGUnKSlcclxuXHJcbiAgICBjb25zdCBjbG9zZUFsbFRvZ2dsZXJzID0gKCkgPT4ge1xyXG4gICAgICAgIHRvZ2dsZXJzLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB3cmFwID0gZWwuY2xvc2VzdCgnLmhlYWRlcl9fbmF2LWlubmVyLWNhcHRpb24nKVxyXG4gICAgICAgICAgICB3cmFwLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3BwZWQnKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgY29sbGFwc2UgPSB3cmFwLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX25hdi1zdWJsaXN0LWNvbGxhcHNlJylcclxuICAgICAgICAgICAgY29sbGFwc2UuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpXHJcblxyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlcnMuZm9yRWFjaChlbCA9PiBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBjb25zdCB3cmFwID0gZWwuY2xvc2VzdCgnLmhlYWRlcl9fbmF2LWlubmVyLWNhcHRpb24nKVxyXG4gICAgICAgIGNvbnN0IGNvbGxhcHNlID0gd3JhcC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19uYXYtc3VibGlzdC1jb2xsYXBzZScpXHJcbiAgICAgICAgY29uc3QgaXNDdXJyZW50RHJvcHBlZCA9IHdyYXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdkcm9wcGVkJylcclxuXHJcbiAgICAgICAgLy8gY2xvc2VBbGxUb2dnbGVycygpXHJcblxyXG4gICAgICAgIC8vIFRvZ2dsZSBjdXJyZW50XHJcbiAgICAgICAgaWYgKCFpc0N1cnJlbnREcm9wcGVkKSB7XHJcbiAgICAgICAgICAgIHdyYXAuY2xhc3NMaXN0LmFkZCgnZHJvcHBlZCcpXHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGNvbGxhcHNlLmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdyYXAuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcHBlZCcpXHJcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgICAgICAgIGNvbGxhcHNlLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKVxyXG4gICAgICAgIH1cclxuICAgIH0pKVxyXG5cclxuICAgIC8vIENsb3NlIGFsbCBzdWJuYXYgbGlzdCBvbiBvdXQgY2xpY2tcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXNUYXJnZXQgPSBlLnRhcmdldFxyXG4gICAgICAgICAgICAuY2xhc3NMaXN0XHJcbiAgICAgICAgICAgIC5jb250YWlucygnaGVhZGVyX19uYXYtaW5uZXItdG9nZ2xlJylcclxuXHJcbiAgICAgICAgaWYgKCFpc1RhcmdldCkgY2xvc2VBbGxUb2dnbGVycygpXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHRvZ2dsZVN1Yk5hdkxpc3RzKVxyXG4iLCIvLyBEZWxldGluZyBibG9ja2luZyBvZiBhbGwgYW5pbWF0aW9uIGZvciBmaXggYW5pbWF0aW9uIGFydGVmYWN0c1xyXG5jb25zdCByZW1vdmVBbmltYXRpb25CbG9ja2VyID0gKCkgPT4ge1xyXG4gICAgQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudHJhbnNpdGlvbi1ibG9ja2VyJykpXHJcbiAgICAgICAgLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZSgndHJhbnNpdGlvbi1ibG9ja2VyJykpXHJcbn1cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCByZW1vdmVBbmltYXRpb25CbG9ja2VyKVxyXG5cclxuLy8gQmxvY2tpbmcgYWxsIGFuaW1hdGlvbiBhdCB0aGUgd2luZG93IHJlc2l6aW5nIHByb2Nlc3NcclxuY29uc3QgYWRkQW5pbWF0aW9uQmxvY2tlciA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgndHJhbnNpdGlvbi1ibG9ja2VyJylcclxufVxyXG5cclxubGV0IGJsb2NrQW5pbWF0aW9uVGltZXJcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcclxuICAgIGNsZWFyVGltZW91dChibG9ja0FuaW1hdGlvblRpbWVyKVxyXG4gICAgd2luZG93LnNhZmVDYWxsKGFkZEFuaW1hdGlvbkJsb2NrZXIpXHJcblxyXG4gICAgYmxvY2tBbmltYXRpb25UaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5zYWZlQ2FsbChyZW1vdmVBbmltYXRpb25CbG9ja2VyKVxyXG4gICAgfSwgMzAwKVxyXG59KVxyXG5cclxuLy8gSGFuZGxlIGxpbmsgd2l0aCBzbW9vdGggYW5pbWF0aW9uIHRvIGFuY2hvciBwbGFjZSBvbiB0aGUgcGFnZVxyXG5jb25zdCBzbW9vdGhMaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2FbaHJlZl49XCIjXCJdJylcclxuZm9yIChsZXQgc21vb3RoTGluayBvZiBzbW9vdGhMaW5rcykge1xyXG4gICAgc21vb3RoTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIGNvbnN0IGlkID0gc21vb3RoTGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXROb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHtpZH1gKVxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRPZmZzZXQgPSB0YXJnZXROb2RlLm9mZnNldFRvcFxyXG4gICAgICAgICAgICBjb25zdCBkZXZpY2VPZmZzZXQgPSB3aW5kb3cub3V0ZXJXaWR0aCA+IDc2OCA/IC0xMDAgOiAtMjBcclxuXHJcbiAgICAgICAgICAgIHNtb290aFNjcm9sbFRvKHRhcmdldE9mZnNldCArIGRldmljZU9mZnNldCwgNzAwKVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUaGVyZSdzIG5vIHRhcmdldCBub2RlIGZvciBzY3JvbGxpbmcgdG8gcGxhY2UuIFRoZSBzZWxlY3RvciBpc24ndCBjb3JyZWN0IVwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59O1xyXG5cclxuLy8gQW5pbWF0aW9uIGl0ZW1zIHdoZW4gdXNlciBoYXMgc2Nyb2xsZWQgc2NyZWVuIHRvIHBsYWNlIG9mIGl0ZW1cclxuY29uc3QgY2hlY2tBbmltYXRpb25FbG1zID0gKCkgPT4ge1xyXG4gICAgY29uc3QgYW5pbWF0aW9uRWxtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmFuaW1hdGlvbi1lbGVtZW50JykpXHJcblxyXG4gICAgcmV0dXJuIGFuaW1hdGlvbkVsbXMubGVuZ3RoID4gMFxyXG59XHJcblxyXG5jb25zdCBzaG93QW5pbUVsZW1lbnRzID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZWxtcyA9IEFycmF5LmZyb20oZG9jdW1lbnRcclxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbCgnLmFuaW1hdGlvbi1lbGVtZW50JykpXHJcblxyXG4gICAgY29uc3Qgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0XHJcbiAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcclxuICAgIC8vIGNvbnN0IHBvaW50T2ZEaXNwbGF5ID0gd2luZG93SGVpZ2h0IC8gMS4yIC8vIGZvciBzaG93IG9uIHRoZSBoYWxmIG9mIHRoZSBzY3JlZW5cclxuICAgIGNvbnN0IHBvaW50T2ZEaXNwbGF5ID0gd2luZG93SGVpZ2h0XHJcblxyXG4gICAgZWxtcy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlRnJvbVRvcCA9IHJlY3QudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0XHJcblxyXG4gICAgICAgIGlmIChkaXN0YW5jZUZyb21Ub3AgLSBwb2ludE9mRGlzcGxheSA8IHNjcm9sbFRvcCkge1xyXG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdhbmltYXRpb24tZWxlbWVudCcpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAoIWNoZWNrQW5pbWF0aW9uRWxtcygpKSB7XHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNob3dBbmltRWxlbWVudHMpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHNldEFuaW1hdGlvbkVsbXMgPSAoKSA9PiB7XHJcbiAgICBpZiAoY2hlY2tBbmltYXRpb25FbG1zKCkpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2hvd0FuaW1FbGVtZW50cylcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChzaG93QW5pbUVsZW1lbnRzKVxyXG4gICAgd2luZG93LnNhZmVDYWxsKHNldEFuaW1hdGlvbkVsbXMpXHJcbn0pXHJcblxyXG4vLyBQaG9uZSBtYXNraW5nXHJcbmNvbnN0IGluaXRQaG9uZXNNYXNrID0gKCkgPT4ge1xyXG4gICAgY29uc3QgcGhvbmVJbnB1dHMgPSBBcnJheS5mcm9tKGRvY3VtZW50XHJcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPVwidGVsXCJdOm5vdCguY2FydF9fY2FsYyBbdHlwZT1cInRlbFwiXSknKSlcclxuXHJcbiAgICBwaG9uZUlucHV0cy5mb3JFYWNoKHBob25lID0+IHtcclxuICAgICAgICBjb25zdCBwaG9uZU1hc2tPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBtYXNrOiAnK3s3fSAoMDAwKSAwMDAtMDAtMDAnLFxyXG4gICAgICAgICAgICBsYXp5OiB0cnVlLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlckNoYXI6ICcjJ1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwaG9uZU1hc2sgPSBJTWFzayhcclxuICAgICAgICAgICAgcGhvbmUsXHJcbiAgICAgICAgICAgIHBob25lTWFza09wdGlvbnNcclxuICAgICAgICApXHJcblxyXG4gICAgICAgIHBob25lLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4gcGhvbmVNYXNrLnVwZGF0ZU9wdGlvbnMoe2xhenk6IGZhbHNlfSkpXHJcbiAgICAgICAgcGhvbmUuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IHBob25lTWFzay51cGRhdGVPcHRpb25zKHtsYXp5OiB0cnVlfSkpXHJcbiAgICB9KVxyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChpbml0UGhvbmVzTWFzaylcclxufSlcclxuXHJcbi8vIEZpeGluZyBjaGF0LTI0IHdpZGdldCBwb3NpdGlvbiAtLSBTVEFSVFxyXG5sZXQgY2hhdDI0SW50ZXJ2YWxJZCA9IG51bGxcclxubGV0IGNoYXQyNFRpbWVvdXRJZCA9IG51bGxcclxubGV0IGNoYXJ0MjRTdHlsZU5vZGUgPSBudWxsXHJcbmxldCBjaGFydDI0Tm9kZSA9IG51bGxcclxuXHJcbmNvbnN0IGZpeENoYXQyNFdpZGdldFBvc2l0aW9uID0gKCkgPT4ge1xyXG4gICAgY2hhcnQyNE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjaGF0LTI0JylcclxuXHJcbiAgICBpZiAoIWNoYXJ0MjROb2RlKSByZXR1cm5cclxuXHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCAxMDI0ICYmICFjaGFydDI0U3R5bGVOb2RlKSB7XHJcbiAgICAgICAgY2hhcnQyNFN0eWxlTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcclxuXHJcbiAgICAgICAgY2hhcnQyNFN0eWxlTm9kZS5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgICAgIC5zdGFydEJ0bi5zdGFydEJ0bi0tb3V0c2lkZS5zdGFydEJ0bi0tYm90dG9tIHtcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogNjdweDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAuc3RhcnRCdG4uc3RhcnRCdG4tLW9wZW4ge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDUwJSkgc2NhbGUoMC42KSAhaW1wb3J0YW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY2hhcnQyNE5vZGUuc2hhZG93Um9vdC5wcmVwZW5kKGNoYXJ0MjRTdHlsZU5vZGUpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IDEwMjQgJiYgY2hhcnQyNFN0eWxlTm9kZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjaGFydDI0U3R5bGVOb2RlJywgY2hhcnQyNFN0eWxlTm9kZSk7XHJcbiAgICAgICAgY2hhcnQyNFN0eWxlTm9kZS5yZW1vdmUoKVxyXG4gICAgICAgIGNoYXJ0MjRTdHlsZU5vZGUgPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJJbnRlcnZhbChjaGF0MjRJbnRlcnZhbElkKVxyXG4gICAgY2hhdDI0SW50ZXJ2YWxJZCA9IG51bGxcclxuXHJcbiAgICBjbGVhclRpbWVvdXQoY2hhdDI0VGltZW91dElkKVxyXG4gICAgY2hhdDI0VGltZW91dElkID0gbnVsbFxyXG59XHJcblxyXG5jb25zdCBjaGF0MjRSZW5kZXJMaXN0ZW5lciA9ICgpID0+IHtcclxuICAgIGNoYXQyNEludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmaXhDaGF0MjRXaWRnZXRQb3NpdGlvbiwgMTAwKVxyXG59XHJcblxyXG5jb25zdCBoYXJkUmVtb3ZlQ2hhdDI0UmVuZGVyTGlzdGVuZXIgPSAoKSA9PiB7XHJcbiAgICBjaGF0MjRUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBpZiAoY2hhdDI0SW50ZXJ2YWxJZCkgY2xlYXJJbnRlcnZhbChjaGF0MjRJbnRlcnZhbElkKVxyXG4gICAgfSwgMTAwMDApXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKGNoYXQyNFJlbmRlckxpc3RlbmVyKTtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbChoYXJkUmVtb3ZlQ2hhdDI0UmVuZGVyTGlzdGVuZXIpO1xyXG59KVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDEwMjQpIHtcclxuICAgICAgICB3aW5kb3cuc2FmZUNhbGwoY2hhdDI0UmVuZGVyTGlzdGVuZXIpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYXJ0MjRTdHlsZU5vZGUpIGNoYXJ0MjRTdHlsZU5vZGUucmVtb3ZlKClcclxufSlcclxuLy8gRml4aW5nIGNoYXQtMjQgd2lkZ2V0IHBvc2l0aW9uIC0tIEZJTklTSCIsIi8qKlxyXG4gKiDQpNC70LDQsywg0YPQutCw0LfRi9Cy0LDRjtGJ0LjQuSDQvdCwINGA0LXQttC40Lwg0YDQsNC30YDQsNCx0L7RgtC60LguXHJcbiAqIEB0eXBlIHtib29sZWFufVxyXG4gKlxyXG4gKiDQlNC70Y8g0YHQtdGA0LLQtdGA0LAg0LLQtdGA0YHRgtC60Lgg0YHQvtCx0LjRgNCw0YLRjCDQuCDQv9GD0YjQuNGC0Ywg0LIg0YDQtdC20LjQvNC1IERFVl9NT0RFID0gdHJ1ZVxyXG4gKiDQndCwINC/0YDQvtC0INC4INC00LXQsiDRgdC+0LHQuNGA0LDRgtGMINC4INC/0YPRiNC40YLRjCDQsiDRgNC10LbQuNC80LUgREVWX01PREUgPSBmYWxzZVxyXG4gKlxyXG4gKiDQkiDRgNC10LbQuNC80LUgREVWX01PREUgPSB0cnVlLCDQv9GA0Lgg0LvQvtC60LDQu9GM0L3QvtC5INGA0LDQt9GA0LDQsdC+0YLQutC1LFxyXG4gKiDRgtCw0LrQttC1INC90LXQvtCx0YXQvtC00LjQvNC+INC/0YDQsNCy0LjRgtGMINC/0YPRgtGMINC00L4g0YTQsNC50LvQsCBtYWluLmpzXHJcbiAqXHJcbiAqINCf0YDQuNC8LjogPHNjcmlwdCBzcmM9XCJodHRwOi8vbG9jYWxob3N0OtC90L7QvNC10YBf0L/QvtGC0LAvanMvbWFpbi5qc1wiIGRlZmVyPjwvc2NyaXB0PlxyXG4gKi9cclxuY29uc3QgREVWX01PREUgPSB3aW5kb3cuTU9ERSA9PT0gJ2RldicgLy8gZGV2IC0gdHJ1ZSwgYnVpbGQgLSBmYWxzZVxyXG5cclxuLy8gSW5pdCBjYXJ0IGN1c3RvbSBFdmVudFxyXG5jb25zdCBjYXJ0RXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoJ2NhcnRVcGRhdGVFdmVudCcsIHtcclxuICAgIGRldGFpbDoge1xyXG4gICAgICAgIG1lc3NhZ2U6ICdGaXJlZCBjYXJ0IHByb2R1Y3QgdXBkYXRlZCBjdXN0b20gRXZlbnQhJ1xyXG4gICAgfSxcclxuICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgY2FuY2VsYWJsZTogZmFsc2VcclxufSlcclxuXHJcbmNvbnN0IG5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEgPSAoZGF0YSkgPT4ge1xyXG4gICAgY29uc3QgcHJvZHVjdHMgPSBbXVxyXG5cclxuICAgIGlmIChkYXRhLmRvdHMpIHtcclxuICAgICAgICBkYXRhLmRvdHMuZm9yRWFjaChkb3QgPT4ge1xyXG4gICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHthcnRpY2xlOiBkb3QuaWQsIGNvdW50OiBkb3QuY291bnR9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLnByb2R1Y3RzKSB7XHJcbiAgICAgICAgZGF0YS5wcm9kdWN0cy5mb3JFYWNoKHByb2R1Y3QgPT4ge1xyXG4gICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHthcnRpY2xlOiBwcm9kdWN0LmFydGljbGUsIGNvdW50OiBwcm9kdWN0LmNvdW50fSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcHJvZHVjdHNcclxufVxyXG5cclxuLy8gTWV0aG9kcyB0byB3b3JrIHdpdGggY2FydCBmb3IgUFJPRFVDVFNcclxud2luZG93LnNldFByb2R1Y3RUb0NhcnQgPSBhc3luYyAoe2FydCwgY291bnR9KSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuc2hvdylcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGJ0LDQtdC8INGE0LjQutGB0LjRgNC+0LLQsNC90L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INGC0L7QstCw0YDQsCDQsiDQutC+0YDQt9C40L3QtTonLCBhcnQsICcgLSAnLCBjb3VudCk7XHJcblxyXG4gICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdhcnQnLCBhcnQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICA/IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtc2V0Lmpzb24nKVxyXG4gICAgICAgIDogYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvc2V0Jywge21ldGhvZDogJ1BPU1QnLCBib2R5OiBmb3JtRGF0YX0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGB0YLQuNC70Lgg0YLQvtCy0LDRgCDQsiDQutC+0YDQt9C40L3QtS4g0J/QvtC70YPRh9C40LvQuCDQvtGC0LLQtdGCJywgZGF0YSlcclxuXHJcbiAgICAgICAgcmV0dXJuIGRhdGFcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcign0J7RiNC40LHQutCwINGA0LDQt9C80LXRidC10L3QuNGPINGC0L7QstCw0YDQsCDQsiDQmtC+0YDQt9C40L3QtSEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkUHJvZHVjdFRvQ2FydCA9IGFzeW5jICh7YXJ0LCBjb3VudH0pID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5zaG93KVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCfQlNC+0LHQsNCy0LvQtdC90LjQtSDRgtC+0LLQsNGA0LAg0LIg0LrQvtGA0LfQuNC90YM6JywgYXJ0LCAnIC0gJywgY291bnQpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnYXJ0JywgYXJ0KVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdjb3VudCcsIGNvdW50KVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LWFkZC5qc29uJylcclxuICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2FkZCcsIHttZXRob2Q6ICdQT1NUJywgYm9keTogZm9ybURhdGF9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ9CU0L7QsdCw0LLQuNC70Lgg0YLQvtCy0LDRgCDQsiDQutC+0YDQt9C40L3Rgy4g0J/QvtC70YPRh9C40LvQuCDQtNCw0L3QvdGL0LUnLCBkYXRhKVxyXG4gICAgICAgIHJldHVybiBkYXRhXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDQtNC+0LHQsNCy0LvQtdC90LjRjyDRgtC+0LLQsNGA0LAg0LIg0JrQvtGA0LfQuNC90YMhINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cucmVtb3ZlUHJvZHVjdEZyb21DYXJ0ID0gYXN5bmMgKHthcnQsIGNvdW50fSkgPT4ge1xyXG4gICAgd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLnNob3cpXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ9Cj0LTQsNC70LXQvdC40LUg0YLQvtCy0LDRgNCwINC40Lcg0LrQvtGA0LfQuNC90Ys6JywgYXJ0LCAnIC0gJywgY291bnQpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnYXJ0JywgYXJ0KVxyXG4gICAgZm9ybURhdGEuYXBwZW5kKCdjb3VudCcsIGNvdW50KVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IERFVl9NT0RFXHJcbiAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LWRlbC5qc29uJylcclxuICAgICAgICA6IGF3YWl0IGZldGNoKCcvYWpheC9jYXJ0L2RlbCcsIHttZXRob2Q6ICdQT1NUJywgYm9keTogZm9ybURhdGF9KVxyXG5cclxuICAgIGlmIChyZXMub2spIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5oaWRlKSwgMzAwKVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcbiAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ9Cj0LTQsNC70LjQu9C4INGC0L7QstCw0YAg0LjQtyDQutC+0YDQt9C40L3Riy4g0J/QvtC70YPRh9C40LvQuCDQtNCw0L3QvdGL0LUnLCBkYXRhKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0YPQtNCw0LvQtdC90LjRjyDRgtC+0LLQsNGA0LAg0LjQtyDQmtC+0YDQt9C40L3RiyEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBNZXRob2RzIHRvIHdvcmsgd2l0aCBjYXJ0IGZvciBET1RTXHJcbndpbmRvdy5zZXREb3RUb0NhcnQgPSBhc3luYyAoe2lkLCBjb3VudH0pID0+IHtcclxuICAgIHdpbmRvdy5zYWZlQ2FsbCh3aW5kb3cuc3Bpbm5lci5zaG93KVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCfQoNCw0LfQvNC10YnQsNC10Lwg0YTQuNC60YHQuNGA0L7QstCw0L3QvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0JTQvtGC0L7QsiDQsiDQutC+0YDQt9C40L3QtTonLCBpZCwgJyAtICcsIGNvdW50KTtcclxuXHJcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2lkJywgaWQpXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoJ2NvdW50JywgY291bnQpXHJcblxyXG4gICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICA/IGF3YWl0IGZldGNoKCdodHRwczovL2FuYXJhZ2Fldi5naXRodWIuaW8vdGVjaG5vbGlnaHQubGF5b3V0L21vY2tzL2NhcnQtc2V0RG90Lmpzb24nKVxyXG4gICAgICAgIDogYXdhaXQgZmV0Y2goJy9hamF4L2NhcnQvc2V0Jywge21ldGhvZDogJ1BPU1QnLCBib2R5OiBmb3JtRGF0YX0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygn0KDQsNC30LzQtdGB0YLQuNC70Lgg0JTQvtGC0Ysg0LIg0LrQvtGA0LfQuNC90LUuINCf0L7Qu9GD0YfQuNC70Lgg0L7RgtCy0LXRgicsIGRhdGEpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0YDQsNC30LzQtdGJ0LXQvdC40Y8g0JTQvtGC0L7QsiDQsiDQmtC+0YDQt9C40L3QtSEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgfVxyXG59XHJcblxyXG53aW5kb3cuYWRkRG90VG9DYXJ0ID0gYXN5bmMgKG9yZGVyKSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuc2hvdylcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygn0JTQvtCx0LDQstC70LXQvdC40LUg0LTQvtGC0LAg0LIg0LrQvtGA0LfQuNC90YMuINCe0YLQv9GA0LDQstC70Y/QtdC8INC00LDQvdC90YvQtTonLCBvcmRlcilcclxuXHJcbiAgICBjb25zdCByZXMgPSBERVZfTU9ERVxyXG4gICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1hZGREb3QuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9hZGREb3QnLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9yZGVyKX0pXHJcblxyXG4gICAgaWYgKHJlcy5vaykge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gd2luZG93LnNhZmVDYWxsKHdpbmRvdy5zcGlubmVyLmhpZGUpLCAzMDApXHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKClcclxuICAgICAgICB3aW5kb3cuQ0FSVC5wcm9kdWN0cyA9IFsuLi5ub3JtYWxpemVSZXNwb25zZUNhcnREYXRhKGRhdGEpXVxyXG4gICAgICAgIHdpbmRvdy5zaG93TW9kYWxNc2coXCLQlNC+0LHQsNCy0LjQu9C4INCU0L7RgiDQsiDQutC+0YDQt9C40L3Rgy4g0J/QvtC70YPRh9C40LvQuCDQtNCw0L3QvdGL0LVcIiwgZGF0YSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0LTQvtCx0LDQstC70LXQvdC40Y8g0JTQvtGC0LAg0LIg0JrQvtGA0LfQuNC90YMhINCa0L7QtCDQvtGI0LjQsdC60Lg6JywgcmVzLnN0YXR1cylcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LnJlbW92ZURvdEZyb21DYXJ0ID0gYXN5bmMgKHtpZCwgY291bnR9KSA9PiB7XHJcbiAgICB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuc2hvdylcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygn0KPQtNCw0LvQtdC90LjQtSDQlNC+0YLQsCDQuNC3INC60L7RgNC30LjQvdGLOicsIGlkLCAnIC0gJywgY291bnQpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnaWQnLCBpZClcclxuICAgIGZvcm1EYXRhLmFwcGVuZCgnY291bnQnLCBjb3VudClcclxuXHJcbiAgICBjb25zdCByZXMgPSBERVZfTU9ERVxyXG4gICAgICAgID8gYXdhaXQgZmV0Y2goJ2h0dHBzOi8vYW5hcmFnYWV2LmdpdGh1Yi5pby90ZWNobm9saWdodC5sYXlvdXQvbW9ja3MvY2FydC1kZWxEb3QuanNvbicpXHJcbiAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9kZWxEb3QnLCB7bWV0aG9kOiAnUE9TVCcsIGJvZHk6IGZvcm1EYXRhfSlcclxuXHJcbiAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4gICAgICAgIHdpbmRvdy5DQVJULnByb2R1Y3RzID0gWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCfQo9C00LDQu9C40LvQuCBEb3Qg0LjQtyDQutC+0YDQt9C40L3Riy4g0J/QvtC70YPRh9C40LvQuCDQtNCw0L3QvdGL0LUnLCBkYXRhKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuc2FmZUNhbGwod2luZG93LnNwaW5uZXIuaGlkZSksIDMwMClcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKCfQntGI0LjQsdC60LAg0YPQtNCw0LvQtdC90LjRjyDQlNC+0YLQsCDQuNC3INCa0L7RgNC30LjQvdGLISDQmtC+0LQg0L7RiNC40LHQutC4OicsIHJlcy5zdGF0dXMpXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLyBDYXJ0IFByb3h5XHJcbmNvbnN0IGNhcnRHZXQgPSAodGFyZ2V0LCBwcm9wKSA9PiB7XHJcbiAgICByZXR1cm4gdGFyZ2V0W3Byb3BdXHJcbn1cclxuXHJcbmNvbnN0IGNhcnRTZXQgPSAodGFyZ2V0LCBwcm9wLCB2YWwpID0+IHtcclxuXHJcblxyXG4gICAgaWYgKHByb3AgPT09ICdwcm9kdWN0cycpIHtcclxuICAgICAgICAvLyDQn9GA0L7QstC10YDRjNGC0LUsINC+0YLQu9C40YfQsNC10YLRgdGPINC70Lgg0L3QvtCy0L7QtSDQt9C90LDRh9C10L3QuNC1INC+0YIg0YHRgtCw0YDQvtCz0L4g0LfQvdCw0YfQtdC90LjRjy5cclxuICAgICAgICBjb25zdCBpc19zYW1lID0gKHRhcmdldC5wcm9kdWN0cy5sZW5ndGggPT09IHZhbC5sZW5ndGgpICYmIHRhcmdldC5wcm9kdWN0cy5ldmVyeShcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGVsZW1lbnQsIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5hcnRpY2xlID09PSB2YWxbaW5kZXhdLmFydGljbGUgJiYgZWxlbWVudC5jb3VudCA9PT0gdmFsW2luZGV4XS5jb3VudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKCFpc19zYW1lKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdTRVRUSU5HJyk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0YXJnZXQnLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncHJvcCcsIHByb3ApO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndmFsJywgdmFsKTtcclxuXHJcbiAgICAgICAgICAgIHRhcmdldC5wcm9kdWN0cyA9IFsuLi52YWxdO1xyXG4gICAgICAgICAgICBjYXJ0RXZlbnQuZGV0YWlsLnByb2R1Y3RzID0gdGFyZ2V0LnByb2R1Y3RzO1xyXG4gICAgICAgICAgICAvLyBEaXNwYXRjaGluZyBjdXN0b20gY2FydCB1cGRhdGUgRXZlbnRcclxuICAgICAgICAgICAgY29uc3QgY2FydFByb2R1Y3RDb3VudE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NhcnRQcm9kdWN0Q291bnRcIik7XHJcbiAgICAgICAgICAgIGlmIChjYXJ0UHJvZHVjdENvdW50Tm9kZSkgY2FydFByb2R1Y3RDb3VudE5vZGUuZGlzcGF0Y2hFdmVudChjYXJ0RXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG5jb25zdCBpbml0Q2FydCA9IGFzeW5jICgpID0+IHtcclxuICAgIGlmICghd2luZG93LkNBUlQpIHtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzID0gREVWX01PREVcclxuICAgICAgICAgICAgPyBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hbmFyYWdhZXYuZ2l0aHViLmlvL3RlY2hub2xpZ2h0LmxheW91dC9tb2Nrcy9jYXJ0LWdldC5qc29uJylcclxuICAgICAgICAgICAgOiBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9nZXQnLCB7bWV0aG9kOiAnUE9TVCd9KVxyXG5cclxuICAgICAgICBpZiAocmVzLm9rKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXMuanNvbigpXHJcblxyXG4gICAgICAgICAgICB3aW5kb3cuQ0FSVCA9IG5ldyBQcm94eSh7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0czogWy4uLm5vcm1hbGl6ZVJlc3BvbnNlQ2FydERhdGEoZGF0YSldXHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIGdldDogY2FydEdldCxcclxuICAgICAgICAgICAgICAgIHNldDogY2FydFNldFxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ9CY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0LrQvtGA0LfQuNC90YMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gU1RBUlQnKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1Jlc3BvbnNlIGRhdGEnLCBkYXRhKVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnd2luZG93LkNBUlQnLCB3aW5kb3cuQ0FSVClcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ9CY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0LrQvtGA0LfQuNC90YMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRklOSVNIJyk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ9Ce0YjQuNCx0LrQsCDQt9Cw0L/RgNC+0YHQsCDQmtC+0YDQt9C40L3RiyEg0JrQvtC0INC+0YjQuNCx0LrQuDonLCByZXMuc3RhdHVzKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBpbml0Q2FydClcclxuXHJcbi8vIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4vLyAgICAgLy8g0L7RgtC60LvQsNC00YvQstCw0LXQvCDQvdCwIDEg0LzQuNC90YPRgtGDXHJcbi8vICAgICB3aW5kb3cuY2FydFVwZGF0ZUludGVydmFsID0gc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4ge1xyXG4vLyAgICAgICAgIGlmICh3aW5kb3cuQ0FSVCAhPT0gdW5kZWZpbmVkICYmICFERVZfTU9ERSkge1xyXG4vLyAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnL2FqYXgvY2FydC9nZXQnLCB7bWV0aG9kOiAnUE9TVCd9KVxyXG4vLyAgICAgICAgICAgICBpZiAocmVzLm9rKSB7XHJcbi8vICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKVxyXG4vLyAgICAgICAgICAgICAgICAgd2luZG93LkNBUlQucHJvZHVjdHMgPSBbLi4ubm9ybWFsaXplUmVzcG9uc2VDYXJ0RGF0YShkYXRhKV1cclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH0sIDMwMDAwKVxyXG4vLyB9LCA2MDAwMCkiXX0=
