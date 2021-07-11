'use strict'

function DynamicAdapt (type) {
  this.type = type
}

DynamicAdapt.prototype.init = function () {
  const _this = this
  // массив объектов
  this.оbjects = []
  this.daClassname = '_dynamic_adapt_'
  // массив DOM-элементов
  this.nodes = document.querySelectorAll('[data-da]')

  // наполнение оbjects объктами
  for (let i = 0; i < this.nodes.length; i++) {
    const node = this.nodes[i]
    const data = node.dataset.da.trim()
    const dataArray = data.split(',')
    const оbject = {}
    оbject.element = node
    оbject.parent = node.parentNode
    оbject.destination = document.querySelector(dataArray[0].trim())
    оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767'
    оbject.place = dataArray[2] ? dataArray[2].trim() : 'last'
    оbject.index = this.indexInParent(оbject.parent, оbject.element)
    this.оbjects.push(оbject)
  }

  this.arraySort(this.оbjects)

  // массив уникальных медиа-запросов
  this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
    return '(' + this.type + '-width: ' + item.breakpoint + 'px),' + item.breakpoint
  }, this)
  this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
    return Array.prototype.indexOf.call(self, item) === index
  })

  // навешивание слушателя на медиа-запрос
  // и вызов обработчика при первом запуске
  for (let i = 0; i < this.mediaQueries.length; i++) {
    const media = this.mediaQueries[i]
    const mediaSplit = String.prototype.split.call(media, ',')
    const matchMedia = window.matchMedia(mediaSplit[0])
    const mediaBreakpoint = mediaSplit[1]

    // массив объектов с подходящим брейкпоинтом
    const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
      return item.breakpoint === mediaBreakpoint
    })
    matchMedia.addListener(function () {
      _this.mediaHandler(matchMedia, оbjectsFilter)
    })
    this.mediaHandler(matchMedia, оbjectsFilter)
  }
}

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
  if (matchMedia.matches) {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i]
      оbject.index = this.indexInParent(оbject.parent, оbject.element)
      this.moveTo(оbject.place, оbject.element, оbject.destination)
    }
  } else {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i]
      if (оbject.element.classList.contains(this.daClassname)) {
        this.moveBack(оbject.parent, оbject.element, оbject.index)
      }
    }
  }
}

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
  element.classList.add(this.daClassname)
  if (place === 'last' || place >= destination.children.length) {
    destination.insertAdjacentElement('beforeend', element)
    return
  }
  if (place === 'first') {
    destination.insertAdjacentElement('afterbegin', element)
    return
  }
  destination.children[place].insertAdjacentElement('beforebegin', element)
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
  element.classList.remove(this.daClassname)
  if (parent.children[index] !== undefined) {
    parent.children[index].insertAdjacentElement('beforebegin', element)
  } else {
    parent.insertAdjacentElement('beforeend', element)
  }
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
  const array = Array.prototype.slice.call(parent.children)
  return Array.prototype.indexOf.call(array, element)
}

// Функция сортировки массива по breakpoint и place
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
  if (this.type === 'min') {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0
        }

        if (a.place === 'first' || b.place === 'last') {
          return -1
        }

        if (a.place === 'last' || b.place === 'first') {
          return 1
        }

        return a.place - b.place
      }

      return a.breakpoint - b.breakpoint
    })
  } else {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0
        }

        if (a.place === 'first' || b.place === 'last') {
          return 1
        }

        if (a.place === 'last' || b.place === 'first') {
          return -1
        }

        return b.place - a.place
      }

      return b.breakpoint - a.breakpoint
    })
  }
}

const da = new DynamicAdapt('max')
da.init()

function testWebP (callback) {
  const webP = new Image()
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2)
  }
  webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
}

testWebP(function (support) {
  if (support == true) {
    document.querySelector('body').classList.add('webp')
  } else {
    document.querySelector('body').classList.add('no-webp')
  }
})


// Всплывающие окна
const product = document.querySelector('.form__product').cloneNode(true)
const submitBtn = document.querySelector('.form .form__btn')
const popupLink = document.querySelector('.popup__link')

popupLink.addEventListener('click', e => {
  const popupName = popupLink.getAttribute('href').replace('#', '')
  const currentPopup = document.getElementById(popupName)

  popupOpen(currentPopup)

  e.preventDefault()
})

function popupOpen (currentPopup) {
  currentPopup.classList.add('open')

  addProducts()
}
  
const continueBtn = document.querySelector('.popup .form__btn')
const inputs = document.querySelectorAll('.adding__input')
let counter = 1

inputs.forEach(el => {
  el.addEventListener('focus', () => {
    counter = +el.getAttribute('id').replace('check-', '')
  })
})

function addProducts() {
  continueBtn.addEventListener('click', e => {
    const amountProducts = document.querySelectorAll('.form__product')

    for (const product of amountProducts) {
      product.remove()
    }

    for (let i = 0; i < counter; i++) {
      if (counter !== 1) {
        product.querySelector('h2').innerHTML = `Product ${i + 1}<img src="img/add.svg" alt="" class="remove">`
      } else {
        product.querySelector('h2').innerText = 'Product 1'
      }

      popupLink.insertAdjacentHTML('beforebegin', `${product.outerHTML}`)

      changeInscription(counter)

      let removeBtns = document.querySelectorAll('.remove')

      removeBtns.forEach(el => {
        el.addEventListener('click', () => {
          el.parentElement.parentElement.remove()

          removeBtns = document.querySelectorAll('.remove')
          changeInscription(removeBtns.length)
        })
      })
    }

    e.target.closest('.popup').classList.remove('open')

    e.preventDefault()
  })
}

function changeInscription(amount) {
  switch (amount) {
    case 1:
      submitBtn.innerText = 'Submit and Pay 24.99 USD'
      break;
    case 2:
      submitBtn.innerText = 'Submit and Pay 44 USD'
      break;
    case 3:
      submitBtn.innerText = 'Submit and Pay 60 USD'
      break;
    case 4:
      submitBtn.innerText = 'Submit and Pay 72 USD'
      break;
    case 5:
      submitBtn.innerText = 'Submit and Pay 80 USD'
      break;
  
    default:
      submitBtn.innerText = 'Submit and Pay 0 USD'
      break;
  }
}

const popupSuccess = document.querySelector('.popup-success')
const popupFailed = document.querySelector('.popup-failed')

openPopupPayment(popupSuccess)

function openPopupPayment(currentPopup) {
  submitBtn.addEventListener('click', e => {
    submitBtn.innerHTML = '<img src="img/loading.svg" alt="" class="loading">'
    submitBtn.classList.add('load')

    setTimeout(() => {
      currentPopup.closest('.popup').classList.add('open')
      
      if (currentPopup == popupSuccess) {
        window.history.pushState({}, '', '/paymentsuccess')
      } else {
        window.history.pushState({}, '', '/paymenterror')
      }
    }, 2000)

    e.preventDefault()
  })

  currentPopup.querySelector('.form__btn').addEventListener('click', e => {
    e.target.closest('.popup').classList.remove('open')
    document.querySelector('.form').reset()

    changeInscription(counter)
    submitBtn.classList.remove('load')

    window.history.back()

    e.preventDefault()
  })
}