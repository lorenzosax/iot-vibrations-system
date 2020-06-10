import bcrypt from 'bcrypt';
import utils from '../utils';
import userDao from '../dao/userDao';
import mailService from '../service/mailService';

const createUser = (user) => {
	return userDao.save(user);
};

const checkIfEmailAlreadyExists = async (email) => {
	return userDao.findByEmail(email).then((user) => {
		return !!user;
	});
};

const checkCredentials = async (email, password) => {
	let user = await userDao.findByEmail(email);
	return new Promise((resolve, reject) => {
		if (user
			&& password
			&& bcrypt.compareSync(password, user.password)
			&& user.verified) {
			resolve(user);
		} else {
			reject();
		}
	});
};

const confirmEmail = async (email, code) => {
	let response;
	let user = await userDao.findByEmail(email);
	if (user && !user.verified && user.verifiedCode === code) {
		const valuesToUpdate = {verified: true};
		let userUpdated = await userDao.updateOne(user, valuesToUpdate);
		if (userUpdated) {
			response = utils.prepareSuccessUserVerified();
		} else {
			response = utils.prepareErrorTryLaterAgain();
		}
	} else {
		response = utils.prepareGenericError();
	}
	return response;
};

const resendConfirmationAccountEmail = async (email) => {
	let response;
	let user = await userDao.findByEmail(email);
	if (user && !user.verified) {
		const verifiedCode = utils.randomString();
		const valuesToUpdate = {verifiedCode: verifiedCode};
		let userUpdated = await userDao.updateOne(user, valuesToUpdate);
		if (userUpdated) {
			mailService.sendMailActivateAccount(
				userUpdated.email, userUpdated.verifiedCode);
			response = utils.prepareSuccessSendEmail();
		} else {
			response = utils.prepareErrorTryLaterAgain();
		}
	} else {
		response = utils.prepareGenericError();
	}
	return response;
};

export default {
	createUser,
	checkIfEmailAlreadyExists,
	checkCredentials,
	confirmEmail,
	resendConfirmationAccountEmail,
};
