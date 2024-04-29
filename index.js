const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express= require('express');
const cors =require('cors');
require('dotenv').config();
const app =express();
const port = process.env.PORT || 5000;



// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hzfjxhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const spotCollection = client.db("spotDB").collection('spot')
    const countryCollection = client.db("spotDB").collection('countries')

// get

app.get('/spot',async(req,res)=>{
    const cursor =spotCollection.find();
    const result =await cursor.toArray()
    res.send(result)
  })


  // update
  
  app.get('/spot/:id',async(req,res)=>{
    const id= req.params.id
    const query={_id:new ObjectId(id)}
    const result=await spotCollection.findOne(query)
    res.send(result)
  })


//mylist
app.get('/mylist/:email',async(req,res)=>{
    // console.log(req.params.email)
    const result=await spotCollection.find({email : req.params.email}).toArray()
    res.send(result)           
})   

// post 
app.post('/spot',async(req,res)=>{
    const newSpot=req.body
    console.log(newSpot)
    const result = await spotCollection.insertOne(newSpot);
      res.send(result)
})
// update
app.put('/spot/:id',async(req,res)=>{
  const id=req.params.id
  const filter={_id:new ObjectId(id)}
  const options={upsert:true}
  const updatedSpot=req.body
  const spot={
    $set:{
      image:updatedSpot.image,
       spot:updatedSpot.spot,
       country:updatedSpot.country,location:updatedSpot.location, description:updatedSpot.description,cost:updatedSpot.cost,
        season:updatedSpot.season,
         travel:updatedSpot.travel, 
         visitor:updatedSpot.visitor
    }
  }
const result=await spotCollection.updateOne(filter,spot,options)
res.send(result)
})

// delete

app.delete('/spot/:id',async(req,res)=>{
  const id= req.params.id
  const query={_id:new ObjectId(id)}
  const result=await spotCollection.deleteOne(query)
  res.send(result)
})
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('assignment server is running')
})

app.listen(port,()=>{
    console.log(`assignment server is running on port ${port}`)
})