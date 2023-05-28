const el1 = document.getElementById("document-1");
const el2 = document.getElementById("document-2");
const el3 = document.getElementById("document-3");
const connectBtn = document.getElementById("connect");
const disconnectBtn = document.getElementById("disconnect");
 
// port to connect to
const port = 3050;

// connect once this button is clicked
connectBtn.addEventListener("click", main);

// reset view and by the way handle button to make accessible
function reset() {
  el1.style.display = "none";
  el2.style.display = "none";
  el3.style.display = "none";
  disconnectBtn.style.display = "none";
}

reset();

function main() {
  // connect to the server
  const client = new WebSocket(`ws://localhost:${port}`);

  client.addEventListener("error", () => {
    console.log("Error when connecting !");
  });

  client.addEventListener("open", () => {
     el1.style.display = "inline-block";
    el2.style.display = "inline-block";
    el3.style.display = "inline-block";
    disconnectBtn.style.display = "inline-block";
    connectBtn.style.display = "none";
  });

  // display received message for the client
  client.addEventListener("message",  (event) => {
    document.getElementById("result-text").textContent = event.data;
  });

  client.addEventListener("close", (event) => {
    // detect if the client closed the link or the server crashed or not responding
    const cleanClose = event.wasClean;

    reset();
    connectBtn.style.display = "inline-block";
    document.getElementById("result-text").textContent = cleanClose
      ? "Connection closed"
      : "Server not responding";
  });

  el1.addEventListener("click", () => {
    if (client.readyState === client.OPEN) client.send("file-1.txt");
  });

  el2.addEventListener("click", () => {
    if (client.readyState === client.OPEN) client.send("file-2.txt");
  });

  el3.addEventListener("click", () => {
    if (client.readyState === client.OPEN) client.send("file-3.txt");
  });

  disconnectBtn.addEventListener("click", () => {
     client.close();
  });
}
