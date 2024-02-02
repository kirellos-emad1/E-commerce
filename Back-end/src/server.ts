import express, {Express, Request, Response, Application} from "express"
import dotenv from "dotenv"

dotenv.config()

const app: Application = express()
const port = process.env.PORT || 5050

app.get('/',(_req:Request, res:Response)=>{
    res.send("Welcome to express & TypeScript Server");
});

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})