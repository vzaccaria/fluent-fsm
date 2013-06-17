(function(){
  var fsm, anyOf, EventEmitter, fs, red, gre, blu, tester, tst;
  fsm = require('fsmexpress').fsm;
  anyOf = require('fsmexpress').anyOf;
  EventEmitter = require('events').EventEmitter;
  fs = new fsm();
  fs.defineAsStates(['II', 'SI', 'PI', 'OI', 'IS', 'SS', 'PS', 'OS', 'IP', 'SP', 'PP', 'OP', 'IC', 'SC', 'PC', 'OC', 'error']);
  fs.defineAsInitial('II');
  fs.from('I(.+)').butNotFrom(anyOf(['IP', 'IC'])).on('anEvent').nextIs('S-').otherwiseIs('error');
  fs.from('S(.+)').butNotFrom(anyOf(['SP', 'SC'])).on('anEvent2').nextIs('P-').otherwiseIs('error');
  fs.from('P(.+)').butNotFrom(anyOf(['PC'])).on('anEvent3').nextIs('O-').otherwiseIs('error');
  fs.from('P(.+)').butNotFrom(anyOf(['PP', 'PC'])).on('anotherEvent').nextIs('II').otherwiseIs('error');
  fs.from('(.+)I').on('anotherEvent2').nextIs('-S').otherwiseIs('error');
  fs.from('(.+)S').butNotFrom(anyOf(['IS', 'SS', 'PS'])).on('anotherEvent3').nextIs('-P').otherwiseIs('error');
  fs.from('OP').on('differentEvent').nextIs('II');
  fs.from('(.+)P').on('differentEvent2').nextIs('-I');
  fs.unfold();
  fs.optimize();
  red = "#9d261d";
  gre = "#46a546";
  blu = "#049cdb";
  fs.prepareEmit();
  fs.mark({
    transition: '.+',
    withColor: 'lightgrey'
  });
  fs.mark({
    transition: '.+Open',
    withColor: gre + ""
  });
  fs.mark({
    transition: '.+Close',
    withDashedColor: gre + ""
  });
  fs.mark({
    transition: 'failed.+',
    withColor: "indianred"
  });
  fs.mark({
    state: '.+',
    withColor: 'lightgrey'
  });
  fs.mark({
    state: 'error',
    withColor: 'indianred'
  });
  fs.mark({
    state: fs.initial,
    withColor: gre + ""
  });
  fs.mark({
    state: fs.final,
    withColor: "lightsteelblue"
  });
  console.log(fs.data);
  fs.serve(6970, 'my fsm');
  tester = (function(superclass){
    var prototype = extend$((import$(tester, superclass).displayName = 'tester', tester), superclass).prototype, constructor = tester;
    prototype.run_op = function(){
      this.emit('anEvent');
      return setTimeout(this.run_tr, 300);
    };
    prototype.run_tr = function(){
      this.emit('anEvent2');
      return setTimeout(this.run_fl, 300);
    };
    prototype.run_fl = function(){
      this.emit('anotherEvent');
      return setTimeout(this.run_op, 300);
    };
    function tester(){
      this.run_fl = bind$(this, 'run_fl', prototype);
      this.run_tr = bind$(this, 'run_tr', prototype);
      this.run_op = bind$(this, 'run_op', prototype);
      tester.superclass.apply(this, arguments);
    }
    return tester;
  }(EventEmitter));
  tst = new tester();
  fs.registerEventEmitter(tst);
  fs.start();
  tst.run_op();
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
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
