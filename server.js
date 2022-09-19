import { WebSocketServer } from "ws";
import fs from "fs/promises";
import { write } from "fs";
// console.console.log(new URL("http://g.c/api?id=123").searchParams);

let file;
fs.open("console.log.txt", "w").then(_ => file = _);

const socket = new WebSocketServer({
  path: "/api",
  port: 8080
});

socket.on("connection", (soc, req) => {
  const params = new URL("http:/g.c" + req.url).searchParams;
  if (params.has('p_id')) {
    soc.id = params.get("p_id")
    console.log({ [soc.id]: " joined" });
    // sendAll(JSON.stringify({
    //   "f_id": soc.id
    // }), soc.id);
  }
  soc.on("message", (data) => {
    // console.console.console.log(req.url);
    // if (params.has('t_id')) {
    //   for (let s of socket.clients) {
    //     if (s.id == params.get('t_id')) {
    //       let obj = JSON.parse(data.toString());
    //       obj.f_id = soc.id;
    //       s.send(JSON.stringify(obj));
    //       break;
    //     }
    //   }
    // } else {
    let obj = JSON.parse(data.toString());
    obj.f_id = soc.id;
    if (obj.t_id) {
      for (let s of socket.clients) {
        if (s.id == obj.t_id) {
          s.send(JSON.stringify(obj));
          console.log({ [soc.id]: obj })
          break;
        }
      }
    } else {
      sendAll(JSON.stringify(obj), soc.id)
      console.log({ [soc.id]: obj });
    }
    // }
    // if (soc.id == undefined) {
    //   const m = JSON.parse(data.toString());
    //   console.console.log("json", m);
    //   if (m["p_id"]) {
    //     soc.id = m["p_id"];
    //     console.console.log("Added peer ", soc.id);
    //   }
    // }
    // console.console.log(req.url);
  })
  soc.on("close", () => {
    sendAll(JSON.stringify({
      "d_id": soc.id
    }));
  })
})


function sendAll(message = "", except) {
  if (except) {
    socket.clients.forEach(s => {
      if (s.id != except) s.send(message, (e) => {
        if (e) { console.log(e); }
      });
    });
  } else {
    socket.clients.forEach(s => s.send(message, (e) => {
      if (e) {
        console.log(e)
      }
    }));
  }
}


/*

Added Peer  247590158
Added Peer  3430504555
sent 3430504555 to 247590158
sent 3430504555 to 247590158
sent 247590158 to 3430504555
sent 247590158 to 3430504555
Added Peer  587864883
sent 587864883 to 247590158
sent 587864883 to 247590158
sent 3430504555 to 587864883
sent 3430504555 to 587864883
sent 247590158 to 587864883
sent 247590158 to 587864883
sent 587864883 to 3430504555
sent 587864883 to 3430504555
sent 587864883 to 3430504555
sent 3430504555 to 587864883

 */
