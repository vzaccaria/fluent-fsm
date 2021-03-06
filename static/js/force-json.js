(function(){
  var fsmVisualizer, eventMockup;
  fsmVisualizer = (function(){
    fsmVisualizer.displayName = 'fsmVisualizer';
    var prototype = fsmVisualizer.prototype, constructor = fsmVisualizer;
    function fsmVisualizer(location, eventEmitterObject){
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
      eventOrigin.on('message', function(d){
        return this$.highlight(d.state);
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
      this$.run_events = bind$(this$, 'run_events', prototype);
      this$.getEmitter = bind$(this$, 'getEmitter', prototype);
      this$.eventEmitter = jQuery('#chart');
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.getEmitter = function(){
      return this.eventEmitter;
    };
    prototype.run_events = function(v){
      var trigEv, this$ = this;
      this.v = v;
      this.vn = [];
      trigEv = function(){
        var ev;
        if (this$.v.length === 0) {
          this$.v = this$.vn;
          this$.vn = [];
        }
        ev = this$.v.pop();
        this$.vn.push(ev);
        this$.eventEmitter.trigger('message', {
          state: ev
        });
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
