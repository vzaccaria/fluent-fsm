#!/usr/bin/env livescript
require! {
    './fsmexpress'.fsm
}

{ EventEmitter } = require 'events'


    
fs = new fsm()

fs.define-as-initial('I')

rules = [   { from: 'I', jump-to: 'S',      at: 'x' }
            { from: 'S', jump-to: 'I',      at: 'y' } 
            { from: 'S', jump-to: 'T',      at: 'x' }
            { from: 'T', jump-to: 'I',      at: 'y' } ]

for r in rules
    fs.add_rule(r)            

fs.unfold()
fs.optimize()

red = "#9d261d"
gre = "#46a546"
blu = "#049cdb"

# GUI related stuff..
fs.prepare-emit()
fs.mark transition: 'x',       with-color: 'lightgrey'
fs.mark transition: 'y',       with-color: 'lightblue'

fs.serve(6970, 'my fsm')

class tester extends EventEmitter
    
    run_op: ~> 
        @emit 'x'
        setTimeout(@run_tr, 300)
    
    run_tr: ~> 
        @emit 'y'
        setTimeout(@run_fl, 300)
    
    run_fl: ~> 
        @emit 'x'
        setTimeout(@run_op, 300)


        # @emit 'triggerOpen'
        # @emit 'executedOpen'

tst = new tester()

fs.register-event-emitter(tst)  
fs.start()   

tst.run_op()
