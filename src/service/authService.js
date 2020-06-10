import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcrypt';
import utils from '../utils';
import userService from '../service/userService';
/* import mailService from '../service/mailService'; */

const auth = config.get('authentication');

const signJWT = async (userExists) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{email: userExists.email},
			auth.secretKey,
			auth.optionsSign,
			(err, token) => {
				if (!err) {
					resolve(token);
				} else {
					reject(err);
				}
			});
	});
};

const login = async (email, password) => {
	let response;
	let userExists = await userService
		.checkCredentials(email, password).catch(() => null);
	if (userExists) {
		const token = await signJWT(userExists);
		response = utils.prepareSuccessLogin({token: token});
	} else {
		response = utils.prepareInvalidLogin();
	}
	return response;
};

const signUp = async (email, password) => {
	let response;
	let emailAlreadyExists = await userService.checkIfEmailAlreadyExists(email);
	if (!emailAlreadyExists) {
		const newUser = {
			email: email,
			password: await bcrypt.hashSync(password, auth.salts),
			verifiedCode: utils.randomString(),
			verified: false,
		};
		const savedUserResponse = await userService.createUser(newUser);
		if (utils.prepareKO().status !== savedUserResponse.status) {
			// TODO temporarily commented
			/* mailService.sendMailActivateAccount(
				savedUserResponse.email, savedUserResponse.verifiedCode); */
			response = utils.prepareSuccessRegistration();
		} else {
			response = utils.prepareErrorOnRegistration(savedUserResponse);
		}
	} else {
		response = utils.prepareErrorEmailAlreadyExists();
	}
	return response;
};

export default {
	login,
	signUp,
};
