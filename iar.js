#!/usr/bin/env node
const repl = require("repl");
const util = require('util');


console.log('Welcome to Interactive Active Redux');
console.log('Run `.help` to see all avaiable commands');
console.log('No models are imported yet, run `.models ./models-file-name` to import your models first');

function myWriter(output) {
  if(output.format) {
    return util.inspect(output.format(), { showHidden: false, depth: 5, colors: true  });
  }
  
  return util.inspect(output, { colors: true });
}

var replServer = repl.start({
  prompt: "iar > ",
  writer: myWriter
});

replServer.defineCommand('models', {
  help: 'Import models using `.models ./models-file-name`',
  action(modelsName) {
    this.lineParser.reset();
    this.bufferedCommand = '';
    const models = require(modelsName);
    for(var model in models) {
      const modelCtor = models[model];
      console.log(`"${modelCtor.name}" imported`);
      this.context[modelCtor.name] = modelCtor;
    }
    
    this.displayPrompt();
  }
});

replServer.context.store = {
  entitities: {
    posts: {
      1: {
        title: 'Intro to Active Redux',
        url: '/intro-to-active-redux',
        authorId: '1',
      }
    },
    users: {
      1: {
        id: 1,
        name: 'Vitalij',
        surname: 'Kudresov',
        points: 23,
      },
      2: {
        id: 2,
        name: 'Beata',
        surname: 'Vaiciunate',
        points: 90,
      }
    },
    orders: {
      1: {
        id: 1,
        products: [1, 2],
        userId: 1,
        isPaid: false,
      },
      2: {
        id: 2,
        userId: 2,
        products: [3],
        isPaid: true,
      }
    },
    products: {
      1: {
        id: 1,
        name: 'apple',
        price: 0.25
      },
      2: {
        id: 2,
        name: 'kiwi',
        price: 0.5
      },
      3: {
        id: 3,
        name: 'orange',
        price: 0.75
      }
    }
  }
};