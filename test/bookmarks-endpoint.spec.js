const knex = require('knex')
const fixtures = require('./bookmarks-fixtures')
const app = require('../src/app')

describe('Bookmarks Endpoints', () => {
    let db
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('cleanup', () => db('bookmarks').truncate())
  
    afterEach('cleanup', () => db('bookmarks').truncate())
  
    describe(`Unauthorized requests`, () => {
      const testBookmarks = fixtures.makeBookmarksArray()
  
      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      })

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
  
      it(`responds with 401 Unauthorized for GET /bookmarks/:id`, () => {
        const secondBookmark = testBookmarks[1]
        return supertest(app)
          .get(`/bookmarks/${secondBookmark.id}`)
          .expect(401, { error: 'Unauthorized request' })
      })
  
      it(`responds with 401 Unauthorized for DELETE /bookmarks/:id`, () => {
        const aBookmark = testBookmarks[1]
        return supertest(app)
          .delete(`/bookmarks/${aBookmark.id}`)
          .expect(401, { error: 'Unauthorized request' })
      })
    })
  
    describe('GET /bookmarks', () => {
      context(`Given no bookmarks`, () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app)
            .get('/bookmarks')
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(200, [])
        })
      })
  
      context('Given there are bookmarks in the database', () => {
        const testBookmarks = fixtures.makeBookmarksArray()
  
        beforeEach('insert bookmarks', () => {
          return db
            .into('bookmarks')
            .insert(testBookmarks)
        })
  
        it('gets the bookmarks from the store', () => {
          return supertest(app)
            .get('/bookmarks')
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .expect(200, testBookmarks)
        })
      })