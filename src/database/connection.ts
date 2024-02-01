import { MongoClient } from "mongodb";

export function getConnection(uri: string, dbName: string) {
  const connection = new MongoClient(uri);
  return connection.connect();
}

export function closeConnection(connection: MongoClient) {
  return connection.close();
}
