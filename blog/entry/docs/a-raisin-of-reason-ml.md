# A Raisin Of Reason (ML)

![ReasonML Logo](https://reasonml.github.io/static/reason_300.5d19cfa6.png)

[Reason](https://reasonml.github.io/) is a fairly new programming language (I'll refer to it as ReasonML for the rest of this). It has a rather interesting strategy as a language by trying to have a similar syntax to modern Javascript but sharing the semantics of OCaml. It also uses a corresponding project, [Bucklescript](https://bucklescript.github.io/), to go from OCaml to Javascript. So ReasonML is an OCaml syntax replacement that targets JS runtimes.

[ReasonReact](https://reasonml.github.io/reason-react/docs/en/what-why.html) is an associated project. Its goal is to provide an interface to React through ReasonML. Though it provides a different interface into React, the general output are the typical components one would expect.

I've played around with the ReasonML and ReactReason for 2-3 days. So take my thoughts with a large pinch of salt. I plan on adding more as I keep exploring, so perhaps swing back now and then to see if topics have been added or changed.

With that in mind, here are some notes on what I've found so far.

## General Developer Experience

### I'm a fan of having a ML readily available for the front-end

If you're used to JS or Python, using a language that isn't typed during runtime can at times feel a bit... rugged. But between the touched up syntax in ReasonML and type inferencing from OCaml, I think developers could make this leap with some reasonable effort.

### Using JS tools is great for JS developers

The ecosystem makes use of JS tools, such as `npm`, `yarn`. If one uses `create-react-app` + `reason-scripts` you'll encounter Webpack as well. It feels nice as a person who mainly uses JS tools. I suspect it might be kind of awkward for people who aren't using JS tools typically, but I also suspect it would be *way* more jarring the other way around.

This may be tool overload by some measures (Reason, OCaml, Bucklescript, Node, Webpack, ...) but as someone who is pretty experienced with the JS tools and has some familiarity with OCaml ones, it hasn't felt too overwhelming yet. There may be room to simplify the toolchain in the future, but for now it seems to work!

### The ReasonML docs are decent, while the ReasonReact docs could be better

The official ReasonML docs seem pretty decent. They provide specific about different aspects of the language, and discuss design choices in the sections to help further clarify. They also export the OCaml API on their site. This is both good and bad - Good because having the API in this format is vital, and bad because if you're not used to reading the OCaml API, it could feel somewhat confusing.

I found the ReasonReact docs a bit tougher. It starts off OK, with some introductions and examples. Later on, it interjects random tips and tricks in the middle of a topic. While useful, this makes for a bit of a confusing read, and not something I could find again without much effort.

## ReasonML

#### Pattern Matching + Variant Types

Pattern matching is one of the features that is wildly unique coming from something like C. As the ReasonML docs mention ("switch" below means pattern matching):

> *Using a Reason switch for the first time might make you feel like you've been missing out all these years. Careful, for it might ruin other languages for you =).*

Suppose I need to show different messages if an account list has zero, one, or nany accounts. Here's how to express that in ReasonML:

```ocaml
let accounts = findAccounts(id);

switch accounts {
| [] => "No accounts are available"
| [acct] => "Welcome to your account, " ++ acct.userName
| [acct, ...rest] => "Please select the account you wish to view"
};
```

This lets you make clear the states of the list, and also gives you access to elements in the list.

The real magic is in what the compiler does for you. Say I omitted the empty list case. Here's the message I get today:

```
Warning 8: this pattern-matching is not exhaustive.
Here is an example of a value that is not matched:
[]
```

In other words, the compiler is aware of the type, and based on the type it will warn you to handle every possibility. This is a real issue too, as I'm willing to wager an amount of money any professional developer can tell you they've been a part of this:

```javascript
if (a) {
  doTheWork();
} else {
  // TODO: WHY DID THIS HAPPEN?!
  console.info('this will never happen');
}
```

Pattern matching is a step closer to avoiding scenarios like this (or at least forcing one to be explicit in their lack-of handling).

Pattern matching applies to more than lists though. It can use literal values, records, and most interesting variants. Variant types allow a developer to specify constructors of different types. For example, an forum Account could have a role of User or Admin or Operator, which might look like this:

```ocaml
type Role = 
| Admin
| Moderator
| User;

type Account = {
  role: Role
};
```

Applying this to pattern matching, and the compiler can ensure we don't miss a case of dealing with a certain kind of account:

```ocaml
let account = lookupAccount(id);

switch account.role {
| Admin => deleteAllAccounts()
| Moderator => deleteSomeAccounts()
};
```

In this case, we forgot to cover the variant constructor "User". The compiler informs us of this, and we in turn handle it. A set of features like this is a real and concrete argument for choosing one language over another.

#### Opt-in mutable variables is a welcome change

Javascript still tends towards mutability. One example of how this plays out in JS is that people go for the mutable `let` binding by instinct, and tend to skip its immutable counterpart, `const`. The projects I've been part of have moved away from this, but I don't think it's the standard.

ReasonML (like OCaml) make bindings immutable by default. In other words,`let x = 5` cannot change. To create a mutable value, you must make a `ref` of it => `let y = ref(4)` and operate on it in funny ways (reassignment is its own operator, obtaining the reference value has an operator, etc).

Little tweaks like this and nudges towards certain design choices are what languages are good at. And I think that generally speaking these are good nudges to be making.

#### I don't know if I like the syntax more or less than OCaml

This part is a bit shallow. But people have opinions on this topic. Here are some of mine.

Having using OCaml and F# bit, I've grown somewhat comfortable with the syntax. I find it clean most of the time and plays into some of the semantics of the language better too.

For example, function application and currying in OCaml does not require parenthesis.

```ocaml
let pickByValue value theRecord = theRecord.value = value (* a simple comparator *)
let mySandyGirl = pickByValue "Sandy"                     (* comparator curried for this user *)
List.find mySandyGirl users                               (* now it's applied *)
```

 ReasonML can also do this, but it's less clear to me when a function has been curried or not:

```ocaml
let pickByValue = (value, theRecord) => theRecord.value == value; (* a simple comparator *)
let mySandyGirl = pickByValue("Sandy");                           (* comparator curried for this user *)
List.find(mySandyGirl, users);                                    (* now it's applied *)
```

Another small difference - using `switch` instead of `match` is odd to me too. Here's OCaml:

```ocaml
type action =
    | AddUser of string * int
    | RemoveUser of int

let thisAction = AddUser ("Sandy", 54);

match thisAction with
| AddUser (name, age) -> ...
| RemoveUser id -> ...
```

And here's ReasonML:

```ocaml
type action =
  | AddUser((string, int))
  | RemoveUser(int)

let thisAction = AddUser(("Sandy", 54));

switch thisAction {
| AddUser((name, age)) -> ...
| RemoveUser(id) -> ...
}
```

My hunch is that `switch` will lead users unfamiliar with pattern matching to try and apply the semantics of a C-style `switch` and result in some confusion.

## ReasonReact

#### The state management system is an improvement over React

ReasonReact, like React on its own, provides a state management system. ReasonReact's state management is a bit more sophisticated than using `setState()` like in React. In fact, it will feel familiar with Redux if you're used to that.

A small code example will illuminate the setup better than any wordy explanation I can provide though. In this example, I create a form to collection a stating location and an ending location. The values will be saved in-state & submitted later.

```ocaml
type state = { source: string, dest: string };
type action = 
  | UpdateSource(string)
  | UpdateDest(string);

let component = ReasonReact.reducerComponent("FindPathForm");

let make = (_children) => {
  {
    ...component,
    initialState: () => {
      source: "",
      dest: ""
    },
    reducer: (action, state) => {
      switch action {
      | UpdateSource(value) => ReasonReact.Update({ ...state, source: value })
      | UpdateDest(value) => ReasonReact.Update({ ...state, dest: value })
      }
    },
    render: (self) => {
      <div>
        <input placeholder="Start" onChange={self.reduce(event => UpdateSource(ReactDOMRe.domElementToObj(ReactEventRe.Form.target(event))##value))} />
        <input placeholder="End" onChange={self.reduce(event => UpdateDest(ReactDOMRe.domElementToObj(ReactEventRe.Form.target(event))##value))} />
      </div>
    }
  }
};
```

The major pieces are:

* Types to describe the state and the actions available.
* Creating a component using `component` and `make`.
* Adding a `reducer` function to the record created.
* Adding a UI to trigger the actions created.

The `ReasonReact` module provides a variety of different ways to take action when an action occurs. This includes `Update`, `UpdateWithSideEffects`, `SideEffects`, and `NoUpdate`. This is a bit different, since in Redux one would tie into some middleware to handle side effects. I would say this is a nice update.

Overall, the state management system in ReasonReact seems like a solid step forward. Definitely worth trying

#### Some oddities when creating/interacting with components

Generally speaking, the experience of ReasonReact isn't terribly different than React on its own. Some pieces don't feel great coming from React though.

1. When creating a new text element inline, one must explicitly call it out the string as an element. 
    1. In React JS: `<span>'Name: ' + account.name</span>`. This will turn the nested string into an element for you.
    1. In ReasonReact: `<span>(ReasonReact.stringToElement("Name: " ++ account.name))</span>`. ReasonReact requires you to convert the string to an element explicitly..
1. Obtaining values from inputs is a bit clunky at this point. From the example earlier, we used this somewhat cryptic line to get the event's target's value: `ReactDOMRe.domElementToObj(ReactEventRe.Form.target(event))##value`. Not terrible, but not obvious either.
    1. [There does seem to be a way to get a Reason `ref` to look at a specific node](https://reasonml.github.io/reason-react/docs/en/react-ref.html). This may be another means to access it, but I haven't tried it out yet.
1. To create a standard DOM node element with an array of children, one must leave the world of JSX and create the element directly like this: `ReasonReact.createDomElement("div", ~props={"className": "Graph-node_edges"}, children)`.
    1. [There are plans to improve this](https://reasonml.github.io/reason-react/docs/en/children.html) according to the docs, but it's not clear from the docs what those plans are.