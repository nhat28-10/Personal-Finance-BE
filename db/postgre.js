const {Pool} = require('pg');

const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    connectionString: process.env.POSTGRE_URI
})

pool.connect()
  .then(() => console.log('Successfully connected to POSTGRESQL'))
  .catch((err) => console.log('Connection error to POSTGRESQL: ', err))

module.exports = pool;
