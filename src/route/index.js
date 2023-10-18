// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.round(Math.random() * 100000)
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static getList = () => {
    return this.#list
  }
  static add = (product) => {
    this.#list.push(product)
  }
  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById(id, data) {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }
  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static update = (
    product,
    { name, price, description },
  ) => {
    if (name) {
      product.name = name
      product.price = price
      product.description = description
    }
  }
}
// ================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
//Відповідає за створення продукту
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)
  Product.add(product)

  res.render('alert', {
    style: 'alert',
    info: ' Успішне виконання діїї',
    description: 'Товар успішно був доданий/видалений',
  })
})

router.get('/product-list', function (req, res) {
  const list = Product.getList()
  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

router.get('/product-edit', function (req, res) {
  const { id } = req.query
  if (!id) {
    console.error('Товар з таким ID не знайдено')
  }
  Product.getById(Number(id))

  const list = Product.getList()
  console.log(list)
  res.render('product-edit', {
    style: 'product-edit',
    data: {
      products: {
        list,
      },
    },
  })
})

router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body

  let result = false

  const product = Product.getById(Number(id))

  if (product) {
    Product.update(product, { name, price, description })
    result = true
  }

  res.render('alert', {
    style: 'alert',
    info: result
      ? 'Успішне виконання дії'
      : 'Сталася помилка',
    description: 'Товар редаговано успішно',
  })
})

router.get('/product-delete', function (req, res) {
  const { id } = req.query
  console.log(typeof id)

  Product.deleteById(Number(id))
  res.render('alert', {
    style: 'alert',
    info: 'Товар видалено',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
