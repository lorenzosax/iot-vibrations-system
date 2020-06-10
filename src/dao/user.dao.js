import UserModel from '../model/user.model';
import utils from '../utils';

const find = async (user) => {
	return UserModel.find(user)
		.then((res) => {
			return res;
		}).catch((err) => err);
};

const findByEmail = async (email) => {
	let user = {email: email};
	return find(user).then((userFound) => {
		if (userFound && userFound.length) {
			return userFound[0];
		}
	}).catch((err) => null);
};

const save = async (user) => {
	const us = new UserModel(user);
	return us.save()
		.then(() => user)
		.catch((e) => utils.prepareValidatorsResponse(e.errors));
};

const updateOne = async (user, valuesToUpdate) => {
	return UserModel.updateOne(user, valuesToUpdate)
		.then(() => {
			return findByEmail(user.email);
		})
		.catch((err) => null);
};

export default {
	find,
	findByEmail,
	save,
	updateOne,
};
