import {Pool} from "pg"
import "dotenv/config"
import {logger} from "../Utils/Logger";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    min: 4,
    max: 10,
    keepAlive: true,
})

pool.on("connect",(client)=>{
    logger.info("Database Connected")
})
pool.on("error", (err) => {
    logger.error("DB connection error:", err)
    console.error(err)
})

export async function initDB():Promise<void> {
    try{
        await pool.query("Select 1")
    }catch(err){
        throw err
    }
}
export default pool
