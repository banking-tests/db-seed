import { getConfig } from "@/config";
import { closeConnection, getConnection } from "@/database/connection";

export async function unseed() {
  const config = getConfig();
  const accountsClient = await getConnection(
    config.databases.accounts.uri,
    config.databases.accounts.database
  );
  const transactionsClient = await getConnection(
    config.databases.transactions.uri,
    config.databases.transactions.database
  );

  const accountsConnection = await accountsClient.connect();
  const transactionsConnection = await transactionsClient.connect();

  const accounts = accountsConnection
    .db(config.databases.accounts.database)
    .collection(config.databases.accounts.database);

  const transactions = transactionsConnection
    .db(config.databases.transactions.database)
    .collection(config.databases.transactions.database);

  await accounts.deleteMany({});
  await transactions.deleteMany({});

  await closeConnection(accountsConnection);
  await closeConnection(transactionsConnection);

  console.log("Unseed complete");
}
