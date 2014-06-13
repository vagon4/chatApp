var http = require ('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

function send404(res){
	res.writeHead(404, {'Content-type': 'text/plain'});
	res.write('Error 404: resource not found');
	res.end();
}

function sendFile(res, fPath, fContents){
	res.writeHead(
		200,
		{"Content-type": mime.lookup(path.basename(fPath))}
	);
	res.end(fContents);
}

function serverStatic(res, cache, absPath){
	if (cache[absPath]){
		sendFile(res, absPath, cache[absPath]);
	} else {
		fs.exists(absPath, function(exists){
			if(exists){
				fs.readFile(absPath, function(err, data){
					if(err){
						send404(res);
					} else {
						cache[absPath] = data;
						sendFile(res, absPath, data);
					}
				});
			} else {
				send404(res);
			}
		});
	}
}

var server = http.createServer(function(req, res){
	var fPath = false;
	
	if(req.url == '/'){
		fPath = 'public/index.html';
	} else {
		fPath = 'public' + request.url;
	}
	var absPath = './' + fPath;
	serveStatic(res, cache, absPath);
});

server.listen(3000, function(){
	console.log("Server listening on port 3000.");
});