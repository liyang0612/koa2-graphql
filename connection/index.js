const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'liyang',
  database: 'mysql_test' 
})

connection.connect();

const querySql = async (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, function(error, results, fields) {
      if (error) {
        reject(error)
      } else {
        resolve(results)
      }
    })
  })
}

exports.querySql = querySql;
