const { Server } = require('socket.io')

export default function handler(req, res) {
    if (res.socket.server.io) {
        console.log('Socket is already running')
      } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io


        io.on('connection', socket => {
          socket.broadcast.emit('a user connected')
          socket.on('hello', msg => {
            console.log(msg)
            socket.emit('hello', 'world!')
          })
        })
      }
      res.end()
  }  

  /*
  
import { Server } from 'Socket.IO'

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io
  }
  res.end()
}

export default SocketHandler
  */