# IoT System to monitoring vibrations
This repository contains source code of an IoT system developed for a Unisannio exam:
- information integration layer program code: server exposing REST API, written in Node.js
- physical layer program code: to be loaded on the microcontroller (NUCLEO-F401RE), written in C++

### IoT Node
- STM32 NUCLEO-F401RE
- X-NUCLEO-IKS01A2
- ESP8266

### Information Integration layer
The following instructions are for the server part:

#### Getting Started

<span style="color:gray"># Clone the project</span>
```
git clone https://github.com/lorenzosax/iot-data-collector
```
`cd iot-data-collector`

<span style="color:gray"># Install dependencies</span>
```
npm install
``` 
 If you use [Yarn](https://yarnpkg.com), just replace `npm` with `yarn` in the commands.
##### Start Your development
```
npm run start:dev
```
This command starts a [nodemon](https://nodemon.io) process for your server restart when a code change happens.
#### Linting
This scaffold uses [ESlint](https://eslint.org). 
It extends [google's eslint config](https://github.com/google/eslint-config-google). Feel
free to use your own rules or extend any other desirable rule(e.g [airbnb](https://www.npmjs.com/package/eslint-config-airbnb))
You can run linting in watch mode with:
```
npm run lint
```
Note: `npm run start:dev` starts the server with linting in watch mode, you can remove it if need be.
#### Testing
This scaffold uses [Mocha](https://mochajs.org). It also uses [Supertest](https://github.com/visionmedia/supertest) to demonstrate a simple routing test suite.
Feel free to remove the supertest if you don't wish to use it.
You can start the test runner in watch mode with:
```
npm test
```
