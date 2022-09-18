import { WebSocketServer } from "ws";

const socket = new WebSocketServer({
  port: 8080
});

socket.on("connection", (soc) => {
  soc.id = uniqueId();
  sendAll(JSON.stringify({"new": soc.id}));
  
  soc.on("message", (data) => {
    sendAll(data, soc.id)
  })
})

function uniqueId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

function sendAll(message = "", except) {
  if (except) {
    socket.clients.forEach(s => { if (s.id != except) s.send(message, console.error); });
  } else {
    socket.clients.forEach(s => s.send(message, console.error));
  }
}
