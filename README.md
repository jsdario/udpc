# UDPC
A simple program to send and listen for UDP packages from command line

## Install 
```
npm i -g udpc
```

## Send:
```
udpc --body "hello" --port 1450 --dest 0.0.0.0

 You sent a udp packet with:
 * dest=0.0.0.0
 * port=1450
 * body=hello
```

## UDP simple server
```
udpc --body "hello" --port 1500 --listen      

 Socket listening 0.0.0.0:1500
 CTRL+C to exit

```