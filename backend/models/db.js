const mysql = require('mysql2/promise.js');
const dotenv = require("dotenv");
require('dotenv').config();


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Sanshu3007$',
  database: 'eventManagementSystem'
});

module.exports = pool;