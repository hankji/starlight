---
title: mysql常用命令
description: mysql常用命令.
---

* 建库: 

  ```sql
  CREATE DATABASE "mango" DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
  ```

* 建用户: 

  ```sql
  GRANT privileges ![pic](columns) ON what TO user IDENTIFIED BY "password" WITH GRANT OPTION;
  可以分割爲:
  CREATE USER username IDENTIFIED BY 'password';
  GRANT SELECT, INSERT,UPDATE ON test.user TO wgv;
  ```

* 修改表自增值:  

  ```sql
  ALTER TABLE `mg_effect_bill_list` auto_increment = 1;
  ```

* 导出库表结构: 
  ```sql
  mysqldump --opt -d mango -u root > mango_20150123.sql
  ```

* 导出指定表的结构和数据: 
  ```sql
  mysqldump -uroot --tables mango mg_line mg_privilege mg_region mg_role mg_user > mango_init_data.sql
  ```

* 备份：
  
  ```sql
  mysql 命令行备份: mysqldump --add-drop-database --default-character-set=utf8 --add-drop-table -R --databases  ktcm > ktcm.sql
  mysql 数据库导入: mysql -uroot -p ;  use mipp  ; source /root/mipp.sql
  mysql连接:    mysql -hhostname -uusername -ppassword -Pport dbname
  mysql数据库编码: use mipp; show variables like '%char%'; 
  mysql数据库导出结构: mysqldump --opt -d databases -u root -p > /...../xxx.sql
  ```
