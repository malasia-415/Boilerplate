// const knex = require('knex')
const app = require('./app')
// const { PORT, DB_URL } = require('./config')
const { PORT } = require('./config')


// const db = knex({
//     clinet: 'pg',
//     connection: DB_URL,
// })

// app.set('db', db)

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})