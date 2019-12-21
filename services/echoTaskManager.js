'use strict';
const logger = require('../utils/logger')('Task Manager');
const messagesModel = require('../models/messages');

const echoToConsole = (messageObj) => {
    const date = new Date(parseInt(messageObj.time, 10));
    logger.info(`Message: '${messageObj.message}', Echoed at: ${date}`);
};

const echoMessages = async () => {
    const nextMessageObj = await messagesModel.getNext();
    if (!nextMessageObj) return;

    const currentTime = Date.now();
    const time = nextMessageObj.time;
    // In case the server was down when a message should have been printed, it should print it out when going back online.
    if (time <= currentTime) {
        const isRemoved = await messagesModel.remove(nextMessageObj);
        // This will validate locking between clusters. Only a successful removal will allow echoing.
        if (isRemoved) {
            echoToConsole(nextMessageObj);
        }
    }
};

const init = () => {
    logger.info(`Started Echo Task Manager`);
    setInterval(echoMessages, 1000);
};

module.exports = {
    init
};