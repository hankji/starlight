---
title: awk学习
---

* 求和
  
  ```
    cat data|awk '{sum+=$1} END {print "Sum = ", sum}'
  ```
* 求平均
  
  ```
    cat data|awk '{sum+=$1} END {print "Average = ", sum/NR}'
  ```
* 求最大值
  
  ```
  cat data|awk 'BEGIN {max = 0} {if ($1>max) max=$1 fi} END {print "Max=", max}'
  ```
* 求最小值(min的初始值设置一个超大数即可)
  
  ```
  awk 'BEGIN {min = 1999999} {if ($1<min) min=$1 fi} END {print "Min=", min}'
  ```
