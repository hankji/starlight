---
title: LVM
description: A guide in my new Starlight docs site.
---
LVM && large partition

## parted

```
parted
(parted) select /dev/sdb
Using /dev/sdb
(parted) mklabel gpt
(parted) mkpart primary ext4 1 -1
(parted) set 1 lvm on
(parted) p
(parted) quit


* gpt not require
* fdisk /dev/sdb
* : p # print the partition table
* : t # change a partition's system id
* : 8e # LVM system id
* : p
* : q # quit
```

## LVM

* create

```
pvcreate /dev/sdb1
vgcreate vgdata /dev/sdb1
lvcreate -n lvdfs -L 1T vgdata
ll /dev/vgdata/
mkfs.ext4 /dev/vgdata/lvdfs

mkdir -p /data/dfs
mount /dev/vgdata/lvdfs /data/dfs

lvcreate -n lvbackup -L 1T vgdata
ll /dev/vgdata/
mkfs.ext4 /dev/vgdata/lvbackup

mkdir -p /data/backup
mount /dev/vgdata/lvbackup /data/backup
```

* fstab

```
vim /etc/fstab

/dev/mapper/vgdata-lvdfs         /data/dfs               ext4    defaults,noatime,nodiratime        0 0
/dev/mapper/vgdata-lvbackup      /data/backup            ext4    defaults,noatime,nodiratime        0 0
```

* extend

```
vgdisplay vgdata
lvextend -L +1T /dev/vgdata/lvdfs
* e2fsck -f /dev/vgdata/lvdfs # check inode, block etc.
resize2fs /dev/vgdata/lvdfs
```
