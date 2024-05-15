**Note:** Be sure to create a database with the name defined as `SQL_CONN_DB` in `config.prod.secret` before the initial run of the application! You can do this via `docker exec` into the mysql container.

build
```bash
docker build . -t ctnelson1997/cs571-badgerauth
docker push ctnelson1997/cs571-badgerauth
```

run
```bash
docker pull ctnelson1997/cs571-badgerauth
docker run --name=cs571_badgerauth -d --restart=always -p 37199:37199 -v /cs571/badgerauth:/cs571 ctnelson1997/cs571-badgerauth
```