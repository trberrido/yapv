// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   server.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: thberrid <marvin@42.fr>                    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2019/05/25 19:20:06 by thberrid          #+#    #+#             //
//   Updated: 2019/05/25 19:20:14 by thberrid         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

const http = require("http");
const fs = require("fs");
const path = require("path");
const server = http.createServer();

server.on("request", function(req, res){
	var filePath = "." + req.url;
	if (filePath == "./")
		filePath = "./index.html";
	var extension = String(path.extname(filePath)).toLowerCase();
	var mimeTypes = {
		".html": "text/html",
		".css": "text/css",
		".js": "text/javascript",
	};
	var contentType = mimeTypes[extension];
	fs.readFile(filePath, function(error, content){
		if (error){
			res.writeHead(404);
			res.end("404");
		} else {
			res.writeHead(200, {"Content-Type": contentType});
			res.end(content, "utf-8");
		}
	});
});

const io = require("socket.io").listen(server);
io.origins('*:*');

const { exec } = require("child_process");

io.sockets.on("connection", function (client){
	console.log("conn");
	client.on("run", function (data){
		console.log("client call " + data.join(' '));
		const child = exec("push_swap/push_swap " + data.join(" "), (err, stdout, stderr) => {
			if (err) {
				console.log(err)
				client.emit("message", "An error occured with push_swap");
			} else {
				console.log(stderr);
				console.log(stdout);
				var ops = stdout.split("\n");
				var i = 0;
				while (i < ops.length){
					client.emit("newop", ops[i]);
					i += 1;
				}
			}
		});
	});
});

server.listen(8080);
