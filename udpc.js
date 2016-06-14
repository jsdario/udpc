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
  socket.bind(program.port)

  socket.on('listening', function () {
    var address = socket.address()
    console.log(`\n Socket listening ${address.address}:${address.port}`)
    if (program.multicast) {
      // socket.setBroadcast(true)
      // socket.setMulticastTTL(16)
      console.log(`\n Subscription for mcast ${program.multicast}`)
      socket.addMembership(program.multicast)
    }
    console.log(`CTRL+C to exit`)
  })
  socket.on('message', (msg, rinfo) => {
    console.log(msg.toString())
    console.log(`Socket got: ${new Buffer(msg).toString()} from ${rinfo.address}:${rinfo.port}`)
  })
  socket.on('error', (err) => {
    console.trace(err)
    process.exit(0)
  })
} else {
  const body = new Buffer(program.body)
  const pkt = {
    body: body,
    offset: program.offset || 0,
    length: program.length || body.length,
    port: program.port,
    dest: program.dest
  }

  socket.send(pkt.body, pkt.offset, pkt.length, pkt.port, pkt.dest, 
    function () {
      console.log('\n You sent a udp packet with:')
      console.log(pkt)
      process.exit(0)
    })
}

process.on('exit', () => socket.close())
process.on('error', () => socket.close())
