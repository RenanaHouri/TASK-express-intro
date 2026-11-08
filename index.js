// Express.js Intro - write your server here.
// Run it with: node index.js   (stop it with Ctrl + C)

// Part 1: create an express app, a GET /greet endpoint and app.listen(3000)

// Part 2: GET /greet/:name  and  GET /test (calls /greet/:name with fetch)

// Part 3: POST /action  ("joke" / "cat fact", otherwise 400 "body is malformed")

const express=require("express");
const app=express();
app.use(express.json());
app.get("/greet",(req,res)=>{
    const timestamp =new Date().toISOString();
    res.json({ msg:`hi from get endpoint ${timestamp}`})
})

app.get("/greet/:name",(req,res)=>{
    const name=req.params.name;
    console.log(`i got name: ${name}`);
    res.json({ msg: `got name: ${name}` })

})
app.get("/test",async(req,res)=>{
    const response = await fetch("http://localhost:3000/greet/Bob");
    const data= await response.json();
    if(typeof data.msg === "string" && data.msg.includes("Bob"))
    {
       res.json({ "result": "ok" })
    }
    else{
       res.json({ "result": "fail" }) 
    }

})
app.post("/action",async(req, res)=>{
    if(!req.body)
    {
       return res.status(400).json({msg:"body is malformed"})
    }
    const action = req.body.action;
    if(action!="joke"&& action!=="cat fact")
    {
         res.status(400).json({msg:"body is malformed"})
    
    }
    if (Object.keys(req.body).length !== 1 || !Object.hasOwn(req.body, "action"))
    {
        res.status(400).json({msg:"body is malformed"})
    }
    if(req.body.action=="joke")
    {
        const response=await fetch("https://v2.jokeapi.dev/joke/Any?type=single&safe-mode")
        const data= await response.json()
        res.json({
        joke: data.joke.toUpperCase()
        });
    }
    else if(req.body.action=="cat fact")
    {
        const response=await fetch("https://api.thecatapi.com/v1/images/search?limit=11",
             { headers: { "x-api-key": process.env.CAT_API_KEY } });
        const data=await response.json()
        const length=data.length;
        res.json(
           {
             "length": String(length)
           }
        )
    }
   
        

})
app.listen(3000);