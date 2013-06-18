#!/usr/bin/env lsc

{ generate-makefile, generate-makefile-config, all } = require 'lakefile'

## Lakefile starts here.
my-files = [ { files-of-type: \ls, in: "./js" } ]

pre-vendor-files = [
    "./assets/components/jquery/jquery.js"
    "./assets/components/bootstrap/js/bootstrap-transition.js"
    "./assets/components/bootstrap/js/bootstrap-alert.js"
    "./assets/components/bootstrap/js/bootstrap-modal.js"
    "./assets/components/bootstrap/js/bootstrap-dropdown.js"
    "./assets/components/bootstrap/js/bootstrap-scrollspy.js"
    "./assets/components/bootstrap/js/bootstrap-tab.js"
    "./assets/components/bootstrap/js/bootstrap-tooltip.js"
    "./assets/components/bootstrap/js/bootstrap-popover.js"
    "./assets/components/bootstrap/js/bootstrap-button.js"
    "./assets/components/bootstrap/js/bootstrap-collapse.js"
    "./assets/components/bootstrap/js/bootstrap-carousel.js"
    "./assets/components/bootstrap/js/bootstrap-typeahead.js"
    "./assets/components/moment/moment.js"
    "./assets/components/showdown/src/showdown.js"
    "./js/d3.v2.js"
    "./js/force-fsm.js"
]
 
vendor-files = [ { name: s, type: \js } for s in pre-vendor-files ]
                 
css-files   = [  { name: "./assets/components/bootstrap/less/bootstrap.less", type: \less } 
                 { name: "./assets/components/bootstrap/less/responsive.less", type: \less } ]

img-files = [   { files-of-type: \png,  in: "./assets/img/backgrounds"} ]

trigger-dir = [ { files-of-type: \less, in: "./assets/components/bootstrap/less" } ]

other-targets = '''
\t -mkdir -p deploy/static/data
\t cp data/*.json deploy/static/data 
\n
js/init-page.ls: js/init-page.ls.template ../../README.md
\t ./tools/insert.ls ./js/init-page.ls.template -s ../../README.md > ./js/init-page.ls

update-web: deploy
\t ./tools/deploy.coffee -s ./deploy/static -c "/Users/zaccaria/development/github/fluent-fsm/showcase/fsmexpress" -w "./fluent-fsm" deploy -v -e
'''



files = 
        client-js:  my-files, 
        vendor-js:  vendor-files, 
        client-css: css-files, 
        client-img: img-files,
        silent: false,
        client-html: [ { name: "./assets/index.jade", type: \jade, +root, +serve} ] 
        trigger-files: [ "./assets/components/bootstrap/less" ] 
        additional-commands: other-targets

 
        

                     
generate-makefile( files )





