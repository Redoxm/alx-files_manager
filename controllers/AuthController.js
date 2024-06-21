import dbClient from "../utils/db";
import redisClient from "../utils/redis";
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

class AuthController {
  async getConnect(req, res) {
    const authHead = req.headers.authorization;
    const getAuth = authHead.split(' ')[1];
    const userDetails = Buffer.from(getAuth, 'base64');
    const decoder = userDetails.toString('utf-8')
    const email= decoder.split(':')[0];
    const password = decoder.split(':')[1];
    const hashPass = sha1(password);
    const usr = await dbClient.db.collection('users').findOne({ email });
    if (!usr || usr.password !== hashPass) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const key = uuidv4();
    const token = `auth_${key}`;
    await redisClient.set(token, usr._id.toString(), 86400)
    return res.status(200).send({ token: key });

  }

  async getDisconnect(req, res) {
    const header = req.headers['x-token'];
    const getId = await redisClient.get(`auth_${header}`);
    const usr = await dbClient.db.collection('users').findOne({ _id: new ObjectId(getId) });
    if (!usr) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    await redisClient.del(`auth_${header}`);
    return res.status(204).send();
  }
}

const authController = new AuthController();
export default authController;
