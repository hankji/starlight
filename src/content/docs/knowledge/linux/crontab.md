---
title: crontab
---
## crontab

```bash
* .---------------- minute (0 - 59)
* |  .------------- hour (0 - 23)
* |  |  .---------- day of month (1 - 31)
* |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
* |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7)  OR sun,mon,tue,wed,thu,fri,sat
* |  |  |  |  |
* *  *  *  *  *  command to be executed

  30 3  *  *  *  php /home/scripts/do_something.php
```

### Example:
  
```bash
*/5 * * * * root /usr/bin/flock -xn /data/business_logs/ad/shell/adm/order-import.lock -c '/opt/php/bin/php /opt/code/focusad/admin/yii order-import index >> /data/business_logs/ad/shell/adm/order-import.log 2>&1'
  ```
