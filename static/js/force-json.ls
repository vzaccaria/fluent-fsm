

class fsm-visualizer
  
    (event-emitter-object) ->
     
      data <~ d3.json("data/data.json")
      @current = null
      @nodec   = null
      @display-data(data)
      @register-event-io(event-emitter-object) 
      
    toggle-link: ~>
        | @tgstate == true =>
                    opacity  = 0.0
                    @tgstate = false
        | otherwise          
                    opacity  = 1.0
                    @tgstate = true 
            
        d3.selectAll(".link.#{@id}") 
          .style("opacity",opacity)  
            
    hide-all: ~> 
        d3.selectAll(".link") 
          .style("opacity",0.0) 
          
        d3.selectAll(".arcs")
          .each((d,i) ~> @tgstate = false)

    show-all: ~>
        d3.selectAll(".link") 
          .style("opacity",1.0)     
          
        d3.selectAll(".arcs")
          .each((d,i) ~> @tgstate = true)
    
    highlight: (k) ~>
        if @current? and @nodec?
          console.log "#{@current} => #{k}"
          # console.log "Setting \#nid-#{@current} - #{@nodec[@current]}"
        
          d3.selectAll("\#nid-#{@current}")
            .transition()
            .duration(200)
            .style("fill", @nodec[@current])
      
        console.log "Setting \#nid-#{k} - black"
  
        d3.selectAll("\#nid-#{k}")
          .transition()
          .duration(200)
          .style("fill", 'black')
          
        @current = k
        
    register-event-io:  (event-origin) ~>
        event-origin.on('connect',        ~> console.log "Connected!")
        event-origin.on 'message',  (d,e) ~> 
          if(e?.state?)
              @highlight e.state 
          else 
              @highlight d.state
        event-origin.on('disconnect',     ~> console.log "Disconnected!")
           
    display-data: (data) ~> 
  
      @nodec = data.scolor
 
      for t in data.transitions
            d3.select("\#buttonlist")
              .append("button")
              .attr("class","btn arcs btn-primary btn-mini span2")
              .attr("id", "#t")
              .text( t )
              .on('click.button.data-api', @toggle-link)
              
      d3.select("\#hide")
        .append("button")   
        .attr("class", "btn btn-mini btn-primary span2")
        .text("Hide all")
        .on('click.button.data-api', @hide-all)

      d3.select("\#show")
        .append("button")   
        .attr("class", "btn btn-mini btn-primary span2")
        .text("Show all")
        .on('click.button.data-api', @show-all)
   
 
      fsmview(data.links, data.transitions)
        
      @show-all() 
     
      if(data.name?) 
          d3.select("\#name")
              .text(data.name)
      
      for k,v of data.tcolor
          
         d3.selectAll(".link.#{k}")
           .style("stroke", v.col)
           
         if v.dashed
          d3.selectAll(".link.#{k}")
            .style("stroke-dasharray","0,2 1")
                
         d3.selectAll("marker\##k")
           # .style("fill", "\#ff0000")
           .style("fill", v.col)

      for k,v of data.scolor
         d3.selectAll("\#nid-#{k}")
           .style("stroke",v)
           .style("fill", v)
           .style("stroke-width", 5)
      
   

class event-mockup 
  
    (@ms) ~>
       @event-emitter = jQuery('#chart')
  
    get-emitter: ~> 
       return @event-emitter
    
    run-events: (@v) ~>
       @vn = []
       @v.reverse()
       trig-ev = ~>
           
          if(@v.length == 0)
              @vn.reverse()
              @v = @vn
              @vn = [] 
              
          ev = @v.pop()
          console.log "Triggering #ev"    
          @vn.push(ev)
          @event-emitter.trigger('message', [ state: ev ])
          window.set-timeout(trig-ev, @ms)

       trig-ev()

window.fsm-visualizer = fsm-visualizer
window.event-mockup   = event-mockup