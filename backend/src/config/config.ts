import dotenv from "dotenv";

dotenv.config();

interface ConfigData {
    port: number
}

export const configdata: ConfigData = {
    port: Number(process.env.PORT)
}