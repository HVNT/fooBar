# InfoVis project - Team fooBar

In order to develop locally, you must install:

- node and npm
- grunt and bower (using npm)
- ruby and gem
- compass and animation (using gem)

# cmds to get this shit up and purring:
```
    git clone git@github.com:HVNT/fooBar.git
    cd fooBar
    -> install npm (using brew or whatever) <-
    npm install
    gem install compass
    gem install animation --pre
    bower install
```

To develop using the mock backend
grunt develop.mock

To develop using the dev api:
-grunt develop.local

To build a demo (with mock backend)
-grunt build.demo

To build with the dev api
-grunt build.local

To build for production
-grunt build.prod

