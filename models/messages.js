const redisClient = require('../services/redis');
const collectionName = 'messages';

const add = (messageObj) => {
    return redisClient.zaddAsync(collectionName, messageObj.time, JSON.stringify(messageObj));
};

const remove = (messageObj) => {
    return redisClient.zremAsync(collectionName, JSON.stringify(messageObj));
};

const getNext = () => {
    // Get all keys for current second
    return redisClient.zrangebyscoreAsync(collectionName, 0, Date.now() + 1000);
};

module.exports = {
    add,
    remove,
    getNext
};