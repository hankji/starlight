---
title: 常用 Drupal 数据库操作
---

## 查询

* 查询时联合查询要明显快于 in 查询
* SQL 关键字要大写，如 NULL, SELECT, FROM 等

```php
$result = db_select('info_submitcount', 't')
    ->fields('t', ['adate', 'count'])
    ->orderby('id', 'desc')
    ->range(0, 100)
    ->execute()
    ->fetchAll(PDO::FETCH_ASSOC); // 返回为数组
```

上面的另一种写法：

```php
$query = db_select('info_wishgift', 't');
$query->fields('t', ['userid']);
$query->addField('t', 'name', 'label'); // alias name
$query->condition('createdate', date('Y-m-d'), '!=');
$query->condition('status', 0);
$query->range(0, 10);
$result = $query->execute()->fetchAll(PDO::FETCH_ASSOC);
```

* 如下返回对象格式数据

```php
$sql = "SELECT count(*) c, DATE_FORMAT(created, :datef) d FROM {info_save} t GROUP BY d";
$giftresult = db_query($sql, [":datef" => '%Y-%m-%d']);
$giftarr = [];
while ($re2 = db_fetch_object($giftresult)) {
    $giftarr[$re2->d] = $re2->c;
}
/* 
$result3 = db_query("SELECT name, mobile, email, address, count(*) c FROM {info_wishcontent} a WHERE id IN (:tempid) GROUP BY mobile, email, name", [':tempid' => $temp]);
*/
```

* 直接取得数据

```php
$sumcount = db_select('info_wishcount', 't')
    ->condition('id', 1)
    ->fields('t', ['count'])
    ->execute()
    ->fetchField();
```

* 总行数

```php
$count = db_select('info_wishgift', 't')
    ->countQuery()
    ->condition('status', 0)
    ->execute()
    ->fetchField();
```

* 获取数据

```php
$fetch = db_select('moduleinfo', 't');
$set = $fetch->fields('t')
    ->condition('weight', '0', '>=')
    ->orderby('weight', 'asc')
    ->execute()
    ->fetchAll(PDO::FETCH_ASSOC);
```

* 联合查询

```php
$query = db_select('info_wishgift', 't');
$query->join('info_wishcontent', 'u', 't.userid = u.id'); // 或 Leftjoin, Rightjoin
$query->fields('u', ['name', 'mobile', 'email', 'address'])
    ->fields('t', ['giftprize']);
$query->condition('t.status', 0);
$result = $query->orderby('userid', 'desc')
    ->range(0, 100)
    ->execute()
    ->fetchAll(PDO::FETCH_ASSOC);
```

## 新增

```php
$result = db_insert('info_wishcount')
    ->fields(['count' => 1, 'adate' => date('Y-m-d H:i:s')])
    ->execute();

db_insert('info_wishgift')
    ->fields([
        'ip' => $ip,
        'createdate' => date('Y-m-d'),
        'created' => date('Y-m-d H:i:s'),
        'userid' => $m_id,
        'giftprize' => $m_prize
    ])
    ->execute();
```

## 修改

```php
db_update('info_wishgift')
    ->condition('userid', $re['id'])
    ->fields(['status' => 1])
    ->execute();

db_update('info_wishcount')
    ->condition('id', 1)
    ->expression('count', "count + :a", [':a' => 1])
    ->execute();
```

* +1 另一种写法:

```php
$my_update = db_update('flashmonitor_' . $arg);
$my_update->condition('time', date("y-m-d"));
$my_update->expression('act' . $id, 'act' . $id . "+1");
$result = $my_update->execute();

db_update('lottery_gift')
    ->expression('basenum', 'basenum + 1')
    ->expression('truenum', 'truenum - 1')
    ->condition('id', $gid)
    ->execute();
```

## 删除

```php
db_delete('info_wishgift')
    ->condition('userid', $userid)
    ->execute();
```
