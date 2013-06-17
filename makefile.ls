#!/usr/bin/env lsc 

{ make-ps } = require 'lakefile'

server-files = [ { name: "./src/fsmexpress.ls", type: \ls } 
                 { name: "./test/test.ls", type: \ls, +test } ]


files = server-js:  server-files
#        client-js:  client-files, 
#        vendor-js:  vendor-files, 
#        client-css: css-files, 
#        silent: true,
#        client-html: [ { name: "./assets/index.jade", type: \jade, +root, +serve} ]
#        additional-commands: '\t ../swiss_tool/deploy.coffee -s ./deploy/static -c "/Users/zaccaria/watchdog_2.0" -w "./srvwtch2" deploy -v -t -e'

                     
make-ps({ deploy-dir: "./lib", local-server-dir: "." }, files)
