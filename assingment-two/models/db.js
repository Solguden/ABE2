var mongoose = require('mongoose');
require('./user');
require('./hotel');
require('./room');
const url = 'mongodb://localhost:27017/assignment-one'

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close( () => {
            console.log(`Mongoose disconnected through
            ${msg}`);
        callback();
    });
};

mongoose.connection.on('connected', () => {
    // console.log(`Mongoose connected to ${dbURI}`);
});
mongoose.connection.on('error', err => {
    console.log('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// For nodemon restarts
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});

async function main() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    } catch (error) {
        console.log(error);
    }       
}

main();

