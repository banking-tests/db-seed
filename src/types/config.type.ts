import { Database } from "@/types/database.type";

export type Config = {
  faking: {
    accounts: number;
    transactionsPerAccount: number;
    transactionsPerDay: number;
  };
  databases: {
    [key: string]: Database;
  };
  timezone: string;
};
