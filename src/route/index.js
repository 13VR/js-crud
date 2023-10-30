// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Track {
  //Статичне приватне поле для зберігання Об'єктів Track
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) // Генеруємо випадкове id
    this.name = name
    this.author = author
    this.image = image
  }

  //Статичний метод для створення об'єкту Track і додавання його до списку #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  //Статичний метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse()
  }
  static getById = (id) => {
    return Track.#list.find((item) => item.id === id)
  }
}

Track.create(
  'Інь Янь',
  'MONATIK i ROXOLANA',
  'https://picsum.photos/100/100',
)
Track.create(
  'Baila Conmigo (Remix)',
  'SELENA GOMES i Rauw Alejandro',
  'https://picsum.photos/100/100',
)
Track.create(
  'ShameLess',
  'Camila Cebello',
  'https://picsum.photos/100/100',
)
Track.create(
  'DAKITI',
  'BAD BUNNY i JHAY',
  'https://picsum.photos/100/100',
)
Track.create(
  '11 PM',
  'Maluma',
  'https://picsum.photos/100/100',
)
Track.create(
  'Інша любов',
  'Enleo',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())
// ================================================================
class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000) // Генеруємо випадкове id
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }
  //Статичний метод для створення об'єкту Playlist і додавання його до списку #list
  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  //Статичний метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()
    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }
  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
  addTrack(trackId) {
    this.tracks = this.tracks.push(trackId)
  }
}

Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test1'))
Playlist.makeMix(Playlist.create('Test2'))
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.get('/spotify-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const isMix = !!req.query.isMix
  console.log(isMix)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-create',
    data: {
      isMix,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name
  if (!name) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Помилка',
        description: 'Введіть назву плейліста',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  return res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)
  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Помилка',
        description: 'Такого плейліста не знайдено',
        link: '/',
      },
    })
  }

  return res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)
  console.log('PLAYLIST', playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Помилка',
        description: 'Такого плейліста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }
  playlist.deleteTrackById(trackId)

  return res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/spotify-search', function (req, res) {
  const value = ''
  const list = Playlist.findListByValue(value)

  return res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''
  const list = Playlist.findListByValue(value)
  console.log(value)
  return res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  console.log('PLAYLISTID', playlistId)
  const playlist = Track.getList()
  console.log('PLAYLIST', playlist)

  return res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',
    data: {
      tracks: Track.getList(),
      playlistId,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId)
  const allTracks = Track.getList()

  console.log(playlistId, playlist)

  const trackId = Number(req.query.trackId)
  const trackFind = Track.getById(trackId)
  console.log('TRACKFIND', trackFind)
  playlist.tracks.push(trackFind)

  if (trackFind.id === trackId) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Помилка',
        description: 'Такий трек вже додано',
        link: `/spotify-track-add?playlistId=${playlistId}`,
      },
    })
  }

  if (!trackFind) {
    return res.render('alert', {
      style: 'alert',
      data: {
        info: 'Помилка',
        description: 'Такого треку не знайдено',
        link: `/spotify-track-add?playlistId=${playlistId}`,
      },
    })
  }

  return res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks.reverse(),
      name: playlist.name,
      // link: `/spotify-track-add?playlistId=${playlistId}&trackId==${id}`,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// // Шлях POST для додавання треку до плейліста
// router.post('/spotify-track-add', function (req, res) {
//   const playlistId = Number(req.body.playlistId)
//   const trackId = Number(req.query.trackId)
//   const playlist = Playlist.getById(playlistId)

//   const trackFind = Track.getById(trackId)
//   console.log('TRACKFIND', trackFind)

//   if (!playlist) {
//     return res.render('alert', {
//       style: 'alert',
//       data: {
//         info: 'Помилка',
//         description: 'Такого плейліста не знайдено',
//         link: `/spotify-playlist?id=${playlistId}`,
//       },
//     })
//   }

//   const trackToAdd = Track.getList().find(
//     (track) => track.id === trackId,
//   )
//   console.log(trackToAdd)
//   // playlist.addTrack(trackId)

//   if (!trackToAdd) {
//     return res.render('alert', {
//       style: 'alert',
//       data: {
//         info: 'Помилка',
//         description: 'Такого треку не знайдено',
//         link: `/spotify-track-add?playlistId=${playlistId}`,
//       },
//     })
//   }

//   playlist.tracks.push(trackToAdd)

//   res.render('spotify-playlist', {
//     style: 'spotify-playlist',
//     data: {
//       playlistId: playlist.id,
//       tracks: playlist.tracks,
//       name: playlist.name,
//     },
//   })
// })

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-library', function (req, res) {
  const list = Playlist.getList()

  res.render('spotify-library', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-library',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-choose', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

module.exports = router
