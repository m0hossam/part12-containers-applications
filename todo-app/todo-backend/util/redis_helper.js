const redis = require('../redis');

const key = 'added-todos'

const init = () => {
    redis.setAsync(key, 0)
}

init()

const getAsync = async () => {
    const val = await redis.getAsync(key)
    if (val === null) { // e.g. key deleted
        await redis.setAsync(key, 0)
        return 0
    }
    return Number(val)
}

const incAsync = async () => {
    const val = await getAsync()
    await redis.setAsync(key, val + 1)
}

module.exports = {
    key,
    getAsync,
    incAsync
}
