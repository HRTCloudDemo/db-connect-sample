import { MongoClient } from 'mongodb'
import { createClient } from 'redis'

async function mongodb_demo() {
  console.log('************ MONGO DB DEMO START *************');
  let mongo_url=process.env.MONGODB_URL

  // Database Name
  const dbName = 'hrtdemo';

  // Connection URL
  const client = new MongoClient(mongo_url);

  // Use connect method to connect to the server
  console.log('Trying to connect');
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  console.log('Client created');
  const collection = db.collection('documents');

  // the following code examples can be pasted here...
  const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
  console.log('Inserted documents =>', insertResult);

  console.log('************ MONGO DB DEMO END *************');
  return
}

async function redis_demo() {

  console.log("\n************ REDIS DB DEMO START *************");
  let redis_url = process.env.REDIS_URL
  if (redis_url === undefined) {  
    console.error("Please set the REDIS_URL environment variable");
    process.exit(1);
  }
  let parsedUrl = new URL(redis_url)

  let redis_ca_base64 = process.env.REDIS_CA_BASE64
  if (redis_ca_base64 === undefined) {  
    console.error("Please set the REDIS_CA_BASE64 environment variable");
    process.exit(1);
  }

  let redis_ca = Buffer.from(redis_ca_base64, 'base64').toString('utf-8')
  let redisClient = createClient({
      url: redis_url, 
      socket: {
        tls: true,
        rejectUnauthorized: false,
        ca: redis_ca,
        host: parsedUrl.hostname,
        port: parsedUrl.port,
      }
    }
  )

  console.log('Trying to connect');
  await redisClient.connect();
  console.log('Connected successfully to server');

  await redisClient.set('key', 'hrtdemo');
  const value = await redisClient.get('key'); 
  console.log('Retrieved value from DB: ' + value);

  console.log('************ REDIS DB DEMO END *************');
  return
}

async function demo() {
  await mongodb_demo()
  await redis_demo()
}

await demo()
process.exit()