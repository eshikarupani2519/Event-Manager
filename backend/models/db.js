const mysql = require('mysql2/promise.js');
const dotenv = require("dotenv");
require('dotenv').config();


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'SahilNihalani2005',
  database: 'eventManagementSystem'
});

module.exports = pool;