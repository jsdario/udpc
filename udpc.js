#!/usr/bin/env node

var dgram = require('dgram')

var program = require('commander')

program
.version('0.0.1')
.option('-d, --dest <ip>', 'Destination ip')
.option('-b, --body [string]', 'Add a payload')
.option('-p, --port <number>', 'Destination port')
.option('--offset [value]', 'Packet 0s offset')
.option('--length [value]', 'Packet length')
.option('--listen', 'Await for incoming packages')
.option('-m, --multicast <subscription>', 'Add membership')
.parse(process.argv)

const socket = dgram.createSocket('udp4')

if (program.listen) {
  if (program.multicast) {
    socket.addMembership(program.multicast)
  }

  socket.bind(program.port)

  socket.on('listening', function () {
    var address = socket.address()
    console.log(`\n Socket listening ${address.address}:${address.port}`)
    console.log(`CTRL+C to exit`)
  })
  socket.on('message', (msg, rinfo) => {
    console.log(`Socket got: ${msg} from ${rinfo.address}:${rinfo.port}`)
  })
  socket.on('error', (err) => {
    console.trace(err)
    socket.close()
    process.exit(0)
  })
} else {
  socket.send(program.body, 
    program.offset,
    program.length, 
    program.port, 
    program.dest, 
    function () {
      console.log('\n You sent a udp packet with:')
      console.log(' * dest=%s', program.dest)
      console.log(' * port=%s', program.port)
      console.log(' * body=%s', program.body)
      socket.close()
      process.exit(0)
    })
}
