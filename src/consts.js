import path from 'path';

export default {
	ENDPOINTS: {
		// Public
		ENTRY: '/',
		PROBE: '/probe',
		// Public - Authentication
		LOGIN: '/login',
		SIGN_UP: '/signup',
		CONFIRM_EMAIL: '/confirm/:email/:code',
		RESEND_CONFIRM_EMAIL: '/resend-confirm/:email',
		// Public - IOT DATA
		VIBRATIONS_DATA: '/vibrations',
		// Private
		CHECK_TOKEN: '/check-token',
	},
	urls: {},
	directory: {
		template: path.join(__dirname, 'template'),
	},
	regEx: {
		email: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
		password: '[a-zA-Z0-9]{3,30}',
	},
};
