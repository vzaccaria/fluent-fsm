(function(){
  var should, async, fsmTester, dbg, mdhead, mdp, moment, ft;
  should = require('should');
  async = require('async');
  fsmTester = require('./fsmexpress.js').fsmTester;
  dbg = true;
  mdhead = function(){
    if (dbg) {
      return console.log("");
    }
  };
  mdp = function(e){
    if (dbg) {
      return console.log("        ◦ " + e);
    }
  };
  moment = require('moment');
  ft = new fsmTester;
  describe('FSM definition', function(){
    describe('State identification', function(empty){
      mdhead;
      return it('derive implicit states', function(done){
        var rules;
        ft.createFsm();
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'eventx'
          }, {
            from: 'S',
            jumpTo: 'I',
            at: 'eventy'
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        ft.getStates().should.eql(['I', 'S']);
        return done();
      });
    });
    return describe('Rule identification', function(empty){
      it('derive simple rules', function(done){
        var rules;
        ft.createFsm();
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'eventx'
          }, {
            from: 'S',
            jumpTo: 'I',
            at: 'eventy'
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        ft.getExpRules().should.includeEql({
          from: 'I',
          to: 'S',
          transition: 'eventx'
        });
        return done();
      });
      it('derive complex rules (no loop)', function(done){
        var rules;
        ft.createFsm();
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'eventx'
          }, {
            from: 'S',
            jumpTo: 'I',
            at: 'eventy'
          }, {
            from: '(.)',
            jumpTo: 'S',
            at: 'eventy'
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        ft.getExpRules().should.includeEql({
          from: 'I',
          to: 'S',
          transition: 'eventy'
        });
        ft.getExpRules().should.not.includeEql({
          from: 'S',
          to: 'S',
          transition: 'eventy'
        });
        return done();
      });
      it('derive complex rules (loop)', function(done){
        var rules;
        ft.createFsm();
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'x'
          }, {
            from: 'S',
            jumpTo: 'I',
            at: 'x'
          }, {
            from: '(.)',
            jumpTo: '-',
            at: 'y'
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        ft.getExpRules().should.includeEql({
          from: 'I',
          to: 'I',
          transition: 'y'
        });
        ft.getExpRules().should.includeEql({
          from: 'S',
          to: 'S',
          transition: 'y'
        });
        ft.getExpRules().should.not.includeEql({
          from: 'I',
          to: 'S',
          transition: 'y'
        });
        return done();
      });
      it('derive complex rules (with excluding)', function(done){
        var rules;
        ft.createFsm();
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'x'
          }, {
            from: 'S',
            jumpTo: 'I',
            at: 'x'
          }, {
            from: '(.)',
            jumpTo: '-',
            excluding: ['S'],
            at: 'y'
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        ft.getExpRules().should.includeEql({
          from: 'I',
          to: 'I',
          transition: 'y'
        });
        ft.getExpRules().should.not.includeEql({
          from: 'S',
          to: 'S',
          transition: 'y'
        });
        ft.getExpRules().should.not.includeEql({
          from: 'I',
          to: 'S',
          transition: 'y'
        });
        return done();
      });
      return it('derive complex rules (with excluding - alt)', function(done){
        var rules;
        ft.createFsm();
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'x'
          }, {
            from: 'S',
            jumpTo: 'I',
            at: 'x'
          }, {
            from: '(.)',
            jumpTo: '-',
            excluding: 'S',
            at: 'y'
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        ft.getExpRules().should.includeEql({
          from: 'I',
          to: 'I',
          transition: 'y'
        });
        ft.getExpRules().should.not.includeEql({
          from: 'S',
          to: 'S',
          transition: 'y'
        });
        ft.getExpRules().should.not.includeEql({
          from: 'I',
          to: 'S',
          transition: 'y'
        });
        return done();
      });
    });
  });
  describe('FSM operation', function(){
    describe('Simple sequence', function(empty){
      it('should run a simple transition', function(done){
        var rules, this$ = this;
        ft.createFsm();
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'x'
          }, {
            from: 'S',
            jumpTo: 'I',
            at: 'x'
          }, {
            from: '(.)',
            jumpTo: '-',
            at: 'y'
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        return ft.runEvents(['x'], function(){
          ft.getCurrentState().should.equal('S');
          return done();
        });
      });
      it('should run a simple sequence, return to start', function(done){
        var rules, this$ = this;
        ft.createFsm();
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'x'
          }, {
            from: 'S',
            jumpTo: 'I',
            at: 'x'
          }, {
            from: '(.)',
            jumpTo: '-',
            at: 'y'
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        return ft.runEvents(['x', 'x', 'y', 'y'], function(){
          ft.getCurrentState().should.equal('I');
          return done();
        });
      });
      it('should run a simple sequence, no return to start ', function(done){
        var rules, this$ = this;
        ft.createFsm();
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'x'
          }, {
            from: 'S',
            jumpTo: 'I',
            at: 'x'
          }, {
            from: '(.)',
            jumpTo: '-',
            at: 'y'
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        return ft.runEvents(['x', 'y', 'y'], function(){
          ft.getCurrentState().should.equal('S');
          return done();
        });
      });
      it('should not react to events that are not specified ', function(done){
        var rules, this$ = this;
        ft.createFsm();
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'x'
          }, {
            from: 'S',
            jumpTo: 'I',
            at: 'x'
          }, {
            from: '(.)',
            jumpTo: '-',
            at: 'y'
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        return ft.runEvents(['x', 'y', 'e', 'x', 'y'], function(){
          ft.getCurrentState().should.equal('I');
          return done();
        });
      });
      it('should run a simple sequence, return to start', function(done){
        var rules, this$ = this;
        ft.createFsm();
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'x'
          }, {
            from: 'S',
            jumpTo: 'I',
            at: 'x'
          }, {
            from: '(.)',
            jumpTo: '-',
            at: 'y'
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        return ft.runEvents(['x', 'x', 'y', 'y'], function(){
          ft.getCurrentState().should.equal('I');
          return done();
        });
      });
      return it('should run a simple sequence, no return to start ', function(done){
        var rules, this$ = this;
        ft.createFsm();
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'x'
          }, {
            from: 'S',
            jumpTo: 'I',
            at: 'x'
          }, {
            from: '(.)',
            jumpTo: '-',
            at: 'y'
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        return ft.runEvents(['x', 'y', 'y'], function(){
          ft.getCurrentState().should.equal('S');
          return done();
        });
      });
    });
    return describe('Event management', function(empty){
      it('should trigger the correct amount of event functions', function(done){
        var ft, count, rules, this$ = this;
        ft = null;
        ft = new fsmTester();
        ft.createFsm();
        count = {
          x: 0,
          y: 0
        };
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'x',
            execute: function(){
              return this.x = this.x + 1;
            }.bind(count)
          }, {
            from: 'S',
            jumpTo: 'I',
            at: 'x',
            execute: function(){
              return this.x = this.x + 1;
            }.bind(count)
          }, {
            from: '(.)',
            jumpTo: '-',
            at: 'y',
            execute: function(){
              return this.y = this.y + 1;
            }.bind(count)
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        return ft.runEvents(['x', 'y', 'e', 'x'], function(){
          count.x.should.be.equal(2);
          count.y.should.be.equal(1);
          ft.getCurrentState().should.equal('I');
          return done();
        });
      });
      return it('should trigger the correct amount of event functions in the correct order', function(){
        var ft, count, rules;
        ft = null;
        ft = new fsmTester();
        ft.createFsm();
        count = {
          x: 0,
          y: 0
        };
        rules = [
          {
            from: 'I',
            jumpTo: 'S',
            at: 'x',
            execute: function(){
              return this.x = this.x + 1;
            }.bind(count)
          }, {
            from: 'I',
            jumpTo: 'T',
            at: 'y',
            execute: function(){
              return this.x = this.x + 1;
            }.bind(count)
          }
        ];
        ft.addRules(rules);
        ft.unfold('I');
        ft.fsm.registerEventEmitter(ft);
        ft.setMaxListeners(0);
        ft.fsm.start();
        ft.emit('x');
        ft.emit('y');
        return ft.getCurrentState().should.equal('S');
      });
    });
  });
}).call(this);
