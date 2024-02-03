import express, {Express, Request, Response, Application} from "express"
import dotenv from "dotenv"
import routers from './Routes';
import { db} from './db/prisma'
import bodyParser from 'body-parser';
dotenv.config()


const app: Application = express()
app.use(bodyParser.json());

const port = process.env.PORT || 5050
app.use('/api', routers)


app.get('/', async(req:Request, res:Response)=>{
    res.send(`<h1>hello from the server<h1>`)
});

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})