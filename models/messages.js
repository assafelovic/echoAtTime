const redisClient = require('../services/redis');
const collectionName = 'messages';

const add = (messageObj) => {
    return redisClient.zaddAsync(collectionName, messageObj.time, JSON.stringify(messageObj));
};

const remove = (messageObj) => {
    return redisClient.zrem(collectionName, JSON.stringify(messageObj));
};

const getNext = async () => {
    let messages = await redisClient.zrangeAsync(collectionName, 0, 0);
    const nextMessage = messages.pop();
    return nextMessage ? JSON.parse(nextMessage) : null;
};

module.exports = {
    add,
    remove,
    getNext
};