'use strict';

const { initServer } = require('./services/server');
const path = require('path');
const logger = require('./utils/logger');

initServer({
    httpPort: process.env.HTTP_PORT || 3000,
    controllersPath: path.join(__dirname, 'controllers'),
    serverName: 'Echo Task Manager',
    timeToKillWorker: process.env.GRACEFUL_SHUTDOWN_TIMEOUT,
    logger: logger('Echo Task Manager')
});
