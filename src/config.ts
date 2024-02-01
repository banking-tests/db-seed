import { Config } from "@/types/config.type";

export function getConfig(): Config {
  return {
    databases: {
      accounts: {
        uri: process.env.DB_ACCOUNTS_URI!,
        database: process.env.DB_ACCOUNTS_DATABASE!,
      },
      transactions: {
        uri: process.env.DB_TRANSACTIONS_URI!,
        database: process.env.DB_TRANSACTIONS_DATABASE!,
      },
    },
    faking: {
      accounts: parseInt(process.env.FAKE_ACCOUNTS!, 10) ?? 10,
      transactionsPerAccount:
        parseInt(process.env.FAKE_TRANSACTIONS_PER_ACCOUNT!, 10) ?? 100,
      transactionsPerDay:
        parseInt(process.env.FAKE_TRANSACTIONS_PER_DAY!, 10) ?? 5,
    },
    timezone: String(process.env.TZ || "America/Mexico_City"),
  };
}
