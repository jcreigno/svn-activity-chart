/*jslint node: true, vars: true, indent: 4 */

'use strict';
var s = require('node-static'),
    path = require('path');

var fileServer = new s.Server(path.join(__dirname, './public'));

//console.log(fileServer);

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        
        fileServer.serve(request, response, function (e, res) {
            if(e){
                response.writeHead(404);
                response.end();
            }
        });
    }).resume();
}).listen(8080);