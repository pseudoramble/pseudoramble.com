<div class="article-header">Why use a module bundler (for Javascript)?</div>

Trying to learn a new set of tools is a daunting task. There's a lot of moving parts to a fancy setup, especially with module bundlers like Webpack. Grabbing a boilerplate is easy, but also confusing if something doesn't work. [React may even make you sad](https://github.com/gaearon/react-makes-you-sad) after trying it out.

I decided I had to go back and look again. Why do I even want Webpack (or Browserify, or Rollup)? 

I wanted to run a modern-ish setup with the following features:

 * ES6 features including modules (Babel)
 * npm packages
 * Avoid a moduler bundler as long as I could
 
So I started off with a new project. Typical `npm init` and `git init` kind of stuff. Then for a few packages:

    npm install babel-cli babel-preset-es2015 babel-preset-react

Okay, cool. Babel + some preset plugins. So now how do we use Babel? `babel-cli` helps us there. It could allow you to configure a compilation step in your `package.json` maybe like this:

    ...
    "scripts": {
        "compile": "babel src/ --out-file dist/app.js"
    }
    
Now `npm run compile` will create a newly compiled-and-concatenated JS file. With a `.babelrc` file created and `babel-preset-*` installed, I thought I was all settled.

Well, kinda. Here's the output of this on a single file written in ES6 using React:

    import React from 'react';
    import X from './x.jsx';

    export default (function (_ref) {
      var moves = _ref.moves;

      var eachStep = moves.length > 0 ? moves.map(function (action, i) {
        return React.createElement(
          "div",
          { key: i },
          (action.player === "user" ? "You" : "The computer") + " removed " + action.move + " sticks"
          );
        }) : [React.createElement(
          "div",
          null,
          "Begin when you're ready!"
      )];

      return React.createElement(
        "div",
        { style: { "margin-top": "15px" } },
        eachStep
      );
    });

Problems galore! 

 * There's this mystical `react` module we don't know about.
 * Speaking of which, why am I still importing the local module `X`?
 * Speaking of which, modules shouldn't be showing up anymore! This won't load in a browser at all!
 
Some of these things can be done with Babel plugins, [which you can find here](https://babeljs.io/docs/plugins/).

Some of these things can't be done with Babel alone. Like `npm` modules. It won't be aware of them, or define them as globals for you (AFAIK there isn't a plugin to do this). So you can:

 * Include the globals you need in your `index.html` header
 * Attach modules to the `window` object where needed
 * Run a module bundler, which supports these things (and more) through plugins

So yeah, module bundlers are helpful in larger setups, even with a bit of a learning curve/some headaches.

I highly recommend just trying to start from scratch and work your way through the setup of a module bundler. No boilerplates, and no copying configs from elsewhere. [Here's an example I tried that with](https://github.com/pseudoramble/nim) using Rollupjs. 
