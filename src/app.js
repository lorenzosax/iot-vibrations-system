import express from 'express';
import {ValidationError} from 'express-validation';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
import path from 'path';
import config from 'config';
import {routerPrivate, routerPublic} from './routes';
import dbService from './service/db.service';
import wsService from './service/websocket.service';

const app = express();

app.disable('x-powered-by');

app.set('port', config.get('app.port'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routerPublic);
app.use('/api', routerPrivate);
app.use('/static', express.static('public'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error();
	err.status = 404;
	err.message = 'Not Found';
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	if (err instanceof ValidationError) {
		return res.status(err.statusCode).json(err);
	}
	let errStatus = err.status || 500;
	req.app.get('env') === 'development' ? console.log(err) : null;
	res.status(errStatus);
	res.json(err);
});

// region Create Server
const server = http.createServer(app);
const port = app.get('port');
dbService.run().then( async () => {
	await wsService.start(server);
	server.listen(port, () => {
		console.log(`Application listening on ${config.get('app.baseUrl')}`);
		console.log(`Environment => ${config.util.getEnv('NODE_ENV')}`);
	});
});
// endregion

export default app;
