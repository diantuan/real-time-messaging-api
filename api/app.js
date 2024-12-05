const express = require('express');
const app = express();
const connectMongoose = require('../mongoose-connection.js')
const cors = require('cors');

const authRoutes = require('../routes/auth-route.js')
const friendRoutes = require('../routes/friends-route.js')
const messageRoutes =require('../routes/message-route.js')
const channelRoutes = require('../routes/channel-routes.js')

connectMongoose();

app.use(cors({
  origin: '*',  // This allows requests from any domain
  methods: 'GET, POST, OPTIONS',  // Allow these HTTP methods
  allowedHeaders: 'Content-Type, Authorization'  // Allow these headers
}))

// Handle OPTIONS requests (preflight checks) for CORS
app.options('*', cors());  // This will handle the preflight requests for all routes

app.use(express.json());

app.get("/", (req,res)=>{
  res.status(200).send('Please specify your endpoint. --Diane')
})

app.use(authRoutes)
app.use(friendRoutes)
app.use(messageRoutes)
app.use(channelRoutes)

app.all('*', (req,res)=>{
  res.status(404).send('Into the unknown... --Diane')
})


module.exports = app;