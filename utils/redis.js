import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
    constructor() {
        this.client = redis.createClient();
        this.getClient = promisify(this.client.get).bind(this.client);
        this.client.on('error', (error) => {
            console.log(`Redis client not connected to the server: ${error.message}`);
        });
    }

    isAlive() {
        if (this.client.connected) {
            return true;
        }
        return false;
    }

    async get(key) {
        const val = await this.getClient(key)
        return val;
    }

    async set(key, value, duration) {
        const setKe = await promisify(this.client.set).bind(this.client);
        await setKe(key, value);
        await this.client.expire(key, duration);
    }

    async del(key) {
        const rmkey = await this.client.del(key);
        return rmkey;
    }
}

const redisClient = new RedisClient();
export default redisClient;
