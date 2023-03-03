import { config } from "dotenv";

config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const SENDGRID_FROM_KEY = process.env.SENDGRID_FROM_KEY;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const JWT_SECRET = process.env.JWT_SECRET || "thiisecret865776rr4e*&&*e";
export const PORT = process.env.PORT || 4000;
