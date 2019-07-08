const mysql = require('mysql')

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12345678',
  database : 'Tables'  //数据库
});

connection.connect((error) => {
  if (error) {
    console.log('数据库连接失败,详情：',error)
  } else {
    console.log('数据库连接成功')
  }
})

module.exports = connection
