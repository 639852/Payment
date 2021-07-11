@@include('DynamicAdapt.js')
@@include('supportWebp.js')

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