(function(){
  var text, converter, ht;
  text = '\nThis awesome library provides an expressive way to specify, run and debug finite state machines in Javascript.\n\nHere are the main features:\n\n* Express compact state transitions with regular expressions!\n* Debug your FSM on line with a mini-server (powered by `socketio`)!\n\nNote: The fsm runs server-side! This is not compatible with browsers at the moment.\n\n## Installation\n\nTo install, use `npm`:\n\n    npm install fluent-fsm\n\n\n## Usage\n\nImport the prototype in your program:\n\n    fsm = require(\'fsmexpress\').fsm;\n\n### Create fsm and instantiate states\n\nCreate a finite state machine:\n\n    fs = new fsm()\n\nDefine states (`livescript/coffeescript` code):\n\n    fs.define-as-states([   \'II\' \'SI\' \'PI\' \'OI\' \n                            \'IS\' \'SS\' \'PS\' \'OS\' \n                            \'IP\' \'SP\' \'PP\' \'OP\' \n                            \'IC\' \'SC\' \'PC\' \'OC\' \'error\' ])\n                            \n    fs.define-as-initial(\'II\')\n\n### Define transitions\nDefine a transition (optionally using a regular expression) from all states beginning with `I` excluding some states (`IP`, `IC`) on a specific event (`an_event`) and register function `action_to_trigger`  to be triggered contextually:\n\n    fs.add_rule \n        from: \'I(.+)\'\n        excluding: \'IP IC\' \n        at: \'an_event\' \n        jumpTo: \'S-\' \n        execute: action_to_trigger  \n    \n\n**Note**: the target state `S-` is a state beginning with `S` and ending with the matched text in `(.+)` in the `from` expression. So the above statement will generate only two different state transitions (because `\'IP\' \'IC\'` are not allowed `from` states):\n\n    II -> SI\n    IS -> SS\n    \n\n### Unfold and optimize \n\nAfter the state transitions have been setup, invoke `unfold` to generate actual state transition rules:\n\n    fs.unfold()\n\nPrune states that are not reachable:\n    \n    fs.optimize()\n    \n    \n### Linking to an event emitter\n\nTo register an event emitter:\n\n    fs.registerEventEmitter(the_event_emitter)\n\n`the_event_emitter` should be a Node `Emitter` object. The FSM registers its own listeners to enable state transition internal methods. Practically, let\'s assume that we have the following event emitter:\n\n    class tester extends EventEmitter\n        \n        run_op: ~> \n            @emit \'anEvent\'\n            setTimeout(@run_tr, 300)\n        \n        run_tr: ~> \n            @emit \'anEvent2\'\n            setTimeout(@run_fl, 300)\n        \n        run_fl: ~> \n            @emit \'anotherEvent\'\n            setTimeout(@run_op, 300)\n\nLet\'s register it and start the finite state machine:\n\n    tst = new tester()\n    \n    # Register event emitter and start the fsm\n    fs.registerEventEmitter(tst)  \n    fs.start()   \n    \n\n## GUI debug\n\nYou can have a visual representation of the FSM that is served through a small web service (screenshot above):\n\n    red = "#9d261d"\n    gre = "#46a546"\n    blu = "#049cdb"\n\n    # GUI related stuff..\n    fs.prepare-emit()\n    fs.mark transition: \'.+\',       with-color: \'lightgrey\'\n    fs.mark transition: \'.+Open\',   with-color: "#gre"\n    fs.mark transition: \'.+Close\',  with-dashed-color: "#gre"\n    fs.mark transition: \'failed.+\', with-color: "indianred"\n    fs.mark state:      \'.+\',       with-color: \'lightgrey\'\n    fs.mark state:      \'error\',    with-color: \'indianred\'\n    fs.mark state:      fs.initial, with-color: "#gre"\n    fs.mark state:      fs.final,   with-color: "lightsteelblue"\n    console.log fs.data\n\n    fs.serve(6970, \'my fsm\')\n\nYou can see live state transitions (wherever the fsm is, even remotely, provided that the port can be accessed).\n\n\n\n [^1]: In livescript, dashes "-" are used to create camelized Javascript identifiers. So, `any-of` is translated to `anyOf` by the livescript compiler.\n\n## To do\n\nThe following is a tentative list of actions around this project.\n\n| date          | action                            | category  |\n| ------------- | -------------                     | :-------: |\n| June 24, 2013 | link to a live example            | BLD       |\n| June 30, 2013 | release version 0.0.1             | REL       |\n\n\n\n    \n\n \n';
  converter = new Showdown.converter();
  ht = converter.makeHtml(text);
  $(ht).appendTo("#text");
}).call(this);
(function(){
  var optimist, fs, argv, command, expression;
  optimist = require('optimist');
  fs = require('fs');
  argv = optimist.usage('replace.\nSubstitute _source_ to @text@ in _inputfile_.\nUsage: $0 --option=V | -o V [ inputfile ]\n', {
    source: {
      alias: 's',
      description: 'file containing the string to be substituted'
    }
  }).argv;
  if (argv.help) {
    optimist.showHelp();
    return;
  }
  command = argv._;
  if (command.length === 0 || !(argv.source != null)) {
    optimist.showHelp();
    return;
  }
  expression = /__text__/gi;
  fs.readFile(command[0], function(err, data){
    return fs.readFile(argv.source, function(err, sdata){
      var d;
      d = data.toString().replace(expression, sdata);
      return console.log(d);
    });
  });
}).call(this);
