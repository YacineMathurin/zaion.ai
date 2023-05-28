/**
 * Know more about heartybeat checking on the link bellow:
 * https://www.npmjs.com/package/ws#how-to-detect-and-close-broken-connections
 */
 
function heartbeat() {
  this.isAlive = true;
}

function timer(wss) {
  // Three seconds heartbeat
  const heartbeatInterval = 3000;
  
  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping();
    });
  }, heartbeatInterval);

  return interval;
}

module.exports = {
  timer,
  heartbeat,
};
