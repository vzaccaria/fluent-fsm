(function(){
  var fsmVisualizer, vis;
  fsmVisualizer = (function(){
    fsmVisualizer.displayName = 'fsmVisualizer';
    var prototype = fsmVisualizer.prototype, constructor = fsmVisualizer;
    function fsmVisualizer(location, eventEmitterObject){
      var this$ = this;
      this.displayData = bind$(this, 'displayData', prototype);
      this.registerSocketIo = bind$(this, 'registerSocketIo', prototype);
      this.highlight = bind$(this, 'highlight', prototype);
      if (location === "server") {
        d3.json("data/data.json", function(data){
          this$.registerSocketIo();
          return this$.displayData(data);
        });
      } else {
        this.registerToEventEmitter(eventEmitterObject);
      }
      this.current = null;
      this.nodec = null;
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
      d3.selectAll(".link").style("opacity", 0.0);
      return d3.selectAll(".arcs").each(function(d, i){
        return this.tgstate = false;
      });
    };
    prototype.showAll = function(){
      d3.selectAll(".link").style("opacity", 1.0);
      return d3.selectAll(".arcs").each(function(d, i){
        return this.tgstate = true;
      });
    };
    prototype.highlight = function(k){
      console.log(this.current + " -> " + k);
      console.log("Setting #nid-" + this.current + " - " + this.nodec[this.current]);
      if (this.current != null) {
        d3.selectAll("#nid-" + this.current).transition().duration(200).style("fill", this.nodec[this.current]);
        console.log("Setting #nid-" + k + " - black");
      }
      d3.selectAll("#nid-" + k).transition().duration(200).style("fill", 'black');
      return this.current = k;
    };
    prototype.registerSocketIo = function(){
      var socket, this$ = this;
      console.log("Connecting!");
      socket = io.connect();
      socket.on('connect', function(){
        return console.log("Connected!");
      });
      socket.on('message', function(d){
        return this$.highlight(d.state);
      });
      return socket.on('disconnect', function(){
        return console.log("Disconnected!");
      });
    };
    prototype.displayData = function(data){
      var i$, ref$, len$, t, k, v;
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
        d3.selectAll("#nid-" + k).style("stroke", v).style("fill", v).style("stroke-width", 5);
      }
      return this.nodec = data.scolor;
    };
    return fsmVisualizer;
  }());
  vis = new fsmVisualizer("server");
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
