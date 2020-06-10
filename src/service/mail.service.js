import nodemailer from 'nodemailer';
import fs from 'fs';
import _ from 'lodash';
import config from 'config';
import consts from '../consts';

const dirTemplate = consts.directory.template;
const gmailAuth = config.get('authentication.gmail');
const baseUrl = config.get('app.baseUrl');
const mailOptions = {
	from: 'Streams Support <' + gmailAuth.user + '>',
};
const generateSMTPSforGmail = () => {
	return 'smtps://' +
		gmailAuth.user + ':' + gmailAuth.password +
		'@smtp.gmail.com';
};
const transporter = nodemailer.createTransport(generateSMTPSforGmail());

const sendMail = async (configuration) => {
	return transporter.sendMail(configuration).then((info, err) => {
		if (err) {
			console.log('Error on sending email\n', err);
		} else {
			console.log('Email sent successfully to ', info.envelope.to.toString());
		}
	}).catch((err) => console.log(err));
};

const sendMailActivateAccount = async (email, code) => {
	const subject = 'Welcome to Streams! Confirm Your Email';
	let aHref = baseUrl + consts.ENDPOINTS.CONFIRM_EMAIL;
	aHref = aHref.replace(':email', email).replace(':code', code);
	fs.readFile(dirTemplate + '/activateAccountMail.html', 'utf8',
		(err, file) => {
			let html = file.replace('${linkActivateAccount}', aHref);
			html = html.replace('${email}', email);
			html = html.replace(new RegExp('\\${baseUrl}', 'g'), baseUrl);
			const configuration = _.merge({
				to: email,
				subject: subject,
				html: html,
			}, mailOptions);
			return sendMail(configuration);
		});
};

export default {
	sendMail,
	sendMailActivateAccount,
};
