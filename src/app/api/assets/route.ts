import { NextResponse } from "next/server";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import path from "path";
const pump = promisify(pipeline);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | undefined;
    // Check if a file is received
    if (!file) {
      // If no file is received, return a JSON response with an error and a 400 status code
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 }
      );
    }

    // Replace spaces in the file name with underscores
    const filename = file.name.replaceAll(" ", "_");

    const filePath = path.join(process.cwd(), `assets/${filename}`);
    await pump(file.stream() as any, fs.createWriteStream(filePath));
    return NextResponse.json({ status: "success", data: file.size });
  } catch (e) {
    console.error("Error uploading file:", e);
    return NextResponse.json({ status: "fail", data: e });
  }
}
