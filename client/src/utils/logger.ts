import { format, createLogger, transports } from 'winston';

const myCustomLevels = {
    levels: {
        critical: 0,
        error: 1,
        warn: 2,
        info: 3,
        apierror: 4,
        apiwarn: 5,
        apiinfo: 6,
        verbose: 7,
        debug: 8,
        silly: 9,
    },
    colors: {
        critical: 'redBG',
        error: 'red',
        apierror: 'italic red',
        warn: 'yellow',
        apiwarn: 'italic yellow',
        info: 'cyan',
        apiinfo: 'italic cyan',
        verbose: 'blue',
        debug: 'green',
        silly: 'magenta',
    },
};

const alignColorsAndTime = format.combine(
    format.colorize({
        all: true,
        colors: myCustomLevels.colors,
    }),
    format.timestamp({
        format: 'YY-MM-DD HH:mm:ss',
    }),
    format.printf(
        (info) => `${info.timestamp}  ${info.level} : ${info.message}`
    )
);

const alignTime = format.combine(
    format.timestamp({
        format: 'YY-MM-DD HH:mm:ss',
    }),
    format.printf(
        (info) => `${info.timestamp}  ${info.level} : ${info.message}`
    )
);

const logger = createLogger({
    levels: myCustomLevels.levels,
    level: 'silly',
    transports: [
        new transports.Console({
            format: format.combine(alignColorsAndTime),
        }),
    ],
});

//
// If we're in production then log to the file
//
if (process.env.NODE_ENV === 'production') {
    logger.add(
        new transports.File({
            level: 'silly',
            filename: 'logs/mbCounter.log',
            maxsize: 5000000, // 5 mb
            maxFiles: 100,
            format: format.combine(alignTime),
        })
    );
}

export default logger;
