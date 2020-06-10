import _ from 'lodash';
import randomstring from 'randomstring';
import config from 'config';

const randomStringOptions = config.get('randomStringOptions');

const cleanStr = (string, separator) => {
	return string.trim()
		.replace(/\n/g, ' ')
		.replace(/ +(?= )/g, separator ? separator : ' -');
};

const randomString = () => {
	return randomstring.generate(randomStringOptions);
};

const prepareValidatorsResponse = (errors) => {
	let res = prepareKO();
	res.errors = {};
	_.forIn(errors, (value, key) => {
		res.errors[key] = _.pick(value.properties, ['type']);
	});
	return res;
};

const prepareKO = () => {
	return {status: 'KO'};
};

const prepareOK = () => {
	return {status: 'OK'};
};

const prepareSuccessLogin = (obj) => {
	return _.merge(prepareOK(), obj);
};

const prepareInvalidLogin = (obj) => {
	return _.merge(prepareKO(),
		{message: 'Invalid login (email and/or password)'},
		obj);
};

const prepareSuccessRegistration = (obj) => {
	return _.merge(prepareOK(),
		{message: 'Registered Successfully! Confirm your email to sign in'},
		obj);
};

const prepareErrorOnRegistration = (obj) => {
	return _.merge(prepareKO(),
		{message: 'Error on registration, please try again!'},
		obj);
};

const prepareErrorEmailAlreadyExists = (obj) => {
	return _.merge(prepareKO(),
		{message: 'Email already exists!'},
		obj);
};

const prepareSuccessUserVerified = (obj) => {
	return _.merge(prepareOK(),
		{message: 'User successfully verified!'},
		obj);
};

const prepareSuccessSendEmail = (obj) => {
	return _.merge(prepareOK(),
		{message: 'Email Sent successfully!'},
		obj);
};

const prepareErrorTryLaterAgain = (obj) => {
	return _.merge(prepareKO(),
		{message: 'Error, try later again...'},
		obj);
};

const prepareGenericError = (obj) => {
	return _.merge(prepareKO(),
		{message: 'Generic Error'},
		obj);
};

const prepareMissingParameters = (next) => {
	const err = new Error('Missing parameters!');
	err.status = 400;
	next(err);
};

const prepareSuccessSentSensorData = (obj) => {
	return _.merge(prepareOK(),
		{message: 'Sensor data sent correctly!'},
		obj);
};

const prepareErrorSendingSensorData = (obj) => {
	return _.merge(prepareKO(),
		{message: 'Error in sending sensor data!'},
		obj);
};

export default {
	cleanStr,
	randomString,
	prepareValidatorsResponse,
	prepareSuccessLogin,
	prepareInvalidLogin,
	prepareSuccessRegistration,
	prepareErrorOnRegistration,
	prepareErrorEmailAlreadyExists,
	prepareMissingParameters,
	prepareSuccessUserVerified,
	prepareErrorTryLaterAgain,
	prepareSuccessSendEmail,
	prepareGenericError,
	prepareSuccessSentSensorData,
	prepareErrorSendingSensorData,
	prepareOK,
	prepareKO,
};
