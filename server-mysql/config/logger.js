const winston = require('winston');
const moment = require('moment-timezone');

const customColors = {
    info: 'blue',
    error: 'red',
    warn: 'yellow',
    debug: 'green',
};

winston.addColors(customColors);

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.printf(({ level, message }) => {
            const time = moment().tz('Asia/Kolkata').format('hh:mm:ss A');
            return `[${time}] ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ]
});

// if (process.env.NODE_ENV !== 'production') {
logger.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message }) => {
            const time = moment().tz('Asia/Kolkata').format('hh:mm:ss A');
            return `[${time}] ${level}: ${message}`;
        }),
    )
}));
// }

module.exports = logger;
