<p align="center">
  <a href="#">
    <img src="https://github.com/rodrigogs/cannoneer/blob/master/media/logo.png" alt="Lyrics" />
  </a>

  <h3 align="center">Cannoneer</h3>

  <p align="center">
    Absurdly scalable Node.js message broker.
  </p>
</p>

## Status

[![Build Status](https://travis-ci.org/rodrigogs/cannoneer.svg?branch=master)](https://travis-ci.org/rodrigogs/cannoneer)
[![Code Climate](https://codeclimate.com/github/rodrigogs/cannoneer/badges/gpa.svg)](https://codeclimate.com/github/rodrigogs/cannoneer)
[![Test Coverage](https://codeclimate.com/github/rodrigogs/cannoneer/badges/coverage.svg)](https://codeclimate.com/github/rodrigogs/cannoneer/coverage)

Setup
-----
```bash
$ git clone git@github.com:rodrigogs/cannoneer.git
$ cd lyrics
$ yarn install
```

Development
-----------
* nodemon
  ```bash
  $ yarn start
  ```
* debug
  ```bash
  $ node --inspect=${DEBUG_PORT} ./bin/www
  ```
  
Production
----------
* docker
  ```bash
    $ docker-compose up .
  ```
* pm2
  ```bash
    $ npm install pm2 -g
    $ pm2 start ecosystem.config.js
  ```
