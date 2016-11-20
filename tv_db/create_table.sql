CREATE TABLE tv (
    origin_country varchar(50),
    poster_path varchar(50),
    name varchar(250),
    overview varchar,
    popularity numeric,
    original_name varchar(100),
    backdrop_path varchar(50),
    first_air_date date,
    vote_count int,
    vote_average numeric,
    original_language varchar(50),
    id int NOT NULL,
    genre_ids varchar(50),
    PRIMARY KEY (id)
);
