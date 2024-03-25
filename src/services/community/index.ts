import { Config } from "@citizenwallet/sdk";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

export const readCommunityFile = (): Config | undefined => {
  if (!communityFileExists()) {
    return undefined;
  }

  // read community.json file
  const filePath = path.join(process.cwd(), "config/community.json");
  const fileContents = readFileSync(filePath, "utf8");
  const config = JSON.parse(fileContents) as Config;
  return config;
};

export const communityFileExists = (): boolean => {
  const filePath = path.join(process.cwd(), "config/community.json");
  return existsSync(filePath);
};

export const writeCommunityFile = (config: Config) => {
  const filePath = path.join(process.cwd(), "config/community.json");
  const fileContents = JSON.stringify(config, null, 2);
  return writeFileSync(filePath, fileContents);
};

export const writeCommunityHash = (hash: string) => {
  const filePath = path.join(process.cwd(), "config/hash");
  return writeFileSync(filePath, hash);
};

export const readCommunityHash = (): string | undefined => {
  const filePath = path.join(process.cwd(), "config/hash");
  if (!existsSync(filePath)) {
    return undefined;
  }

  return readFileSync(filePath, "utf8");
};
