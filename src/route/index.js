// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []

  static #count = 0

  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count //Генеруємо унікальний id для товару
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }
  static getList = () => {
    return this.#list
  }
  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }
  static getRandomList = (id) => {
    // Фільтруємо товар, щоб вилучити той, з яким порівнюємо id
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )

    //Відсортовуємо за допомогою Math.random() та перемішаємо масив
    const shuffLedList = filteredList.sort(
      () => Math.random() - 0.5,
    )

    //Повертаємо перші 3 елементи з перемішаного масиву
    return shuffLedList.slice(0, 3)
  }
}

Product.add(
  'https://picsum.photos/200/300',
  "Комп'ютер Artline Gaming (x43v31) AMD Ryzen 5 3600/",
  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  "Комп'ютер ProLine Business (B112p19) Intel Core i5 9400F/",
  'Intel Core i5 9400F (2.9 - 4.1 ГГц) / RAM 8 ГБ / HDD 1 ТБ / Intel UMD Graphics 630 /',
  [{ id: 2, text: 'Топ продажів' }],
  20000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  "Комп'ютер ProLine Workstation (w67p03) Intel Xeon E-2226G/",
  ' Intel Xeon E-2226G (3.4 - 4.7 ГГц) / RAM 16 ГБ / SSD 512 ТБ / nVidia Quadro P620, 2 ГБ',
  [{ id: 1, text: 'Готовий до відправки' }],
  40000,
  10,
)
// ================================================================
class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1
  static #count = 0
  static #list = []

  static #bunusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bunusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)
    const currentBalance = Purchase.getBonusBalance(email)
    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bunusAccount.set(email, updatedBalance)
    console.log(email, updatedBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)
    this.#list.push(newPurchase)
    return newPurchase
  }

  static getList = () => {
    return Purchase.#list
      .reverse()
      .map(({ id, product, totalPrice, bonus }) => {
        return { id, product, totalPrice, bonus }
      })
  }
  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }
  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else {
      return false
    }
  }
}
// ================================================================
class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }
  static add = (name, factor) => {
    const newPromocode = new Promocode(name, factor)
    Promocode.#list.push(newPromocode)
    return newPromocode
  }
  //Шукає промодок по назві
  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }
  static calc = (promo, price) => {
    return price * promo.factor
  }
}
Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)
  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Помилка',
        description: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }
  const product = Product.getById(id)
  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Помилка',
        description: 'Товару не має в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }
  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',
    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт.)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body
  console.log(req.body)
  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Помилка',
        description: 'Товар не знайдено',
        link: `/purchase-create?id=${id}`,
      },
    })
  }
  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Помилка',
        description: 'Товару немає в потрібній кількості',
        link: `/purchase-create?id=${id}`,
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Помилка',
        description: 'Некоректні дані',
        link: `/purchase-create?id=${id}`,
      },
    })
  }
  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: "Заповніть обов'язкові поля",
        description: 'Некоректні дані',
        link: `/purchase-create?id=${id}`,
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }
    Purchase.updateBonusBalance(email, totalPrice, bonus)
    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }
  if (totalPrice < 0) totalPrice = 0
  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,
      comment,

      promocode,
    },
    product,
  )

  console.log(purchase)

  res.render('alert', {
    style: 'alert',
    data: {
      info: 'Успішно',
      description: 'Замовлення створено',
      link: `/purchase-list?id=${id}`,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/purchase-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Purchase.getList()

  const bonus = Purchase.calcBonusAmount(list[0].totalPrice)

  console.log(bonus)
  console.log('purchase-list:', list)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-list',
    component: ['heading', 'purchase-item', 'divider'],
    title: 'Мої замовлення',

    data: {
      purchases: {
        list,
      },
      bonus, // Отримати bonusAmount з параметрів URL
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// Підключаємо роутер до бек-енду

// ================================================================
// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/purchase-info', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)
  const bonus = Purchase.calcBonusAmount(
    purchase.totalPrice,
  )

  console.log('purchase:', purchase, bonus)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-info',
    component: ['heading', 'divider', 'button'],

    title: 'Інформація про замовлення',

    data: {
      id: purchase.id,
      firstname: purchase.firstname,
      lastname: purchase.lastname,
      phone: purchase.phone,
      email: purchase.email,
      delivery: purchase.delivery,
      product: purchase.product.title,
      comment: purchase.comment,
      productPrice: purchase.productPrice,
      deliveryPrice: purchase.deliveryPrice,
      totalPrice: purchase.totalPrice,
      bonus: bonus,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/purchase-change', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)

  console.log('purchase:', purchase)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-change', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-change',
    component: ['heading', 'divider', 'button', 'field'],

    title: 'Зміна данних',

    data: {
      id: purchase.id,
      // firstname: purchase.firstname,
      // lastname: purchase.lastname,
      // phone: purchase.phone,
      // email: purchase.email,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.get('/purchase-edit', function (req, res) {
  const id = Number(req.query.id)

  const purchase = Purchase.getById(id)

  if (!purchase) {
    // Якщо товар з таким id не знайдено, відображаємо повідомлення про помилку
    res.render('alert', {
      style: 'alert',
      component: ['button', 'heading'],

      isError: true,
      title: 'Помилка',
      info: 'Замовлення з таким ID не знайдено',
    })
  } else {
    // Якщо товар знайдено, передаємо його дані у шаблон product-edit
    res.render('purchase-edit', {
      style: 'purchase-edit',
      component: ['heading', 'divider', 'field', 'button'],

      title: 'Зміна данних замовлення',

      data: {
        id: purchase.id,
        firstname: purchase.firstname,
        lastname: purchase.lastname,
        phone: purchase.phone,
        email: purchase.email,
        delivery: purchase.delivery,
      },
    })
  }
})
module.exports = router
