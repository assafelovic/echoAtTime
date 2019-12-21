'use strict';

const { initServer } = require('./services/server');
const path = require('path');
const logger = require('./utils/logger');

const serverName = 'EchoAtTime Node Server';
initServer({
    httpPort: process.env.HTTP_PORT || 3000,
    controllersPath: path.join(__dirname, 'controllers'),
    serverName,
    timeToKillWorker: process.env.GRACEFUL_SHUTDOWN_TIMEOUT,
    logger: logger(serverName)
});
