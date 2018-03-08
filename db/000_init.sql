CREATE TYPE contest_status AS ENUM (
       'DRAFT',
       'ACTIVE',
       'PAST'
);

CREATE TYPE language_code AS ENUM (
       'en',
       'it'
);

CREATE TABLE IF NOT EXISTS contest (
       id serial NOT NULL PRIMARY KEY,
       end_presentation date NOT NULL,
       end_applying date NOT NULL,
       end_voting date NOT NULL,
       state contest_status NOT NULL
);

CREATE TABLE IF NOT EXISTS contest_i18n (
       id serial NOT NULL PRIMARY KEY,
       entity_id int not null,
       entity_attribute varchar(20) not null,
       language language_code not null,
       translation text not null
);
