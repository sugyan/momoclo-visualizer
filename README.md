# momoclo visualizer #

## requires ##

- [PostgresSQL](http://www.postgresql.org/)
- [Memcached](http://memcached.org/)

## setup ##

    $ git clone git://github.com/sugyan/momoclo-visualizer.git
    $ cd momoclo-visualizer
    $ bundle install
    $ git submodule update --init
    $ memcached -d
    $ foreman start

## heroku ##

    $ heroku addons:add memcache
