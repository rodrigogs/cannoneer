<p align="center">
  <h3 align="center">cannoneer</h3>

  <p align="center">
    Absurdly scalable Node.js message broker.
  </p>

  <p align="center">
    <a href="https://heroku.com/deploy?template=https://github.com/rodrigogs/cannoneer">
      <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
    </a>
  </p>

  <p align="center">
   <a href="https://travis-ci.org/rodrigogs/cannoneer">
    <img src="https://travis-ci.org/rodrigogs/cannoneer.svg?branch=master" alt="Build Status">
   </a>

   <a href="https://codeclimate.com/github/rodrigogs/cannoneer">
    <img src="https://codeclimate.com/github/rodrigogs/cannoneer/badges/gpa.svg" alt="Code Climate">
   </a>

   <a href="https://codeclimate.com/github/rodrigogs/cannoneer/coverage">
    <img src="https://codeclimate.com/github/rodrigogs/cannoneer/badges/coverage.svg" alt="Test Coverage">
   </a>
  </p>
</p>

![Service Flow](https://github.com/rodrigogs/cannoneer/blob/master/media/flow.png)

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

TODO
----
* Finish authentication
