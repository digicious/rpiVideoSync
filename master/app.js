var express = require('express')
  , app = express()  
  , server = require('http').createServer(app)
  , path = require('path')

// all environments
app.set('port', process.env.TEST_PORT || 8081);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var payload = {'xxx': 'yyy'};

var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout); };

console.log('Hello world');


//Routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/remote.html');
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var io = require('socket.io').listen(8082);


io.sockets.on('connection', function (socket) {
  	socket.broadcast.emit('newPiConnected'); 
	console.log('user connected');
	socket.on('remoteConnected', function(){
		socket.broadcast.emit('remoteConnected',payload);
	});
	
});



app.get('/start', function(req,res){
		io.sockets.emit('start');
		console.log('start');
		exec("nohup ./omxplayer-sync -v -m -x 255.255.255.255 ../movie.mp4.mp4 > /dev/null &", puts);		
	});
app.get('/halt', function(req,res){
		io.sockets.emit('start');
		console.log('start');
		exec("sudo halt",puts);
	});
