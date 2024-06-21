import { MongoClient } from 'mongodb';

const host = process.env.DB_HOST || 'localhost';
const data = process.env.DB_DATABASE || 'files_manager';
const port = process.env.DB_PORT || '27017';
const conn = `mongodb://${host}:${port}`;
class DBClient {
    constructor() {
        this.client = new MongoClient(conn, { useUnifiedTopology: true, useNewUrlParser: true });
        this.client.connect().then(() => {
            this.db = this.client.db(data);
        }).catch((err) => {
            console.log(`An error occured ${err}`);
        });

    }

    isAlive() {
        if (this.client.isConnected()) {
            return true;
        }
        return false;
    }

    async nbUsers() {
        const cuntUSr = await this.db.collection('users').countDocuments();
        return cuntUSr;
    }

    async nbFiles() {
        const cuntFiles = await this.db.collection('files').countDocuments();
        return cuntFiles;
    }
}

const dbClient = new DBClient();
export default dbClient;
