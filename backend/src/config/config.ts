import dotenv from "dotenv";

dotenv.config();

interface ConfigData {
    port: number
    frontendpoint: string
}

export const configdata: ConfigData = {
    port: Number(process.env.PORT),
    frontendpoint: process.env.FRONTEND_URL
}