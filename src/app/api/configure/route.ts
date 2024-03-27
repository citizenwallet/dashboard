// app/api/configure.ts
import {
  communityFileExists,
  writeCommunityFile,
  writeCommunityHash,
} from "@/services/community";
import { pinJson } from "@/services/ipfs";

export interface ConfigureResponse {
  hash: string;
}

export async function POST(req: Request) {
  try {
    const config = await req.json(); // assuming the config is sent in the request body

    if (communityFileExists()) {
      return Response.json({ message: "File already exists" }, { status: 400 });
    }

    const hash = await pinJson(config); // pin the config to IPFS

    writeCommunityHash(hash);
    writeCommunityFile(config);

    return Response.json({ hash } as ConfigureResponse, { status: 200 });
    // res.status(200).json({ hash } as ConfigureResponse);
  } catch (error: any) {
    console.log("Error writing file", error);
    return Response.json(
      { message: "Error writing file", error: error.message },
      { status: 500 }
    );
  }
}
