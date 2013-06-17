#!/usr/bin/env livescript
require! {
    'fsmexpress'.fsm
    'fsmexpress'.any-of
}

{ EventEmitter } = require 'events'


    
fs = new fsm()

fs.define-as-states([   'II' 'SI' 'PI' 'OI' 
                        'IS' 'SS' 'PS' 'OS' 
                        'IP' 'SP' 'PP' 'OP' 
                        'IC' 'SC' 'PC' 'OC' 'error' ])

fs.define-as-initial('II')

fs.from('I(.+)').but-not-from(any-of(['IP' 'IC']))      .on('anEvent') .next-is('S-').otherwise-is('error')
fs.from('S(.+)').but-not-from(any-of(['SP' 'SC']))      .on('anEvent2').next-is('P-').otherwise-is('error')
fs.from('P(.+)').but-not-from(any-of(['PC']))           .on('anEvent3').next-is('O-').otherwise-is('error')
fs.from('P(.+)').but-not-from(any-of(['PP' 'PC']))      .on('anotherEvent').next-is('II').otherwise-is('error')
fs.from('(.+)I')                                        .on('anotherEvent2').next-is('-S').otherwise-is('error')
fs.from('(.+)S').but-not-from(any-of(['IS' 'SS' 'PS'])) .on('anotherEvent3').next-is('-P').otherwise-is('error')
fs.from('OP')                                           .on('differentEvent').next-is('II')
fs.from('(.+)P')                                        .on('differentEvent2').next-is('-I')

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
