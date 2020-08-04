const app = require('../src/app')
const store = require('../src/store')

describe('Bookmarks Endpoints', () => {
  let bookmarksCopy
  beforeEach('copy the bookmarks', () => {
    // copy the bookmarks so we can restore them after testing
    bookmarksCopy = store.bookmarks.slice()
  })

  afterEach('restore the bookmarks', () => {
    // restore the bookmarks back to original
    store.bookmarks = bookmarksCopy
  })

  describe(`Unauthorized requests`, () => {
    it(`responds with 401 Unauthorized for GET /bookmarks`, () => {
      return supertest(app)
        .get('/bookmarks')
        .expect(401, { error: 'Unauthorized request' })
    })

    it(`responds with 401 Unauthorized for POST /bookmarks`, () => {
      return supertest(app)
        .post('/bookmarks')
        .send({ title: 'test-title', url: 'http://some.thing.com', rating: 1 })
        .expect(401, { error: 'Unauthorized request' })
    })
