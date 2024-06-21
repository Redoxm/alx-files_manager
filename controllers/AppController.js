import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {

  getStatus(req, res) {
      if (dbClient.isAlive() && redisClient.isAlive()) {
        return res.status(200).send({redis: true, db: true});
      }

      if (!dbClient.isAlive() && redisClient.isAlive()) {
        return res.status(400).send({redis: false, db: false});
      }
  }

  async getStats(req, res) {
      if (dbClient) {
        return res.status(200).send({"users": await dbClient.nbUsers(), "files": await dbClient.nbFiles()});
      } else {
        return res.status(400).send({"error": "Not found"});
      }
  }
}

const appController = new AppController();
export default appController;
