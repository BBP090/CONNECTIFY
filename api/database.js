const { createPool } = require('mysql2')

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "your_password",
    database: "your_database_name"
})

module.exports= pool;