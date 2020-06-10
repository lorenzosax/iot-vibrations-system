import {Router} from 'express';
import jwt from 'express-jwt';
import config from 'config';
import consts from '../consts';
import utils from '../utils';

const routerPrivate = Router();
const authConfig = config.get('authentication');

routerPrivate.use(jwt({secret: authConfig.secretKey}));

routerPrivate.get(consts.ENDPOINTS.CHECK_TOKEN, (req, res) => {
	// intentionally left blank
	// here token is valid
	console.log('Header token:', req.get('Authorization'));
	res.json(utils.prepareOK());
});

export default routerPrivate;
