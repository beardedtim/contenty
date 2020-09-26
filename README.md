# Contenty

> A Content Management System for My Life

## Overview

This is a Content Management System built in Node using

- [Postgres][postgres] for the datastore
- [Knex][knex] for building SQL
- [Express][express] for HTTP Server
- [Pino][pino] for Logging

## Progress

You can track the progress of this project [here][internal-progress]

## TODO

This is a living list that outlines the concepts I want to add to this project.
It is a way to get a bird's eye view of what the system offers at this point in
time. If you do not see a feature outlined below, it probably is not in the pipeline
at this point. If you do not see a check next to the feature, it is probably not in
the system at this time.

- [x] CRUD `collections` 
  - [x] I can create a `collection`
    - [x] I can CRUD items from a `collection`
    - [x] I can create an item in a `collection`
    - [x] I can update an item in a `collection`
    - [x] I can delete an item in a `collection`
    - [x] I can read an item in a `collection`
    - [x] I can list items in a `collection`
  - [x] I can update a `collection`'s `name` or `slug`
  - [x] I can delete a `collection`

- [ ] Schemas for `collections`
  - [ ] I can create a schema for a `collection`
  - [ ] I can validate the schema for a `collection

- [ ] Query `collections`
  - [ ] I can search by field text
  - [ ] I can search by greater than/less than values
  - [ ] I can include only select keys of the items

- [ ] Join `collections`
  - [ ] I can store a relationship between two collections
    - [ ] I can get the `comments` from a `post`. 
    - [ ] I can get the `post` for a `comment`
  - [ ] I can get the relationships in a single query
    - [ ] I can make one request to get the `post` and the `comments` for that post

[postgres]: https://www.postgresql.org/
[knex]: http://knexjs.org/
[express]: http://expressjs.com/
[pino]: https://getpino.io/
[internal-progress]: /.progress/index.md