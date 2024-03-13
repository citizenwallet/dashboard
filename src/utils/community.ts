import { Config } from "@citizenwallet/sdk";
import { readFileSync } from "fs";
import path from "path";

export const readCommunityFile = () => {
  // read community.json file
  const filePath = path.join(process.cwd(), "community.json");
  const fileContents = readFileSync(filePath, "utf8");
  const config = JSON.parse(fileContents) as Config;
  return config;
};
