-- `images` table in `aws-file-upload-patterns` database
--CREATE DATABASE "aws-file-upload-patterns";

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL
);
