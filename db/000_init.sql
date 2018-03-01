CREATE TYPE contest_status AS ENUM (
       'DRAFT',
       'ACTIVE',
       'PAST'
);

CREATE TABLE IF NOT EXISTS contest (
       id serial NOT NULL PRIMARY KEY,
       title varchar(100) NOT NULL,
       description varchar(500) NOT NULL,
       end_presentation date NOT NULL,
       end_applying date NOT NULL,
       end_voting date NOT NULL,
       state contest_status NOT NULL
);
