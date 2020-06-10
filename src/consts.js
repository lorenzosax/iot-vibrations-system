import path from 'path';

export default {
	ENDPOINTS: {
		// Public
		ENTRY: '/',
		LOGIN: '/login',
		SIGN_UP: '/signup',
		CONFIRM_EMAIL: '/confirm/:email/:code',
		RESEND_CONFIRM_EMAIL: '/resend-confirm/:email',
		// Private
		CHECK_TOKEN: '/check-token',
		ACELISTING: '/acelisting',
	},
	urls: {
		acelisting: 'https://acelisting.in/',
	},
	directory: {
		template: path.join(__dirname, 'template'),
	},
	regEx: {
		email: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
		password: '[a-zA-Z0-9]{3,30}',
	},
};