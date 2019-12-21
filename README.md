#### Intro

Write a simple application server (in Node) that prints a message at a given time in the future.

#### Requirements
The server has only 1 API:
`echoAtTime` - which receives two parameters, time and message, and writes that message to the server console at the given time.

We want the server to be able to withstand restarts so it will use redis to persist the messages and the time they should be sent at.

You should also assume that there will be a cluster of more than one server running behind a load balancer (load balancing implementation itself does not need to be provided as part of the answer)

In case the server was down when a message should have been printed, it should print it out when going back online.

#### Usage
Client sends post request with the params `message` (String) and `time` (UNIX epoch) to `/api/echoAtTime`
```
POST /api/echoAtTime
{
  time: 1576932753655,
  Message: "Hello World"
}
```

and the server responds with the scheduled message status:

```
{
    "message": {
        "time": 1576932753655,
        "message": "Hello World",
        "id": "YZDMN8VV"
    },
    "status": true,
    "scheduledAt": "2019-12-21T12:52:33.655Z"
}
```

#### Install
```
npm i
```

#### Run
```
node app.js
```