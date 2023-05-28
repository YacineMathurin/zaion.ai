// Importing the required modules

const WebSocketServer = require("ws");

// File system module
const fs = require("fs");

// using websocket ping request and pong response we
// checks if user is still connected through heartbeat message or close
// the connection to save ressources
// https://www.npmjs.com/package/ws#how-to-detect-and-close-broken-connections
const { heartbeat, timer } = require("./utils");

// Creating a new websocket server 
const port = 3050; 
const wss = new WebSocketServer.Server({ port });

// checking connected user
const intervalId = timer(wss);

// Creating connection using websocket
wss.on("connection", (ws) => {
  ws.on("error", () => {
    console.log("Some Error occurred");
  });

  ws.isAlive = true;
  ws.on("pong", heartbeat);

  // log in the terminal. We could also log to a file or a remote repository
  console.log("New Connection");
  // sending message to client
  ws.send("Successfully connected to the server !");

  // on message from client
  ws.on("message", (data) => {
    console.log(`New message: ${data}`);

    fs.readFile(`${__dirname}/files/${data}`, "utf8", (err, data) => {
      // handle error to prevent app to crash and send back user friendly message
      if (err) {
        return ws.send(
          "Something went wrong when fetching the file, check the file name and its extension"
        );
      }
      ws.send(data);
    });
  });

  // handling what to do when clients disconnects from server
  ws.on("close", () => {
    console.log("Connection closed");

    ws.send("Connection closed");
    clearInterval(intervalId);
  });
});
console.log("The WebSocket server is running on port: ", port);
