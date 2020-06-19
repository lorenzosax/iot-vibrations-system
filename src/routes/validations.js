import {Joi} from 'express-validation';
import consts from '../consts';

const login = {
	body: Joi.object({
		email: Joi.string().required(),
		password: Joi.string().required(),
	}),
};

const signUp = {
	body: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().regex(new RegExp(consts.regEx.password)).required(),
	}),
};

const confirmEmail = {
	params: Joi.object({
		email: Joi.string().email().required(),
		code: Joi.string().required(),
	}),
};

const resendConfirmEmail = {
	params: Joi.object({
		email: Joi.string().email().required(),
	}),
};

const vibrationData = {
	body: Joi.object({
		location: Joi.string(),
		axes: Joi.array().length(3).required(),
	}),
};

export default {
	login,
	signUp,
	confirmEmail,
	resendConfirmEmail,
	vibrationData,
};
