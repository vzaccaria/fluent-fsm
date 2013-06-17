require! 'should'
require! 'async'
{fsm-tester} = require './fsmexpress.js'

dbg = true 

mdhead  = ->
    if dbg
        console.log ""
    

mdp = (e) ->
    if dbg
        console.log "        ◦ #e"


moment          = require 'moment'

ft = new fsm-tester

describe 'FSM definition', ->
  describe 'State identification', (empty) ->
    mdhead
    it 'derive implicit states',  (done) ->
        ft.create-fsm()
        rules = [
            { from: 'I', jump-to: 'S', at: 'eventx' }
            { from: 'S', jump-to: 'I', at: 'eventy' }
            ] 
        ft.add-rules(rules)
        ft.unfold()
        ft.get-states().should.eql([ \I \S ])
        done()
        
  describe 'Rule identification', (empty) ->
    it 'derive simple rules',  (done) ->
        ft.create-fsm()
        rules = [
            { from: 'I', jump-to: 'S', at: 'eventx' }
            { from: 'S', jump-to: 'I', at: 'eventy' }
            ] 
        ft.add-rules(rules)
        ft.unfold()
        ft.get-exp-rules().should.includeEql(from: \I, to: \S, transition: \eventx)
        done()
    
    it 'derive complex rules (no loop)',  (done) ->
        ft.create-fsm()
        rules = [
            { from: 'I', jump-to: 'S', at: 'eventx' }
            { from: 'S', jump-to: 'I', at: 'eventy' }
            { from: '(.)', jump-to: 'S', at: 'eventy' }
            ] 
        ft.add-rules(rules)
        ft.unfold()
        ft.get-exp-rules().should.includeEql(from: \I, to: \S, transition: \eventy)
        ft.get-exp-rules().should.not.includeEql(from: \S, to: \S, transition: \eventy)
        done()
    
    it 'derive complex rules (loop)',  (done) ->
        ft.create-fsm()
        rules = [
            { from: 'I', jump-to: 'S', at: 'x' }
            { from: 'S', jump-to: 'I', at: 'x' }
            { from: '(.)', jump-to: '-', at: 'y' }
            ] 
        ft.add-rules(rules)
        ft.unfold()
        ft.get-exp-rules().should.includeEql(from: \I, to: \I, transition: \y)
        ft.get-exp-rules().should.includeEql(from: \S, to: \S, transition: \y)
        ft.get-exp-rules().should.not.includeEql(from: \I, to: \S, transition: \y)
        done()

    it 'derive complex rules (with excluding)',  (done) ->
        ft.create-fsm()
        rules = [
            { from: 'I', jump-to: 'S', at: 'x' }
            { from: 'S', jump-to: 'I', at: 'x' }
            { from: '(.)', jump-to: '-', excluding: [ \S ] at: 'y' }
            ] 
        ft.add-rules(rules)
        ft.unfold()
        ft.get-exp-rules().should.includeEql(from: \I, to: \I, transition: \y)
        ft.get-exp-rules().should.not.includeEql(from: \S, to: \S, transition: \y)
        ft.get-exp-rules().should.not.includeEql(from: \I, to: \S, transition: \y)
        done()
        
    it 'derive complex rules (with excluding - alt)',  (done) ->
        ft.create-fsm()
        rules = [
            { from: 'I', jump-to: 'S', at: 'x' }
            { from: 'S', jump-to: 'I', at: 'x' }
            { from: '(.)', jump-to: '-', excluding: \S , at: 'y' }
            ] 
        ft.add-rules(rules)
        ft.unfold()
        ft.get-exp-rules().should.includeEql(from: \I, to: \I, transition: \y)
        ft.get-exp-rules().should.not.includeEql(from: \S, to: \S, transition: \y)
        ft.get-exp-rules().should.not.includeEql(from: \I, to: \S, transition: \y)
        done()
        
              
describe 'FSM operation', ->
  describe 'Simple sequence', (empty) ->
    it 'should run a simple transition',  (done) ->      
        ft.create-fsm()
        rules = [
            { from: 'I', jump-to: 'S', at: 'x' }
            { from: 'S', jump-to: 'I', at: 'x' }
            { from: '(.)', jump-to: '-', at: 'y' }
            ] 
        ft.add-rules(rules)
        ft.unfold()
        ft.run-events \I, [ \x ], ~>
            ft.get-current-state().should.equal(\S)    
            done()

    it 'should run a simple sequence, return to start',  (done) ->      
        ft.create-fsm()
        rules = [
            { from: 'I', jump-to: 'S', at: 'x' }
            { from: 'S', jump-to: 'I', at: 'x' }
            { from: '(.)', jump-to: '-', at: 'y' }
            ] 
        ft.add-rules(rules)
        ft.unfold()
        ft.run-events \I, [ \x \x \y \y ], ~>
            ft.get-current-state().should.equal(\I)    
            done()
        
    it 'should run a simple sequence, no return to start ',  (done) ->      
        ft.create-fsm()
        rules = [
            { from: 'I', jump-to: 'S', at: 'x' }
            { from: 'S', jump-to: 'I', at: 'x' }
            { from: '(.)', jump-to: '-', at: 'y' }
            ] 
        ft.add-rules(rules)
        ft.unfold()
        ft.run-events \I, [ \x \y \y ], ~>
            ft.get-current-state().should.equal(\S)    
            done() 
            
    it 'should not react to events that are not specified ',  (done) ->      
        ft.create-fsm()
        rules = [
            { from: 'I', jump-to: 'S', at: 'x' }
            { from: 'S', jump-to: 'I', at: 'x' }
            { from: '(.)', jump-to: '-', at: 'y' }
            ] 
        ft.add-rules(rules)
        ft.unfold()
        ft.run-events \I, [ \x \y \e \x \y ], ~>
            ft.get-current-state().should.equal(\I)    
            done() 
    
    
    it 'should run a simple sequence, return to start',  (done) ->      
        ft.create-fsm()
        rules = [
            { from: 'I', jump-to: 'S', at: 'x' }
            { from: 'S', jump-to: 'I', at: 'x' }
            { from: '(.)', jump-to: '-', at: 'y' }
            ] 
        ft.add-rules(rules)
        ft.unfold()
        ft.run-events \I, [ \x \x \y \y ], ~>
            ft.get-current-state().should.equal(\I)    
            done()
        
    it 'should run a simple sequence, no return to start ',  (done) ->      
        ft.create-fsm()
        rules = [
            { from: 'I', jump-to: 'S', at: 'x' }
            { from: 'S', jump-to: 'I', at: 'x' }
            { from: '(.)', jump-to: '-', at: 'y' }
            ] 
        ft.add-rules(rules)
        ft.unfold()
        ft.run-events \I, [ \x \y \y ], ~>
            ft.get-current-state().should.equal(\S)    
            done() 
            
    it 'trigger event functions',  (done) ->      
        ft = null
        ft = new fsm-tester()
        ft.create-fsm()
        count = x: 0, y: 0
        rules = [
            { from: 'I', jump-to: 'S', at: 'x' ,  execute: (-> @x = @x + 1).bind(count)}
            { from: 'S', jump-to: 'I', at: 'x' ,  execute: (-> @x = @x + 1).bind(count)}
            { from: '(.)', jump-to: '-', at: 'y', execute: (-> @y = @y + 1).bind(count)}
            ] 
        ft.add-rules(rules)
        ft.unfold()
        ft.run-events \I, [ \x \y \e \x ], ~>
            count.x.should.be.equal(2)
            count.y.should.be.equal(1)
            ft.get-current-state().should.equal(\I)    
            done() 

