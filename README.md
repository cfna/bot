# MacroController

> An experimental macro interpretation module written in Node.

![Github Workflow Status (branch)](https://img.shields.io/github/workflow/status/cfna/macro-controller/Build%20&%20Test/develop)  
![Release Version](https://img.shields.io/npm/v/@cfwest/macro-controller)  
![NPM Downloads](https://img.shields.io/npm/dt/@cfwest/macro-controller?label=Downloads&logo=npm)  

**Important Notice:**

:construction: This Module is still in development stage and not intended for public usage yet! :construction:

## What is this?

The goal of this project is to build a self-written macro interpretation module, similar (but by far not that feature rich) to the Macro Module of [Razer Synapse](https://www.razer.com/synapse-3).  

This module offers both, a command-line interface and a library module, so you can either use this project right out of the box or extend it by using the exposed Api.  

## Building

Build Requirements:

- Node 14
- Yarn

*Note:* This project is able to compile cross-platform, however it's mainly tested on Windows!

To build the project run:

```sh
yarn build
```

To build a native executable run:

```sh
// Windows
yarn build:native:win 

// Mac
yarn build:native:mac

// Linux
yarn build:native:linux
```

## Module Api

> TODO: This is still work in progress...

## License

Copyright (c) 2018 - 2020 - PDDStudio & Contributors - [MIT Licensed](./LICENSE)
