'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const taskManager = require('./echoTaskManager');
const _ = require('lodash');

const initServer = ({
        httpPort = 80,
        middlewares = [],
        controllersPath,
        serverName = 'Generic Node Server',
        timeToKillWorker = 1000 * 120,
        logger = console,
        errorMiddleware
    } = {}) => {
    const expressConfiguration = () => new Promise((resolve) => {
        const app = express();

        if (middlewares) {
            middlewares.forEach((middleware) => {
                app.use(middleware);
            });
        }

        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());

        // error handler
        app.use((err, req, res, next) => {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });

        resolve(app);
    });

    const serverLaunch = app => new Promise((resolve) => {
        const http = require('http');
        const server = http.createServer(app);

        const onStop = () => {
            logger.info(
                `-------- ${serverName} - start responding status not ok ------`,
            );

            logger.info(`-------- Stopping ${serverName} ------`);
            logger.info(`stopping pid: ${process.pid} ...`);

            setTimeout(
                () => {
                    logger.info(`${process.pid} worker † ssl RIP`);
                    process.exit(0);
                },
                timeToKillWorker
            );
        };

        // To support NON docker deployment
        process.on('SIGTERM', onStop);
        process.on('SIGINT', onStop);

        if (controllersPath) {
            _.each(fs.readdirSync(controllersPath), (controller) => {
                require(path.join(controllersPath, controller))(app); // eslint-disable-line
            });
        }

        if (errorMiddleware) {
            app.use(errorMiddleware);
        } else {
            app.use((err, req, res, next) => {
                if (res.headersSent) {
                    return next(err);
                }

                logger.error(
                    `Url: ${req.url}\nMethod: ${req.method}\nError: ${err.message}\nStack: ${err.stack}`,
                );
                res.status(500).send(
                    'Unexpected Error, go to the log for more details...',
                );

                next();
            });
        }
        taskManager.init();

        server.listen(httpPort);

        logger.info(`-------- Starting ${serverName} ------`);
        logger.info(`Listening on port ${httpPort}`);
        logger.info(`pid: ${process.pid}`);

        resolve(app);
    });

    process.on('exit', (code) => {
        if (code > 0) {
            logger.error('Child is about to exit with code:', code);
        } else {
            logger.info('Child is about to exit with code:', code);
        }
    });

    process.on('uncaughtException', (err) => {
        logger.error(
            `Child had an Uncaught exception\nError: ${err.message}\nStack:${err.stack}`,
        );
    });

    return Promise.resolve()
        .then(expressConfiguration)
        .then(serverLaunch)
        .catch((err) => {
            logger.error(`Error: ${err.message}\nStack:${err.stack}`);
        });
};

module.exports = {
    initServer,
};
