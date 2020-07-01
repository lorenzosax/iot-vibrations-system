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
git clone https://github.com/lorenzosax/iot-vibrations-system
```
`cd iot-vibrations-system`

<span style="color:gray"># Install dependencies</span>
```
npm install
``` 
 If you use [Yarn](https://yarnpkg.com), just replace `npm` with `yarn` in the commands.
#### Configurations
There are two files for configurations, one for production and another for development. 
The selection is made by looking at the value of the environment variable `NODE_ENV`:
-   `NODE_ENV=production` will be loaded `config/production.js` file
-   `NODE_ENV=<otherValue>` will be loaded `config/default.js` file

__You can also create a new configuration file (by copying one of those already present)
 and renaming it as you want, so that the name will correspond to the value 
 of the environment variable NODE_ENV that will be set__
 
This configuration file uses some environment variables which must necessarily be set:
- `PORT` (default value is `80`)
- `DB_USR`
- `DB_PWD`
- `JWT_SECRET_KEY`
- `GMAIL_USR`
- `GMAIL_PWD`

The last three environment variables are used because the user registration and login part is also implemented; 
all this happens thanks to the generation of a JWT that will keep the session open for a certain time configurable. 
To confirm a new registration, email verification will be required, for this reason it is necessary to 
enter a gmail account that will send the email.

#### Start Your development
```
npm run start:dev
```
This command starts a [nodemon](https://nodemon.io) process for your server restart when a code change happens.
#### Deploy application server
```
npm run start
```
This command starts the application server with `production.js` configurations (if `NODE_ENV` is set to `production`) 
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
