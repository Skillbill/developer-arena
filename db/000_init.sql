CREATE TYPE contest_status AS ENUM (
       'DRAFT',
       'ACTIVE',
       'PAST'
);

CREATE DOMAIN userid AS varchar(32);

CREATE TABLE IF NOT EXISTS contest (
       id serial NOT NULL PRIMARY KEY,
       end_presentation timestamp NOT NULL,
       end_applying timestamp NOT NULL,
       end_voting timestamp NOT NULL,
       state contest_status NOT NULL
);

CREATE TABLE IF NOT EXISTS contest_i18n (
       id serial NOT NULL PRIMARY KEY,
       contest_id int REFERENCES contest(id) ON DELETE CASCADE,
       attribute varchar(20) NOT NULL,
       language varchar(2) NOT NULL,
       text text NOT NULL
);

CREATE TABLE IF NOT EXISTS judge_image (
       id serial NOT NULL PRIMARY KEY,
       mimetype varchar(32) NOT NULL,
       mtime timestamp NOT NULL,
       name varchar(100) NOT NULL,
       data bytea NOT NULL
);

CREATE TABLE IF NOT EXISTS judge (
       id serial NOT NULL PRIMARY KEY,
       name varchar(100) NOT NULL,
       email varchar(20),
       twitter varchar(20),
       site varchar(100),
       description text,
       image_id int REFERENCES judge_image(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS jury (
       id serial NOT NULL,
       contest_id int REFERENCES contest(id) ON DELETE CASCADE,
       judge_id int REFERENCES judge(id) ON DELETE CASCADE,
       UNIQUE(contest_id, judge_id)
);

CREATE TABLE IF NOT EXISTS project (
       id serial NOT NULL PRIMARY KEY,
       contest_id int REFERENCES contest(id) ON DELETE CASCADE,
       user_id userid NOT NULL,
       submitted timestamp NOT NULL,
       updated timestamp NOT NULL,
       title varchar(50) NOT NULL,
       description text NOT NULL,
       repo_url varchar(100),
       video varchar(64),
       approved boolean default false,
       has_preview boolean default false,
       UNIQUE(contest_id, user_id)
);

CREATE TYPE file_kind AS ENUM (
       'IMAGE',
       'DELIVERABLE'
);

CREATE TABLE IF NOT EXISTS file (
       id serial NOT NULL PRIMARY KEY,
       project_id int REFERENCES project(id) ON DELETE CASCADE,
       kind file_kind NOT NULL,
       mimetype varchar(32) NOT NULL,
       mtime timestamp NOT NULL,
       name varchar(100) NOT NULL,
       data bytea NOT NULL
);

CREATE TABLE IF NOT EXISTS vote (
       id serial NOT NULL,
       contest_id int REFERENCES contest(id) ON DELETE CASCADE,
       project_id int REFERENCES project(id) ON DELETE CASCADE,
       voter_id userid NOT NULL,
       ts timestamp NOT NULL,
       UNIQUE(contest_id, project_id, voter_id)
);
