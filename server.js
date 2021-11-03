//dependencies 
require("dotenv").config()


// port variable
const {PORT = 3000, MONGODB_URL} = process.env

const express = require("express")

const app = express()
const mongoose = require("mongoose")



//import middleware

const cors = require("cors") //cors headers, gives frontend permission to use this backend
const morgan = require("morgan") //logging , better for diagnosing errors and fixing them 




//database connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disconnected to Mongo"))
.on("error", (error) => console.log(error))



//models
const PeopleSchema = new mongoose.Schema(
    {
        name: String,
        image: String,
        title: String

    }
)

const People = mongoose.model("People", PeopleSchema)


//register middleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())




//routes
app.get("/", (req, res) =>{
    res.send("Hello world")
})

//index route
app.get("/people", async (req, res)=>{
    //try catch block to catch hidden errors - run the code thats inside the block and if something goes wrong it will log the error and not shut down the live app
    try {
        //send all people 
        res.json(await People.find({}))
    } catch (error) {
        //send error
        res.status(400).json(error)
    }
})


//create route 
app.post("/people", async (req, res)=>{
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})


//People create route PUT
app.put("/people/:id", async (req, res)=>{
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, { new: true }))
    } catch (error) {
        res.status(400).json(error)
    }
})


//delete
app.delete("/people/:id", async (req, res)=>{
    try {
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})


//server listener
app.listen(PORT, () => {console.log(`Listening on ${PORT}`)})