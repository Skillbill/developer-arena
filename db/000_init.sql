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
       end_presentation timestamp NOT NULL,
       end_applying timestamp NOT NULL,
       end_voting timestamp NOT NULL,
       state contest_status NOT NULL
);

CREATE TABLE IF NOT EXISTS contest_i18n (
       id serial NOT NULL PRIMARY KEY,
       entity_id int not null,
       entity_attribute varchar(20) not null,
       language language_code not null,
       translation text not null
);

CREATE TABLE IF NOT EXISTS project (
       id serial NOT NULL PRIMARY KEY,
       contest_id int REFERENCES contest(id) NOT NULL,
       user_id varchar(32) NOT NULL,
       submitted timestamp NOT NULL,
       title varchar(50) NOT NULL,
       description text NOT NULL,
       repo_url varchar(100),
       filename varchar(100),
       UNIQUE(contest_id, user_id)
);

CREATE TABLE IF NOT EXISTS deliverable (
       id serial NOT NULL PRIMARY KEY,
       project_id int REFERENCES project(id) NOT NULL,
       mimetype varchar(32) NOT NULL,
       data bytea NOT NULL
);
