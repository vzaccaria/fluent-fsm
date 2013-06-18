#!/usr/bin/env livescript
_  = require 'underscore'
_s = require 'underscore.string'
require! 'express'
require! 'path'

debug = false 
log = if debug then console.log else ->
    
fsm-debug = {}
fsm-debug.print = if 1 then (m) -> log "Message: #m" else -> 
fsm-debug.debug = if 0 then (m) -> log "Debug:   #m" else ->  
fsm-debug.error = if 0 then (m) -> log "Error:   #m" else -> 

jp = (o) ->
    fsm-debug.debug JSON.stringify(o, null, 2)

print = (o) ->
    fsm-debug.print o

class fsm
    
    ~>  
        @rules           = []    
        @expanded_rules  = []
        @explicit-states = []
        @_reset_current_rule()
   
    _reset_current_rule: ~> 
        @fr              = null
        @to              = null
        @not-from        = null
        @otherwise-to    = null
        @transition      = null
        @before-code     = null
      # body...
    _finalize: ~>
       
        if @fr? and @to? and @transition?
            @rules.push( 
                from: @fr
                to: @to
                not-from: @not-from
                otherwise-to: @otherwise-to
                transition: @transition
                before-code: @before-code ) 
        @_reset_current_rule() 
    
    /* The following will be the new way of introducing states */    
    
    add_rule: ({from, jump-to, excluding, at, execute}) ~>
        
        if(excluding?)
            
            if not _.is-array(excluding) 
                excl = excluding.split(' ')
            else
                excl = excluding 
                     
            excl = _s.toSentence(excl, '|', '|') 
        
        @rules.push(
            from: from
            to: jump-to 
            not-from: excl 
            transition: at
            before-code: execute)        
    
    add-to-expanded-rules: (rule) ~>
        fsm-debug.debug "#{rule.from} -> #{rule.to}"
        @expanded_rules.push(rule)
        
        
    from_initial: (fr) ~> 
                            @_finalize()
                            @initial=fr
                            @fr = fr
                            this
        
    from: (fr) ~> 
        @_finalize()
        @fr = fr
        this
        
    but-not-from: (@not-from) ~>
        this
        
    excluding-any-of: (eao) ~>
        @not-from = any-of(eao)
        this

    otherwise-is: (@otherwise-to) ~>
        this
           
    on: (@transition) ~> 
        # fsm-debug.error this; 
        this
    
    next-is: (@to) ~> 
        # fsm-debug.error this; 
        this
    
    last-is: (@to) ~> 
        # fsm-debug.error this; 
        @final=@to
        this

    but-before-do: (@before-code) ~> 
        this        
     
    but-be-quiet: ~> 
        
    define-as-state: (s) ~>
        @explicit-states.push(s)
        
    define-as-initial: (s) ~>
        @initial = s
        this
                
    define-as-states: (s) ~>
        for st in s
            @explicit-states.push(st)
         
        
    wild: (s) ~>
        wildc = ['*' '-' '+' '|' '.']
        for x in wildc
            return true if _s.include(s,x)
        return false
        
    find: (s) ~>
        findc = ['*' '+' '|' '.']
        for x in findc
            return true if _s.include(s,x)
        return false
        
    replace: (s) ~>
        _s.include(s,"-") 
        
    matches: (state, rule) ~>
        patt = new RegExp(rule)
        mm   = state.match(patt)
        if mm?
            return { res: true, el: state, matching: mm[1] } 
        else
            return { res: false, el: state, matching: null }
            
    state-is: (rule) ~>
        {res} = @matches(@state, rule)
        return res;
            
# fsm-debug.error s.match(patt)
        
    _get-states: ~>
        s = []
        
        for rule in @rules
            
            if !@wild(rule.from) then 
                s.push(rule.from) if not (rule.from in s)
                
            if !@wild(rule.to) then 
                s.push(rule.to) if not (rule.to in s)
                
        return s.concat(@explicit-states)
    

    _expand_rules: (states, rules) ~>
        for rule in rules
            fsm-debug.debug "From: #{rule.from} , #{rule.to}, on #{rule.transition} - error-when: #{rule.not-from}"
            
            if @find(rule.from) 
                
                for s in states
                    from = {}
                    from.match = @matches(s, rule.from) 
                    
                    if rule.not-from?
                        from.not-match = @matches(s, rule.not-from) 
                        from.match.res = from.match.res and not from.not-match.res
                        
                        if from.not-match.res and rule.otherwise-to?
                            @add-to-expanded-rules(from: from.match.el, to: rule.otherwise-to, transition: rule.transition, before-code: rule.before-code )
                        
                    if from.match.res
                        if @replace(rule.to)                        
                            new-to = rule.to.replace('-', from.match.matching) 
                        else
                            new-to = rule.to
                            
                        @add-to-expanded-rules(from: from.match.el, to: new-to, transition: rule.transition, before-code: rule.before-code)
 
            else
                if @find(rule.to) 
                    for s in states
                        { res, el, matching } = @matches(s, rule.to) 
                        
                        if res
                            if @replace(rule.from)                        
                                new-from = rule.from.replace('-', matching) 
                            else
                                new-from = rule.from
                                
                            @add-to-expanded-rules(from: new-from, to: el, transition: rule.transition, before-code: rule.before-code)

                
                else @add-to-expanded-rules(rule)
    
    optimize: ~>
        fsm-debug.debug "Optimizing"
        fsm-debug.debug "Original: #{@expanded_rules.length}"
        finished = false 
        while not finished
            finished = true
            ins = []
            for s in @expanded_rules 
                if not (s.to in ins)
                    ins.push(s.to)
                    
            optimized = []    
            
            targets = {}
            for r in @expanded_rules
                if (r.from in ins) or (r.from is @initial)
                    fsm-debug.debug JSON.stringify(targets)
                    if not (targets[r.from]?) or not (targets[r.from][r.transition])?
                        targets[r.from] = { "#{r.transition}": true }
                        optimized.push(r)
                else
                    finished = false 
                                
            @expanded_rules = optimized        
            # jp optimized 
        finished = false
        while not finished
            finished = true
            
        fsm-debug.debug "Final:    #{@expanded_rules.length}"

 
    unfold: ~>
        @_finalize()
        @states = @_get-states()
        @_expand_rules(@states,@rules)
    
    get-data: (req, res) ~> 
        # jp @data
        res.send(@data)
   
    serve: (port, name) ~>
        fsm-debug.print "serving from #{__dirname}"
        sp = path.resolve(__dirname, '../static')
        fsm-debug.print "static path #{sp}"
        
        if name?
            @data.name = name
            
        app = express()
        app.get '/data/data.json'   @get-data
        app.use '/' express.static(sp)
        
        server = require('http').createServer(app)
        server.listen(port) 
        
        print "Listening on port: #{port}"
        print "Try with: "
        print "http://localhost:#{port}/index.html"
        
        @io = require('socket.io')
        @io = @io.listen(server)
        
        statechange = @io.of('/state').on('connection', (socket) ~> 
            socket.emit('message', { state: @state }))
        
    
    start: ~> @state = @initial
    
# Let is used to build closures. I.e., it closes over `rule`.   
    register-event-emitter: (@event-source) ~>
        for rule in @expanded_rules
            trw = let rule
                  (...others) ~> 
                                    if @state == rule.from 
                                      fsm-debug.print "Jump: #{rule.from} -> #{rule.to} on #{rule.transition}" 
                                      if @io?
                                        @io.sockets.emit('message', {state: @state })
                                      process.next-tick( ~> @state = rule.to )
                                      if rule.before-code?
                                        rule.before-code(others)
            @event-source.on rule.transition, trw
    
    prepare-emit: ~>
        for r in @expanded_rules
            r.source = r.from
            r.target = r.to
            r.type   = r.transition
            
        @data         = {}
        @data.links   = @expanded_rules
        @data.transitions = []
        for r in @rules
            if r.transition not in @data.transitions 
                @data.transitions.push(r.transition)
        @data.initial = @initial
        @data.final   = @final
    
    emit: ~>
        fsm-debug.print JSON.stringify(@data,null,2)    
    
    mark: ({transition, state, with-color, with-dashed-color}) ~>
        if not (@data.tcolor?)
            @data.tcolor = {}
        
        if not (@data.scolor?)
            @data.scolor = {}
            
        if transition?
            patt = new RegExp(transition)
            for t in @data.transitions
                mm   = t.match(patt)
                if mm?
                    if with-color?
                        @data.tcolor[t] = { col: with-color, dashed: false}
                    else
                        @data.tcolor[t] = { col: with-dashed-color, dashed: true }
        if state?
            patt = new RegExp(state)
            for t in @explicit-states
                mm   = t.match(patt)
                if mm?
                    @data.scolor[t] = with-color
                        

   
any-of = (v) ->
    _s.toSentence(v, '|', '|') 

exports.fsm    = fsm
exports.any-of = any-of

{ EventEmitter } = require 'events'

class fsm-tester extends EventEmitter 
    
    create-fsm: (s) ~>
        s ?= []
        @fsm = new fsm
        @fsm.define-as-states(s)
        
    add-rules: (rules) ~>
        for r in rules 
            @fsm.add_rule r
        
    unfold: ~>
        @fsm.unfold()
        @fsm.optimize()
    
    get-states: ~>
        @fsm.states 
        
    get-current-state: ~>
        @fsm.state

    get-rules: ~>
        @fsm.rules
    
    get-exp-rules: ~>
        for e in @fsm.expanded_rules
            for k,v of e
                if not v? 
                    delete e[k] 
        return @fsm.expanded_rules
    
    run-events: (initial, @events,cb) ~>
        @fsm.register-event-emitter(@)
        @setMaxListeners(0)
        @fsm.define-as-initial(initial)
        @fsm.start()

        event-emit = ~>
            e      = _.head(@events)
            @events = _.tail(@events)
            @emit e
            if @events.length > 0
                process.next-tick event-emit
            else
                process.next-tick cb
        
        process.next-tick event-emit
    
exports.fsm-tester = fsm-tester
