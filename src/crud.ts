import { MongoClient, Collection, ObjectId } from "mongodb";

const host = "localhost";
const port = "27017";
const dbName = "node-mongodb-sample";
const collectionName = "test-collection";
const url = `mongodb://${host}:${port}`;

const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function crud() {
  let client;
  try {
    client = await MongoClient.connect(url, connectOption);
    console.log("Connected: CRUD");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Create
    const insertResult = await collection.insertOne({
      text: "CRUD: Create",
      time: new Date(),
    });

    await read(collection, insertResult.insertedId);

    // Update
    const updateResult = await collection.updateOne(
      {
        _id: insertResult.insertedId,
      },
      {
        $set: {
          text: "CRUD: Update",
          time: new Date(),
        },
      }
    );

    await read(collection, insertResult.insertedId);

    // Delete
    const deleteResult = await collection.deleteOne({
      _id: insertResult.insertedId,
    });

    await read(collection, insertResult.insertedId);
  } catch (err) {
    console.log(err);
  } finally {
    if (client) {
      client.close();
      console.log("Closed: CRUD");
    }
  }
}

//Read
async function read(collection: Collection, id: ObjectId) {
  const findResult = await collection.findOne({ _id: id });
  console.log(findResult);
}

crud();
