`MiniReact` is a fairly working React implementation which aims to play like some basic React functionality. It was written with these keys concepts in mind:

- Immutability;
- Separation of concerns;
- Unit tests;
- Error handling;

# What we take into account

As the boilerplate uses `arrows functions` and `class expressions`, MiniReact was developed with these browsers in mind:

- Edge >= 12
- Firefox >= 36
- Chrome >= 49
- Safari >= 10
- Opera >= 36
- Android Chrome >= 67

We don't try to be a complete React implementation, but to permit the users to create complex tree dependencies between simple tag elements and components, include/remove attributes and event listeners on the fly 

# Components

MiniReact lets you define components as classes. To define a MiniReact component class, you need to extend MiniReact.Component (available as a global Component class as well)

```
class MyComponent extends Component {
  render() {
    ...
  }
}
```

## setState(func)

If you use a class component, you will have access to this method. Different from React, setState only accepts a function that should return an object, that object will be merged with component internal state, and it is `synchronous`.

# Virtual DOM Node

You can create a virtual dom node using the global factory `node`, it will return a VDOM to be used as result of a `render` function from a class component.

node accepts two types of parameters:

- blueprint object
- string

## blueprint object

- blueprint {object}
- blueprint.tagName {string} - any valid html tag
- blueprint[attribute_name] {any} - an attribute that should be applied to that tag
- blueprint.children[] {blueprint|string} - an array of values that are accepted by `node` factory, if a textContent attribute is found this option will be ignored.

## string

Any text is valid as it will be converted to a span vnode internally.

# Internals

Bellow you can see the basics decisions and conventions we used them while this lib was being developed

## Directory structure

The directory structure was designed with separation of concerns in mind, each folder has a special meaning

```
|-- public
|-- src
    |-- dom
    |-- vdom
```

### public

The public directory is where the result assets of this project are located in, it is designed to be the public folder on a hosted environment. Be carefull what you put there

### src

This folder has the core code used by MiniReact and the main entrypoint

#### vdom

This directory hosts the Virtual DOM Implementation, diffing and all related code 

### dom

This directory hosts the DOM manipulation engine etc. Modules that has the name ending with `*ing` must be considered as non free of side effects

## How it works

MiniReact has three phases which are:

- constructing
- patching
- unmounting

### constructing

At this phase, for each vnode we verify if it is a VNode Element, if true we create a DOM Element and returns a new VNode with this DOM Element as a child, otherwise we assume it is a Component, wire up the paching DOM mechanism and calls its render function and start over this phase recursively with the result of the render

### patching

This phase is used to diff what we have in the past with what we have now as props (and state), we apply this modifications to the DOM

### unmounting

This phase is the cleanup one, where we remove DOM Nodes and try to free the garbage

## Development scripts

### Requirements

- NODE >=8.11.3
- NPM  ~5.6.0

In order to build this application localy you must first install [nodejs](https://nodejs.org/en/)

### `npm install`

> Installs package dependencies

### `npm run dev`

> Start this project in development mode opening your browser at `http://localhost:3000`

### `npm run build`

> Build this project for publishing

### `npm run start`

> Build this project in production mode opening your browser at `http://localhost:3000` 


### `npm run test`

> Execute all tests

### `npm run test:watch`

> Execute all tests, but keep watching for changes. Good for development.

### `npm run test:coverage`

> Generate coverage report into the folder `./coverage/Icov-report/`
