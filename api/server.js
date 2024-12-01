const http = require('http')
const app = require('./app')
const {Server} = require('socket.io')

const server = http.createServer(app)

const io = new Server(server, {cors:{origin:'*'}})

app.set('io', io)

io.on('connection', (socket)=>{

  socket.on('disconnect')
})

module.exports = (req,res)=>{
  app(req,res)
}