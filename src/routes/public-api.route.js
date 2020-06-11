import {Router} from 'express';
import config from 'config';
import {validate} from 'express-validation';
import consts from '../consts';
import utils from '../utils';
import validations from './validations';
import userService from '../service/user.service';
import authService from '../service/auth.service';
import sensorService from '../service/sensor.service';

const routerPublic = Router();
const appConfig = config.get('app');

// region ENTRY POINT
routerPublic.get(consts.ENDPOINTS.ENTRY, (req, res) => {
	res.locals.title = 'IoT Sensors Data - Vibration charts';
	res.locals.version = appConfig.version;
	res.render('index');
});
// endregion

// region AUTHENTICATION
routerPublic.post(consts.ENDPOINTS.LOGIN,
	validate(validations.login, {}, {}),
	async (req, res) => {
		const response = await authService.login(
			req.body.email,
			req.body.password);
		res.json(response);
	}
);

routerPublic.post(consts.ENDPOINTS.SIGN_UP,
	validate(validations.signUp, {}, {}),
	async (req, res) => {
		const response = await authService.signUp(
			req.body.email,
			req.body.password);
		res.json(response);
	}
);

routerPublic.get(consts.ENDPOINTS.CONFIRM_EMAIL,
	validate(validations.confirmEmail, {}, {}),
	async (req, res) => {
		const response = await userService
			.confirmEmail(req.params.email, req.params.code);
		if (utils.prepareOK().status === response.status) {
			res.locals.baseUrl = appConfig.baseUrl;
			res.render('emailConfirmed');
		} else {
			res.json(response);
		}
	}
);

routerPublic.get(consts.ENDPOINTS.RESEND_CONFIRM_EMAIL,
	validate(validations.resendConfirmEmail, {}, {}),
	async (req, res) => {
		const response = await userService
			.resendConfirmationAccountEmail(req.params.email);
		res.json(response);
	}
);
// endregion

// region IOT DATA
routerPublic.get(consts.ENDPOINTS.VIBRATIONS_DATA,
	async (req, res) => {
		let response;
		if (!isNaN(req.query.last)) {
			response = await sensorService.getLastXVibrationsData(req.query.last);
		} else {
			response = await sensorService.getAllVibrationsData();
		}
		res.json(response);
	}
);

routerPublic.post(consts.ENDPOINTS.VIBRATIONS_DATA,
	validate(validations.vibrationData, {}, {}),
	async (req, res) => {
		const response = await sensorService.saveVibrationData(req.body);
		res.json(response);
	}
);
// endregion

export default routerPublic;
