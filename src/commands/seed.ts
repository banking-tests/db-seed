import { getConfig } from "@/config";
import { closeConnection, getConnection } from "@/database/connection";
import { AccountType } from "@/enums/account-type.enum";
import { Category } from "@/enums/category.enum";
import {
  addDays,
  addSeconds,
  getDaysDiff,
  getToday,
  setTime,
  substractDays,
} from "@/utils/date.util";
import { generateRandomDigits } from "@/utils/generate-account-number";
import PromisePool from "@supercharge/promise-pool";
import { ObjectId } from "mongodb";
const faker = require("faker");

export async function seed() {
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

  const fakeAccounts = [...Array(config.faking.accounts).keys()].map((i) => ({
    _id: new ObjectId(),
    uuid: faker.datatype.uuid(),
    isDeleted: faker.datatype.boolean(),
    name: `Account ${faker.datatype.number()}`,
    number: generateRandomDigits(),
    currency: "MXN",
    balance: 1000,
    status: "active",
    type: faker.random.arrayElement(Object.values(AccountType)),
    holderUuid: faker.datatype.uuid(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));

  PromisePool.withConcurrency(10)
    .for(fakeAccounts)
    .process(async (accountData) => {
      let transactionCount = 0;
      const dailyTransactions = config.faking.transactionsPerDay;
      let dailyTransactionsCount = 0;
      let balance = accountData.balance;
      await accounts.insertOne(accountData);
      let daysAgo = config.faking.transactionsPerAccount / dailyTransactions;
      let operationDate = substractDays(getToday(), daysAgo);

      const fakeTransactions = [
        ...Array(config.faking.transactionsPerAccount).keys(),
      ].map(() => {
        let amount: number;
        const type = faker.random.arrayElement(["INFLOW", "OUTFLOW"]);

        if (type === "INFLOW") {
          amount = Number(faker.finance.amount(5, 100));
          balance += amount;
        } else {
          amount = Number(faker.finance.amount(1, balance / 5));
          balance -= amount;
        }

        if (transactionCount % dailyTransactions === 0) {
          operationDate = setTime(addDays(operationDate, 1), 0, 0, 0);
          dailyTransactionsCount = 0;
        }

        operationDate = addSeconds(operationDate, 1);
        dailyTransactionsCount++; // Incrementa el contador de transacciones por día
        transactionCount++;

        return {
          type,
          amount,
          balance,
          status: getDaysDiff(operationDate) > 3 ? "PROCESSED" : "PENDING",
          id: faker.datatype.uuid(),
          _id: new ObjectId(),
          uuid: faker.datatype.uuid(),
          account: [accountData.uuid],
          accounting_date: operationDate,
          category: faker.random.arrayElement(Object.values(Category)),
          collected_at: operationDate,
          currency: faker.random.arrayElement(["MXN"]),
          description: faker.company.companyName(),
          internal_identification: faker.random.alphaNumeric(8),
          merchant: {
            logo: faker.internet.url(),
            name: faker.company.companyName(),
            website: faker.internet.url(),
          },
          observations: null,
          reference: faker.finance.account(),
          subcategory: null,
          value_date: operationDate,
          createdAt: operationDate,
          updatedAt: operationDate,
          isDeleted: false,
          __v: 0,
        };
      });

      await transactions.insertMany(fakeTransactions);
      await accounts.updateOne(
        { uuid: accountData.uuid },
        { $set: { balance } }
      );
      console.log(
        `Account ${accountData.name} seeded with ${transactionCount} transactions, final balance: $${balance} MXN`
      );
    })
    .finally(async () => {
      await closeConnection(accountsConnection);
      await closeConnection(transactionsConnection);
    });
}
