#!/usr/bin/env lsc 

{ wmake } = require 'wmake'

server-files = [ { name: "./src/fsmexpress.ls", type: \ls } 
                 { name: "./test/test.ls", type: \ls, +test } ]


files = server-js:  server-files
                     
wmake({ deploy-dir: "./lib", local-server-dir: "." }, files)
