


text = '''

This awesome library provides an expressive way to specify, run and debug finite state machines in Javascript.

Here are the main features:

* Express compact state transitions with regular expressions!
* Debug your FSM on line with a mini-server (powered by `socketio`)!

Note: The fsm runs server-side! This is not compatible with browsers at the moment.

## Installation

To install, use `npm`:

    npm install fluent-fsm


## Usage

Import the prototype in your program:

    fsm = require('fsmexpress').fsm;

### Create fsm and instantiate states

Create a finite state machine:

    fs = new fsm()

Define states (`livescript/coffeescript` code):

    fs.define-as-states([   'II' 'SI' 'PI' 'OI' 
                            'IS' 'SS' 'PS' 'OS' 
                            'IP' 'SP' 'PP' 'OP' 
                            'IC' 'SC' 'PC' 'OC' 'error' ])
                            
    fs.define-as-initial('II')

### Define transitions
Define a transition (optionally using a regular expression) from all states beginning with `I` excluding some states (`IP`, `IC`) on a specific event (`an_event`) and register function `action_to_trigger`  to be triggered contextually:

    fs.add_rule 
        from: 'I(.+)'
        excluding: 'IP IC' 
        at: 'an_event' 
        jumpTo: 'S-' 
        execute: action_to_trigger  
    

**Note**: the target state `S-` is a state beginning with `S` and ending with the matched text in `(.+)` in the `from` expression. So the above statement will generate only two different state transitions (because `'IP' 'IC'` are not allowed `from` states):

    II -> SI
    IS -> SS
    

### Unfold and optimize 

After the state transitions have been setup, invoke `unfold` to generate actual state transition rules:

    fs.unfold()

Prune states that are not reachable:
    
    fs.optimize()
    
    
### Linking to an event emitter

To register an event emitter:

    fs.registerEventEmitter(the_event_emitter)

`the_event_emitter` should be a Node `Emitter` object. The FSM registers its own listeners to enable state transition internal methods. Practically, let's assume that we have the following event emitter:

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

Let's register it and start the finite state machine:

    tst = new tester()
    
    # Register event emitter and start the fsm
    fs.registerEventEmitter(tst)  
    fs.start()   
    

## GUI debug

You can have a visual representation of the FSM that is served through a small web service (screenshot above):

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

You can see live state transitions (wherever the fsm is, even remotely, provided that the port can be accessed).



 [^1]: In livescript, dashes "-" are used to create camelized Javascript identifiers. So, `any-of` is translated to `anyOf` by the livescript compiler.

## To do

The following is a tentative list of actions around this project.

| date          | action                            | category  |
| ------------- | -------------                     | :-------: |
| June 24, 2013 | link to a live example            | BLD       |
| June 30, 2013 | release version 0.0.1             | REL       |



    

 

'''


converter = new Showdown.converter()
ht = converter.makeHtml(text)
$(ht).appendTo("\#text")
