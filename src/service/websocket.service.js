import socketIO from 'socket.io';

let io;

const start = async (server) => {
	if (!io) {
		io = socketIO(server);
		io.on('connection', (client) => {
			console.log('New client connected');
			client.on('disconnect', () => {
				console.log('Disconnect!');
			});
		});
	}
};

const emit = (event, data) => {
	io ? io.emit(event, data) : null;
};

export default {
	start,
	emit,
};
