(function(){
  var _, _s, express, path, debug, log, fsmDebug, jp, print, fsm, anyOf, EventEmitter, fsmTester, slice$ = [].slice;
  _ = require('underscore');
  _s = require('underscore.string');
  express = require('express');
  path = require('path');
  debug = false;
  log = debug
    ? console.log
    : function(){};
  fsmDebug = {};
  fsmDebug.print = 1
    ? function(m){
      return log("Message: " + m);
    }
    : function(){};
  fsmDebug.debug = 0
    ? function(m){
      return log("Debug:   " + m);
    }
    : function(){};
  fsmDebug.error = 0
    ? function(m){
      return log("Error:   " + m);
    }
    : function(){};
  jp = function(o){
    return fsmDebug.debug(JSON.stringify(o, null, 2));
  };
  print = function(o){
    return fsmDebug.print(o);
  };
  fsm = (function(){
    fsm.displayName = 'fsm';
    var prototype = fsm.prototype, constructor = fsm;
    function fsm(){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.mark = bind$(this$, 'mark', prototype);
      this$.emit = bind$(this$, 'emit', prototype);
      this$.prepareEmit = bind$(this$, 'prepareEmit', prototype);
      this$.registerEventEmitter = bind$(this$, 'registerEventEmitter', prototype);
      this$.start = bind$(this$, 'start', prototype);
      this$.serve = bind$(this$, 'serve', prototype);
      this$.getData = bind$(this$, 'getData', prototype);
      this$.unfold = bind$(this$, 'unfold', prototype);
      this$.optimize = bind$(this$, 'optimize', prototype);
      this$._expand_rules = bind$(this$, '_expand_rules', prototype);
      this$._getStates = bind$(this$, '_getStates', prototype);
      this$.stateIs = bind$(this$, 'stateIs', prototype);
      this$.matches = bind$(this$, 'matches', prototype);
      this$.replace = bind$(this$, 'replace', prototype);
      this$.find = bind$(this$, 'find', prototype);
      this$.wild = bind$(this$, 'wild', prototype);
      this$.defineAsStates = bind$(this$, 'defineAsStates', prototype);
      this$.defineAsInitial = bind$(this$, 'defineAsInitial', prototype);
      this$.defineAsState = bind$(this$, 'defineAsState', prototype);
      this$.butBeQuiet = bind$(this$, 'butBeQuiet', prototype);
      this$.butBeforeDo = bind$(this$, 'butBeforeDo', prototype);
      this$.lastIs = bind$(this$, 'lastIs', prototype);
      this$.nextIs = bind$(this$, 'nextIs', prototype);
      this$.on = bind$(this$, 'on', prototype);
      this$.otherwiseIs = bind$(this$, 'otherwiseIs', prototype);
      this$.excludingAnyOf = bind$(this$, 'excludingAnyOf', prototype);
      this$.butNotFrom = bind$(this$, 'butNotFrom', prototype);
      this$.from = bind$(this$, 'from', prototype);
      this$.from_initial = bind$(this$, 'from_initial', prototype);
      this$.addToExpandedRules = bind$(this$, 'addToExpandedRules', prototype);
      this$.add_rule = bind$(this$, 'add_rule', prototype);
      this$._finalize = bind$(this$, '_finalize', prototype);
      this$._reset_current_rule = bind$(this$, '_reset_current_rule', prototype);
      this$.rules = [];
      this$.expanded_rules = [];
      this$.explicitStates = [];
      this$._reset_current_rule();
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype._reset_current_rule = function(){
      this.fr = null;
      this.to = null;
      this.notFrom = null;
      this.otherwiseTo = null;
      this.transition = null;
      return this.beforeCode = null;
    };
    prototype._finalize = function(){
      if (this.fr != null && this.to != null && this.transition != null) {
        this.rules.push({
          from: this.fr,
          to: this.to,
          notFrom: this.notFrom,
          otherwiseTo: this.otherwiseTo,
          transition: this.transition,
          beforeCode: this.beforeCode
        });
      }
      return this._reset_current_rule();
    };
    /* The following will be the new way of introducing states */
    prototype.add_rule = function(arg$){
      var from, jumpTo, excluding, at, execute, excl;
      from = arg$.from, jumpTo = arg$.jumpTo, excluding = arg$.excluding, at = arg$.at, execute = arg$.execute;
      if (excluding != null) {
        if (!_.isArray(excluding)) {
          excl = excluding.split(' ');
        } else {
          excl = excluding;
        }
        excl = _s.toSentence(excl, '|', '|');
      }
      return this.rules.push({
        from: from,
        to: jumpTo,
        notFrom: excl,
        transition: at,
        beforeCode: execute
      });
    };
    prototype.addToExpandedRules = function(rule){
      fsmDebug.debug(rule.from + " -> " + rule.to);
      return this.expanded_rules.push(rule);
    };
    prototype.from_initial = function(fr){
      this._finalize();
      this.initial = fr;
      this.fr = fr;
      return this;
    };
    prototype.from = function(fr){
      this._finalize();
      this.fr = fr;
      return this;
    };
    prototype.butNotFrom = function(notFrom){
      this.notFrom = notFrom;
      return this;
    };
    prototype.excludingAnyOf = function(eao){
      this.notFrom = anyOf(eao);
      return this;
    };
    prototype.otherwiseIs = function(otherwiseTo){
      this.otherwiseTo = otherwiseTo;
      return this;
    };
    prototype.on = function(transition){
      this.transition = transition;
      return this;
    };
    prototype.nextIs = function(to){
      this.to = to;
      return this;
    };
    prototype.lastIs = function(to){
      this.to = to;
      this.final = this.to;
      return this;
    };
    prototype.butBeforeDo = function(beforeCode){
      this.beforeCode = beforeCode;
      return this;
    };
    prototype.butBeQuiet = function(){};
    prototype.defineAsState = function(s){
      return this.explicitStates.push(s);
    };
    prototype.defineAsInitial = function(s){
      this.initial = s;
      return this;
    };
    prototype.defineAsStates = function(s){
      var i$, len$, st, results$ = [];
      for (i$ = 0, len$ = s.length; i$ < len$; ++i$) {
        st = s[i$];
        results$.push(this.explicitStates.push(st));
      }
      return results$;
    };
    prototype.wild = function(s){
      var wildc, i$, len$, x;
      wildc = ['*', '-', '+', '|', '.'];
      for (i$ = 0, len$ = wildc.length; i$ < len$; ++i$) {
        x = wildc[i$];
        if (_s.include(s, x)) {
          return true;
        }
      }
      return false;
    };
    prototype.find = function(s){
      var findc, i$, len$, x;
      findc = ['*', '+', '|', '.'];
      for (i$ = 0, len$ = findc.length; i$ < len$; ++i$) {
        x = findc[i$];
        if (_s.include(s, x)) {
          return true;
        }
      }
      return false;
    };
    prototype.replace = function(s){
      return _s.include(s, "-");
    };
    prototype.matches = function(state, rule){
      var patt, mm;
      patt = new RegExp(rule);
      mm = state.match(patt);
      if (mm != null) {
        return {
          res: true,
          el: state,
          matching: mm[1]
        };
      } else {
        return {
          res: false,
          el: state,
          matching: null
        };
      }
    };
    prototype.stateIs = function(rule){
      var res;
      res = this.matches(this.state, rule).res;
      return res;
    };
    prototype._getStates = function(){
      var s, i$, ref$, len$, rule;
      s = [];
      for (i$ = 0, len$ = (ref$ = this.rules).length; i$ < len$; ++i$) {
        rule = ref$[i$];
        if (!this.wild(rule.from)) {
          if (!in$(rule.from, s)) {
            s.push(rule.from);
          }
        }
        if (!this.wild(rule.to)) {
          if (!in$(rule.to, s)) {
            s.push(rule.to);
          }
        }
      }
      return s.concat(this.explicitStates);
    };
    prototype._expand_rules = function(states, rules){
      var i$, len$, rule, lresult$, j$, len1$, s, from, newTo, ref$, res, el, matching, newFrom, results$ = [];
      for (i$ = 0, len$ = rules.length; i$ < len$; ++i$) {
        rule = rules[i$];
        lresult$ = [];
        fsmDebug.debug("From: " + rule.from + " , " + rule.to + ", on " + rule.transition + " - error-when: " + rule.notFrom);
        if (this.find(rule.from)) {
          for (j$ = 0, len1$ = states.length; j$ < len1$; ++j$) {
            s = states[j$];
            from = {};
            from.match = this.matches(s, rule.from);
            if (rule.notFrom != null) {
              from.notMatch = this.matches(s, rule.notFrom);
              from.match.res = from.match.res && !from.notMatch.res;
              if (from.notMatch.res && rule.otherwiseTo != null) {
                this.addToExpandedRules({
                  from: from.match.el,
                  to: rule.otherwiseTo,
                  transition: rule.transition,
                  beforeCode: rule.beforeCode
                });
              }
            }
            if (from.match.res) {
              if (this.replace(rule.to)) {
                newTo = rule.to.replace('-', from.match.matching);
              } else {
                newTo = rule.to;
              }
              lresult$.push(this.addToExpandedRules({
                from: from.match.el,
                to: newTo,
                transition: rule.transition,
                beforeCode: rule.beforeCode
              }));
            }
          }
        } else {
          if (this.find(rule.to)) {
            for (j$ = 0, len1$ = states.length; j$ < len1$; ++j$) {
              s = states[j$];
              ref$ = this.matches(s, rule.to), res = ref$.res, el = ref$.el, matching = ref$.matching;
              if (res) {
                if (this.replace(rule.from)) {
                  newFrom = rule.from.replace('-', matching);
                } else {
                  newFrom = rule.from;
                }
                lresult$.push(this.addToExpandedRules({
                  from: newFrom,
                  to: el,
                  transition: rule.transition,
                  beforeCode: rule.beforeCode
                }));
              }
            }
          } else {
            lresult$.push(this.addToExpandedRules(rule));
          }
        }
        results$.push(lresult$);
      }
      return results$;
    };
    prototype.optimize = function(){
      var finished, ins, i$, ref$, len$, s, optimized, targets, r, ref1$;
      fsmDebug.debug("Optimizing");
      fsmDebug.debug("Original: " + this.expanded_rules.length);
      finished = false;
      while (!finished) {
        finished = true;
        ins = [];
        for (i$ = 0, len$ = (ref$ = this.expanded_rules).length; i$ < len$; ++i$) {
          s = ref$[i$];
          if (!in$(s.to, ins)) {
            ins.push(s.to);
          }
        }
        optimized = [];
        targets = {};
        for (i$ = 0, len$ = (ref$ = this.expanded_rules).length; i$ < len$; ++i$) {
          r = ref$[i$];
          if (in$(r.from, ins) || r.from === this.initial) {
            fsmDebug.debug(JSON.stringify(targets));
            if (!(targets[r.from] != null) || targets[r.from][r.transition] == null) {
              targets[r.from] = (ref1$ = {}, ref1$[r.transition + ""] = true, ref1$);
              optimized.push(r);
            }
          } else {
            finished = false;
          }
        }
        this.expanded_rules = optimized;
      }
      finished = false;
      while (!finished) {
        finished = true;
      }
      return fsmDebug.debug("Final:    " + this.expanded_rules.length);
    };
    prototype.unfold = function(){
      this._finalize();
      this.states = this._getStates();
      return this._expand_rules(this.states, this.rules);
    };
    prototype.getData = function(req, res){
      return res.send(this.data);
    };
    prototype.serve = function(port, name){
      var sp, app, server, statechange, this$ = this;
      fsmDebug.print("serving from " + __dirname);
      sp = path.resolve(__dirname, '../static');
      fsmDebug.print("static path " + sp);
      if (name != null) {
        this.data.name = name;
      }
      app = express();
      app.get('/data/data.json', this.getData);
      app.use('/', express['static'](sp));
      server = require('http').createServer(app);
      server.listen(port);
      print("Listening on port: " + port);
      print("Try with: ");
      print("http://localhost:" + port + "/index.html");
      this.io = require('socket.io');
      this.io = this.io.listen(server);
      return statechange = this.io.of('/state').on('connection', function(socket){
        return socket.emit('message', {
          state: this$.state
        });
      });
    };
    prototype.start = function(){
      return this.state = this.initial;
    };
    prototype.registerEventEmitter = function(eventSource){
      var i$, ref$, len$, rule, trw, results$ = [];
      this.eventSource = eventSource;
      for (i$ = 0, len$ = (ref$ = this.expanded_rules).length; i$ < len$; ++i$) {
        rule = ref$[i$];
        trw = (fn$.call(this, rule));
        results$.push(this.eventSource.on(rule.transition, trw));
      }
      return results$;
      function fn$(rule){
        var this$ = this;
        return function(){
          var others;
          others = slice$.call(arguments);
          if (this$.state === rule.from) {
            fsmDebug.print("Jump: " + rule.from + " -> " + rule.to + " on " + rule.transition);
            if (this$.io != null) {
              this$.io.sockets.emit('message', {
                state: this$.state
              });
            }
            process.nextTick(function(){
              return this$.state = rule.to;
            });
            if (rule.beforeCode != null) {
              return rule.beforeCode(others);
            }
          }
        };
      }
    };
    prototype.prepareEmit = function(){
      var i$, ref$, len$, r;
      for (i$ = 0, len$ = (ref$ = this.expanded_rules).length; i$ < len$; ++i$) {
        r = ref$[i$];
        r.source = r.from;
        r.target = r.to;
        r.type = r.transition;
      }
      this.data = {};
      this.data.links = this.expanded_rules;
      this.data.transitions = [];
      for (i$ = 0, len$ = (ref$ = this.rules).length; i$ < len$; ++i$) {
        r = ref$[i$];
        if (!in$(r.transition, this.data.transitions)) {
          this.data.transitions.push(r.transition);
        }
      }
      this.data.initial = this.initial;
      return this.data.final = this.final;
    };
    prototype.emit = function(){
      return fsmDebug.print(JSON.stringify(this.data, null, 2));
    };
    prototype.mark = function(arg$){
      var transition, state, withColor, withDashedColor, patt, i$, ref$, len$, t, mm, results$ = [];
      transition = arg$.transition, state = arg$.state, withColor = arg$.withColor, withDashedColor = arg$.withDashedColor;
      if (!(this.data.tcolor != null)) {
        this.data.tcolor = {};
      }
      if (!(this.data.scolor != null)) {
        this.data.scolor = {};
      }
      if (transition != null) {
        patt = new RegExp(transition);
        for (i$ = 0, len$ = (ref$ = this.data.transitions).length; i$ < len$; ++i$) {
          t = ref$[i$];
          mm = t.match(patt);
          if (mm != null) {
            if (withColor != null) {
              this.data.tcolor[t] = {
                col: withColor,
                dashed: false
              };
            } else {
              this.data.tcolor[t] = {
                col: withDashedColor,
                dashed: true
              };
            }
          }
        }
      }
      if (state != null) {
        patt = new RegExp(state);
        for (i$ = 0, len$ = (ref$ = this.explicitStates).length; i$ < len$; ++i$) {
          t = ref$[i$];
          mm = t.match(patt);
          if (mm != null) {
            results$.push(this.data.scolor[t] = withColor);
          }
        }
        return results$;
      }
    };
    return fsm;
  }());
  anyOf = function(v){
    return _s.toSentence(v, '|', '|');
  };
  exports.fsm = fsm;
  exports.anyOf = anyOf;
  EventEmitter = require('events').EventEmitter;
  fsmTester = (function(superclass){
    var prototype = extend$((import$(fsmTester, superclass).displayName = 'fsmTester', fsmTester), superclass).prototype, constructor = fsmTester;
    prototype.createFsm = function(s){
      s == null && (s = []);
      this.fsm = new fsm;
      return this.fsm.defineAsStates(s);
    };
    prototype.addRules = function(rules){
      var i$, len$, r, results$ = [];
      for (i$ = 0, len$ = rules.length; i$ < len$; ++i$) {
        r = rules[i$];
        results$.push(this.fsm.add_rule(r));
      }
      return results$;
    };
    prototype.unfold = function(){
      this.fsm.unfold();
      return this.fsm.optimize();
    };
    prototype.getStates = function(){
      return this.fsm.states;
    };
    prototype.getCurrentState = function(){
      return this.fsm.state;
    };
    prototype.getRules = function(){
      return this.fsm.rules;
    };
    prototype.getExpRules = function(){
      var i$, ref$, len$, e, k, v;
      for (i$ = 0, len$ = (ref$ = this.fsm.expanded_rules).length; i$ < len$; ++i$) {
        e = ref$[i$];
        for (k in e) {
          v = e[k];
          if (v == null) {
            delete e[k];
          }
        }
      }
      return this.fsm.expanded_rules;
    };
    prototype.runEvents = function(initial, events, cb){
      var eventEmit, this$ = this;
      this.events = events;
      this.fsm.registerEventEmitter(this);
      this.setMaxListeners(0);
      this.fsm.defineAsInitial(initial);
      this.fsm.start();
      eventEmit = function(){
        var e;
        e = _.head(this$.events);
        this$.events = _.tail(this$.events);
        this$.emit(e);
        if (this$.events.length > 0) {
          return process.nextTick(eventEmit);
        } else {
          return process.nextTick(cb);
        }
      };
      return process.nextTick(eventEmit);
    };
    function fsmTester(){
      this.runEvents = bind$(this, 'runEvents', prototype);
      this.getExpRules = bind$(this, 'getExpRules', prototype);
      this.getRules = bind$(this, 'getRules', prototype);
      this.getCurrentState = bind$(this, 'getCurrentState', prototype);
      this.getStates = bind$(this, 'getStates', prototype);
      this.unfold = bind$(this, 'unfold', prototype);
      this.addRules = bind$(this, 'addRules', prototype);
      this.createFsm = bind$(this, 'createFsm', prototype);
      fsmTester.superclass.apply(this, arguments);
    }
    return fsmTester;
  }(EventEmitter));
  exports.fsmTester = fsmTester;
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
  function in$(x, arr){
    var i = -1, l = arr.length >>> 0;
    while (++i < l) if (x === arr[i] && i in arr) return true;
    return false;
  }
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
