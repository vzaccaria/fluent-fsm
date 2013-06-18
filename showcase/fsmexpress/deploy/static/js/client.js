(function(){
  var fsmVisualizer, eventMockup;
  fsmVisualizer = (function(){
    fsmVisualizer.displayName = 'fsmVisualizer';
    var prototype = fsmVisualizer.prototype, constructor = fsmVisualizer;
    function fsmVisualizer(eventEmitterObject){
      var this$ = this;
      this.displayData = bind$(this, 'displayData', prototype);
      this.registerEventIo = bind$(this, 'registerEventIo', prototype);
      this.highlight = bind$(this, 'highlight', prototype);
      this.showAll = bind$(this, 'showAll', prototype);
      this.hideAll = bind$(this, 'hideAll', prototype);
      this.toggleLink = bind$(this, 'toggleLink', prototype);
      d3.json("data/data.json", function(data){
        this$.current = null;
        this$.nodec = null;
        this$.displayData(data);
        return this$.registerEventIo(eventEmitterObject);
      });
    }
    prototype.toggleLink = function(){
      var opacity;
      switch (false) {
      case this.tgstate !== true:
        opacity = 0.0;
        this.tgstate = false;
        break;
      default:
        opacity = 1.0;
        this.tgstate = true;
      }
      return d3.selectAll(".link." + this.id).style("opacity", opacity);
    };
    prototype.hideAll = function(){
      var this$ = this;
      d3.selectAll(".link").style("opacity", 0.0);
      return d3.selectAll(".arcs").each(function(d, i){
        return this$.tgstate = false;
      });
    };
    prototype.showAll = function(){
      var this$ = this;
      d3.selectAll(".link").style("opacity", 1.0);
      return d3.selectAll(".arcs").each(function(d, i){
        return this$.tgstate = true;
      });
    };
    prototype.highlight = function(k){
      if (this.current != null && this.nodec != null) {
        console.log(this.current + " => " + k);
        d3.selectAll("#nid-" + this.current).transition().duration(200).style("fill", this.nodec[this.current]);
      }
      console.log("Setting #nid-" + k + " - black");
      d3.selectAll("#nid-" + k).transition().duration(200).style("fill", 'black');
      return this.current = k;
    };
    prototype.registerEventIo = function(eventOrigin){
      var this$ = this;
      eventOrigin.on('connect', function(){
        return console.log("Connected!");
      });
      eventOrigin.on('message', function(d, e){
        if ((e != null ? e.state : void 8) != null) {
          return this$.highlight(e.state);
        } else {
          return this$.highlight(d.state);
        }
      });
      return eventOrigin.on('disconnect', function(){
        return console.log("Disconnected!");
      });
    };
    prototype.displayData = function(data){
      var i$, ref$, len$, t, k, v, results$ = [];
      this.nodec = data.scolor;
      for (i$ = 0, len$ = (ref$ = data.transitions).length; i$ < len$; ++i$) {
        t = ref$[i$];
        d3.select("#buttonlist").append("button").attr("class", "btn arcs btn-primary btn-mini span2").attr("id", t + "").text(t).on('click.button.data-api', this.toggleLink);
      }
      d3.select("#hide").append("button").attr("class", "btn btn-mini btn-primary span2").text("Hide all").on('click.button.data-api', this.hideAll);
      d3.select("#show").append("button").attr("class", "btn btn-mini btn-primary span2").text("Show all").on('click.button.data-api', this.showAll);
      fsmview(data.links, data.transitions);
      this.showAll();
      if (data.name != null) {
        d3.select("#name").text(data.name);
      }
      for (k in ref$ = data.tcolor) {
        v = ref$[k];
        d3.selectAll(".link." + k).style("stroke", v.col);
        if (v.dashed) {
          d3.selectAll(".link." + k).style("stroke-dasharray", "0,2 1");
        }
        d3.selectAll("marker#" + k).style("fill", v.col);
      }
      for (k in ref$ = data.scolor) {
        v = ref$[k];
        results$.push(d3.selectAll("#nid-" + k).style("stroke", v).style("fill", v).style("stroke-width", 5));
      }
      return results$;
    };
    return fsmVisualizer;
  }());
  eventMockup = (function(){
    eventMockup.displayName = 'eventMockup';
    var prototype = eventMockup.prototype, constructor = eventMockup;
    function eventMockup(ms){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.ms = ms;
      this$.runEvents = bind$(this$, 'runEvents', prototype);
      this$.getEmitter = bind$(this$, 'getEmitter', prototype);
      this$.eventEmitter = jQuery('#chart');
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.getEmitter = function(){
      return this.eventEmitter;
    };
    prototype.runEvents = function(v){
      var trigEv, this$ = this;
      this.v = v;
      this.vn = [];
      this.v.reverse();
      trigEv = function(){
        var ev;
        if (this$.v.length === 0) {
          this$.vn.reverse();
          this$.v = this$.vn;
          this$.vn = [];
        }
        ev = this$.v.pop();
        console.log("Triggering " + ev);
        this$.vn.push(ev);
        this$.eventEmitter.trigger('message', [{
          state: ev
        }]);
        return window.setTimeout(trigEv, this$.ms);
      };
      return trigEv();
    };
    return eventMockup;
  }());
  window.fsmVisualizer = fsmVisualizer;
  window.eventMockup = eventMockup;
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
(function(){
  var text, converter, ht;
  text = '\nThis awesome library provides an expressive way to specify, run and debug finite state machines in Javascript.\n\nHere are the main features:\n\n* Express compact state transitions with regular expressions!\n* Debug your FSM on line with a mini-server (powered by `socketio`)!\n\nNote: The fsm runs server-side! This is not compatible with browsers at the moment.\n\n## Installation\n\nTo install, use `npm`:\n\n    npm install fluent-fsm\n\n\n## Usage\n\nImport the prototype in your program:\n\n    fsm = require(\'fsmexpress\').fsm;\n\n### Create fsm and instantiate states\n\nCreate a finite state machine:\n\n    fs = new fsm()\n\nDefine states (`livescript/coffeescript` code):\n\n    fs.define-as-states([   \'II\' \'SI\' \'PI\' \'OI\' \n                            \'IS\' \'SS\' \'PS\' \'OS\' \n                            \'IP\' \'SP\' \'PP\' \'OP\' \n                            \'IC\' \'SC\' \'PC\' \'OC\' \'error\' ])\n                            \n    fs.define-as-initial(\'II\')\n\n### Define transitions\nDefine a transition (optionally using a regular expression) from all states beginning with `I` excluding some states (`IP`, `IC`) on a specific event (`an_event`) and register function `action_to_trigger`  to be triggered contextually:\n\n    fs.add_rule \n        from: \'I(.+)\'\n        excluding: \'IP IC\' \n        at: \'an_event\' \n        jumpTo: \'S-\' \n        execute: action_to_trigger  \n    \n\n**Note**: the target state `S-` is a state beginning with `S` and ending with the matched text in `(.+)` in the `from` expression. So the above statement will generate only two different state transitions (because `\'IP\' \'IC\'` are not allowed `from` states):\n\n    II -> SI\n    IS -> SS\n    \n\n### Unfold and optimize \n\nAfter the state transitions have been setup, invoke `unfold` to generate actual state transition rules:\n\n    fs.unfold()\n\nPrune states that are not reachable:\n    \n    fs.optimize()\n    \n    \n### Linking to an event emitter\n\nTo register an event emitter:\n\n    fs.registerEventEmitter(the_event_emitter)\n\n`the_event_emitter` should be a Node `Emitter` object. The FSM registers its own listeners to enable state transition internal methods. Practically, let\'s assume that we have the following event emitter:\n\n    class tester extends EventEmitter\n        \n        run_op: ~> \n            @emit \'anEvent\'\n            setTimeout(@run_tr, 300)\n        \n        run_tr: ~> \n            @emit \'anEvent2\'\n            setTimeout(@run_fl, 300)\n        \n        run_fl: ~> \n            @emit \'anotherEvent\'\n            setTimeout(@run_op, 300)\n\nLet\'s register it and start the finite state machine:\n\n    tst = new tester()\n    \n    # Register event emitter and start the fsm\n    fs.registerEventEmitter(tst)  \n    fs.start()   \n    \n\n## GUI debug\n\nYou can have a visual representation of the FSM that is served through a small web service (screenshot above):\n\n    red = "#9d261d"\n    gre = "#46a546"\n    blu = "#049cdb"\n\n    # GUI related stuff..\n    fs.prepare-emit()\n    fs.mark transition: \'.+\',       with-color: \'lightgrey\'\n    fs.mark transition: \'.+Open\',   with-color: "#gre"\n    fs.mark transition: \'.+Close\',  with-dashed-color: "#gre"\n    fs.mark transition: \'failed.+\', with-color: "indianred"\n    fs.mark state:      \'.+\',       with-color: \'lightgrey\'\n    fs.mark state:      \'error\',    with-color: \'indianred\'\n    fs.mark state:      fs.initial, with-color: "#gre"\n    fs.mark state:      fs.final,   with-color: "lightsteelblue"\n    console.log fs.data\n\n    fs.serve(6970, \'my fsm\')\n\nYou can see live state transitions (wherever the fsm is, even remotely, provided that the port can be accessed).\n\n\n\n [^1]: In livescript, dashes "-" are used to create camelized Javascript identifiers. So, `any-of` is translated to `anyOf` by the livescript compiler.\n\n';
  converter = new Showdown.converter();
  ht = converter.makeHtml(text);
  $(ht).appendTo("#text");
}).call(this);
