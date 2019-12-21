const redisClient = require('./redis');
const collectionName = 'messages';

const add = (message) => {
    return redisClient.zaddAsync(collectionName, message.time, JSON.stringify(message));
};

const remove = async (message) => {
    const result = await redisClient.zrem(collectionName, JSON.stringify(message));
    return { msg: message, ok: result };
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