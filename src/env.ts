import { config } from "dotenv";

config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET || "thiisecret865776rr4e*&&*e";
export const PORT = process.env.PORT || 4000;
