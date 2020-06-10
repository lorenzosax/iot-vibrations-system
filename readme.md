## IoT data collector
A simple webapp to collect data sent from IoT nodes.

#### Getting Started

<span style="color:gray"># Clone the project</span>
```
git clone https://github.com/lorenzosax/mr_2020
```
`cd mr_2020`

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
### Linting
This scaffold uses [ESlint](https://eslint.org). 
It extends [google's eslint config](https://github.com/google/eslint-config-google). Feel
free to use your own rules or extend any other desirable rule(e.g [airbnb](https://www.npmjs.com/package/eslint-config-airbnb))
You can run linting in watch mode with:
```
npm run lint
```
Note: `npm run start:dev` starts the server with linting in watch mode, you can remove it if need be.
### Testing
This scaffold uses [Mocha](https://mochajs.org). It also uses [Supertest](https://github.com/visionmedia/supertest) to demonstrate a simple routing test suite.
Feel free to remove the supertest if you don't wish to use it.
You can start the test runner in watch mode with:
```
npm test
```
##### Todo
* Environment Variables
* Deployment
