import crypto from "crypto";

export const generateKey = () => crypto.randomBytes(16).toString("hex");
