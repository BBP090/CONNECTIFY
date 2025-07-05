const { createPool } = require('mysql2')

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "Shiroyasha4123",
    database: "photoupload"
})

module.exports= pool;