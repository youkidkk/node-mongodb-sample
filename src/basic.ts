import { MongoClient, Collection, ObjectId } from "mongodb";

const host = "localhost";
const port = "27017";
const dbName = "node-mongodb-sample";
const collectionName = "test-collection";
const url = `mongodb://${host}:${port}`;

console.log(url);

const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Callback での実装
async function byCallback() {
  MongoClient.connect(url, connectOption, (err, client) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Connected: Basic");
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    collection.insertOne({ text: "Basic", time: new Date() }, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(result.result);
      client.close();
      console.log("Closed: Basic");
    });
  });
}

// Promise での実装
async function byPromise() {
  let client: MongoClient;
  MongoClient.connect(url, connectOption)
    .then(client_ => {
      console.log("Connected: Promise");
      client = client_;
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      const result = collection.insertOne({
        text: "Promise",
        time: new Date(),
      });
      return result;
    })
    .then(result => {
      console.log(result.result);
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      if (client) {
        client.close();
        console.log("Closed: Promise");
      }
    });
}

async function byAsyncAwait() {
  let client;
  try {
    client = await MongoClient.connect(url, connectOption);
    console.log("Connected: Async-Await");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne({
      text: "Async-Await",
      time: new Date(),
    });
    console.log(result.result);
  } catch (err) {
    console.log(err);
  } finally {
    if (client) {
      client.close();
      console.log("Closed: Async-Await");
    }
  }
}

async function main() {
  await byCallback();
  await byPromise();
  await byAsyncAwait();
}

main();
