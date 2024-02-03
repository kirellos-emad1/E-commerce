import express, {Express, Request, Response, Application} from "express"
import dotenv from "dotenv"
import routers from './Routes';
import { db} from './db/prisma'
dotenv.config()


const app: Application = express()
const port = process.env.PORT || 5050
app.use('/api', routers)


app.get('/', async(req:Request, res:Response)=>{


    const users = await db.user.findMany();
    
    const names = users.map((user)=> user.username)
    const roles = users.map((user)=> user.role)
    res.send(`There are ${names.length} users with names of: ${names.join(', ')} with Roles of ${roles.join(", ")}`)
});

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})