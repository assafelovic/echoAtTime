'use strict';
const logger = require('../utils/logger')('Task Manager');
const messagesModel = require('../models/messages');
const _ = require('lodash');

const echoToConsole = (messageObj) => {
    const date = new Date(parseInt(messageObj.time, 10));
    logger.info(`Message: '${messageObj.message}', Echoed at: ${date}`);
};

const echoMessages = async () => {
    const nextMessages = await messagesModel.getNext();
    const currentTime = Date.now();

    _.forEach(nextMessages, async () => {
        const nextMsg = nextMessages.pop();
        const messageObj = nextMsg ? JSON.parse(nextMsg) : null;
        if (!messageObj) return;

        if (messageObj.time <= currentTime) {
            const isRemoved = await messagesModel.remove(messageObj);
            // Validate locking between clusters. Only a successful removal will allow echoing.
            if (isRemoved) echoToConsole(messageObj);
        }
    });
};

const init = () => {
    logger.info(`Started Echo Task Manager`);
    setInterval(echoMessages, 1000);
};

module.exports = {
    init
};