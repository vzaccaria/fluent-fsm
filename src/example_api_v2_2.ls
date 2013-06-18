#!/usr/bin/env livescript
require! './fsmexpress'.fsm


{ EventEmitter } = require 'events'


    
fs = new fsm()

fs.define-as-states([   'II' 'SI' 'PI' 'OI' 
                        'IS' 'SS' 'PS' 'OS' 
                        'IP' 'SP' 'PP' 'OP' 
                        'IC' 'SC' 'PC' 'OC' 'error' ])

fs.define-as-initial('II')

rules = [   { from: 'I(.+)',                        at: 'anEvent' ,         jump-to: 'S-'    }
            { from: 'S(.+)',                        at: 'anEvent2',         jump-to: 'P-'    } 
            { from: 'P(.+)',                        at: 'anEvent3',         jump-to: 'O-'    } 
            { from: 'P(.+)',                        at: 'anotherEvent',     jump-to: 'II'    }
            { from: '(.+)I',                        at: 'anotherEvent2',    jump-to: '-S'    }
            { from: '(.+)S',                        at: 'anotherEvent3',    jump-to: '-P'    } 
            { from: 'OP'                            at: 'differentEvent' ,  jump-to: 'II'    }
            { from: '(.+)P'                         at: 'differentEvent2',  jump-to: '-I'    }  ]
            # { from: '(.+)',                         at: 'anEvent',          jump-to: 'error' } ]


for r in rules
    fs.add_rule r
    
fs.unfold()
fs.optimize()

red = "#9d261d"
gre = "#46a546"
blu = "#049cdb"

# GUI related stuff..
fs.prepare-emit()
fs.mark transition: '.+',       with-color: 'lightgrey'
fs.mark transition: '.+Open',   with-color: "#gre"
fs.mark transition: '.+Close',  with-dashed-color: "#gre"
fs.mark transition: 'failed.+', with-color: "indianred"
fs.mark state:      '.+',       with-color: 'lightgrey'
fs.mark state:      'error',    with-color: 'indianred'
fs.mark state:      fs.initial, with-color: "#gre"
fs.mark state:      fs.final,   with-color: "lightsteelblue"
console.log fs.data

fs.serve(6970, 'my fsm')

class tester extends EventEmitter
    ~> @set-max-listeners(0) 
     
    run_op: ~> 
        @emit 'anEvent'
        setTimeout(@run_tr, 300)
    
    run_tr: ~> 
        @emit 'anEvent2'
        setTimeout(@run_fl, 300)
    
    run_fl: ~> 
        @emit 'anotherEvent'
        setTimeout(@run_op, 300)


        # @emit 'triggerOpen'
        # @emit 'executedOpen'

tst = new tester()

fs.register-event-emitter(tst)  
fs.start()   

tst.run_op()
