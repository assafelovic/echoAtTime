'use strict';

const logger = require('../../utils/logger')('Redis Service');
const bluebird = require('bluebird');
let redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
});
bluebird.promisifyAll(client);

client.on('connect', () => {
    logger.info(`redis connected on port ${REDIS_PORT}`)
});

client.on('error', (error) => {
    logger.error(error);
    process.exit(0);
});

module.exports = client;
