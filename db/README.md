## LIQUIBASE

http://www.liquibase.org/

### START A PSQL SERVER 

> docker kill some-postgres 
> docker rm some-postgres
> docker run --name some-postgres -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=1234 -e POSTGRES_DB=developer-arena -d postgres

### UPDATE

> docker run -v `pwd`/drivers:/drivers -v `pwd`/liquibase.yml:/liquibase.yml --link some-postgres:postgres -e "LIQUIBASE_URL=jdbc:postgresql://postgres/developer-arena" -e "LIQUIBASE_USERNAME=postgres" -e "LIQUIBASE_PASSWORD=1234" skillbillsrl/liquibase update


