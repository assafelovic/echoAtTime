'use strict';
const logger = require('../utils/logger')('Task Manager');
const messagesModel = require('../models/messages');
const bluebird = require('bluebird');
const _ = require('lodash');

let taskInterval;

const echoToConsole = (messageObj) => {
    const date = new Date(parseInt(messageObj.time, 10));
    logger.info(`Message: '${messageObj.message}', Echoed at: ${date}`);
};

const echoMessages = async () => {
    const nextMessages = await messagesModel.getNext();
    const currentTime = Date.now();

    bluebird.each(nextMessages, async (nextMsg) => {
        const messageObj = JSON.parse(nextMsg);

        if (messageObj.time <= currentTime) {
            const isRemoved = await messagesModel.remove(messageObj);
            // Validate locking between clusters. Only a successful removal will allow echoing.
            if (isRemoved) echoToConsole(messageObj);
        }
    });
};

const init = () => {
    logger.info(`Started Echo Task Manager`);
    taskInterval = setInterval(echoMessages, 1000);
};

const close = () => {
    logger.info(`Stopping Echo Task Interval`);
    clearInterval(taskInterval);
};

module.exports = {
    init,
    close
};