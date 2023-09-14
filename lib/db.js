import { MongoClient } from "mongodb";

export async function connectToDatabae() {
  const client = await MongoClient.connect(
    "mongodb+srv://siripods:mongo1siri@cluster0.tfpkqip.mongodb.net/auth-demo?retryWrites=true&w=majority"
  );
  
  return client;
}
