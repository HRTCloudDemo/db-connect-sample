import { MongoClient } from 'mongodb'
import { createClient } from 'redis'
import { CloudantV1 } from '@ibm-cloud/cloudant'
import { IamAuthenticator } from 'ibm-cloud-sdk-core'

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

async function cloudant_demo() {

  console.log("\n************ CLOUDANT DB DEMO START *************");

  let apikey = process.env.CLOUDANT_APIKEY
  let url = process.env.CLOUDANT_URL

  const authenticator = new IamAuthenticator({
      apikey: apikey
  });

  const client = new CloudantV1({
      authenticator: authenticator
  });

  client.setServiceUrl(url);

  // 1. Create a Cloudant client with "EXAMPLES" service name ===================
  //const client = service.  newInstance({ serviceName: 'EXAMPLES' });

  // 2. Get server information ==================================================
  // call service without parameters:
  const { version } = (await client.getServerInformation()).result;
  console.log(`Server version ${version}`);

  // 3. Get database information for "animaldb" =================================
  const dbName = 'hrt-demo';

  // call service with embedded parameters:
  const dbInfo = await client.getDatabaseInformation({ db: dbName });
  const documentCount = dbInfo.result.doc_count;
  const dbNameResult = dbInfo.result.db_name;

  // 4. Show document count in database =========================================
  console.log(`Document count in "${dbNameResult}" database is ${documentCount}.`);

  // 5. Get zebra document out of the database by document id ===================
  const getDocParams = { db: dbName, docId: 'b3d7f53650b9b23faead84483b8b85cc' };

  // call service with predefined parameters:
  const documentAboutZebra = await client.getDocument(getDocParams);

  // result object is defined as a Document here:
  const { result } = documentAboutZebra;
  console.log(`Document retrieved from database:\n${JSON.stringify(result, null, 2)}`);
  console.log('************ CLOUDANT DB DEMO END *************');
}

async function demo() {
  await mongodb_demo()
  await redis_demo()
  await cloudant_demo()
}

await demo()
process.exit()