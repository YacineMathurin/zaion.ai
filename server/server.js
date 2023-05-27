// Importing the required modules
const WebSocketServer = require("ws");
const fs = require("fs");

// Creating a new websocket server
const port = 3050;
const heartbeatInterval = 3000;
const wss = new WebSocketServer.Server({ port });

function heartbeat() {
  this.isAlive = true;
}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    console.log(ws.isAlive);
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
    console.log("Ping");
  });
}, heartbeatInterval); 

// Creating connection using websocket
wss.on("connection", (ws) => {
  console.log("New Connection");

  ws.isAlive = true;
  ws.on('pong', heartbeat);

  // sending message to client
  ws.send("Successfully connected to the server !");

  //on message from client
  ws.on("message", (data) => {
    console.log(`New message: ${data}`);

    fs.readFile(`${__dirname}/files/${data}`, "utf8", (err, data) => {
      if (err) {
        return ws.send("Something went wrong when fetching the file, check the file name and its extension ");
      }
      ws.send(data);
    });
  });

  // handling client connection error
  ws.onerror = function () {
    console.log("Some Error occurred");
  };

  // handling what to do when clients disconnects from server
  ws.on("close", () => {
    console.log("Connection closed");

    ws.send("Connection closed");
    clearInterval(interval);
  }); 
  
});
console.log("The WebSocket server is running on port: ", port);
