import { seed } from "@/commands/seed";
import { unseed } from "@/commands/unseed";
import "dotenv/config";

import { Command } from "commander";
const program = new Command();

program.version("0.0.1");

program.command("seed").description("Populate the database").action(seed);
program.command("unseed").description("Clear the database").action(unseed);

program.parse(process.argv);
