### 官网下载MySql
```
*community版
https://dev.mysql.com/downloads/file/?id=486028

*不需要注册和登录
注意 No thanks, just start my download.

work bench
https://dev.mysql.com/downloads/file/?id=485470

root 密码使用 md5旧版本模式


如果不小心使用了新密码方式(sha2):
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '你的密码';

  （这行代码有两层含义，第一:修改root的密码为'你的密码'，摒弃原来的旧密码。第二：使用mysql_native_password对新密码进行编码。）
  https://my.oschina.net/u/3295928/blog/1811804
```


### 数据库schema
```
/db/bpm_db.sql  panhuij

```

