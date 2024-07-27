# gtfs2mysql

## How to use

- unzip the source files in the folder gtfs/provider (provider=tec or delijn or stib)
- create a mysqldb database named gtfs_tec or gtfs_delijn or gtfs_stib if not already existing
- run the node script gtfs2mysql-tec,gtfs2mysql-delijn or gtfs2mysql-stib
- give a username and a password that have a write access to the mysql db
- warning: if the db already exists, the content will be destroyed.
