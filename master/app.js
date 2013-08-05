
//-------------------------------------------
var omxPlayerCommand ="/home/pi/omxplayer-sync/omxplayer-sync -m -x 255.255.255.255 /home/pi/rpiVideoSync/movies/"
var killOmxCommand =  "/home/pi/rpiVideoSync/scripts/killOmx.sh";
var moviesLocation = '/home/pi/rpiVideoSync/movies';
var haltCommand = "/usr/bin/sudo /sbin/halt";
var networkPort = 8081;

//-----------------------------------------------



var express = require('express')
  , app = express()  
  , server = require('http').createServer(app)
  , path = require('path')

// all environments
app.set('port', process.env.TEST_PORT || networkPort);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var payload = {'xxx': 'yyy'};
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout); };
var fs = require('fs');

console.log('Hello world');

//Routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/remote.html');
});





server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var io = require('socket.io').listen(8082);

rspArray = [];

io.sockets.on('connection', function (socket) {
  	socket.broadcast.emit('newPiConnected'); 
	console.log('user connected');
	socket.on('remoteConnected', function(){
		socket.broadcast.emit('remoteConnected',payload);
	});
	socket.emit("getMovieList");
	socket.on("onMovieListResponse",function(data)
	{
		data.socketId = socket.id;
		data.selectedMovie = "none";
		rspArray.push(data);
		console.log(rspArray);
	});
	socket.on('disconnect', function () {
	   console.log('Rsp disconnected!!!');
	   rspArray = rspArray.filter(
		function (value) {
			return ( value.socketId != socket.id);
			
	   });
	});
	
});


app.get('/getRspList.json',function(req,res){
	res.writeHead(200, {"Content-Type": "application/json"});
	var response = { master : { id: "master", movieList:  getMovieList(), selectedMovie: "" }, slaves : rspArray };	
    res.write(
     JSON.stringify( response ));
  res.end();
});

app.post('/start', function(req,res){
	
		console.log("--->"+ JSON.parse(req.body.jdata));
	        io.sockets.clients().forEach(function (socket) 
		 {
				socket.emit('start', JSON.parse(req.body.jdata).slaves.filter(function(o){ return o.socketId == socket.id ;}));
		 });
		
		var command = omxPlayerCommand + JSON.parse(req.body.jdata).master.selectedMovie;	

		console.log(req.connection.remoteAddress);
		console.log(command);
		exec(command,puts);
		
	});

app.get('/stop', function(req,res){
	console.log('stop');
	exec(killOmxCommand);
	io.sockets.clients().forEach(function (socket) 
	 {
		socket.emit('stop');
	 });
	
});


app.get('/halt', function(req,res){
		io.sockets.emit('halt');
		console.log('halt');
		exec(haltCommand,puts);
	});
	
function getMovieList()
{
	var mvList = fs.readdirSync(moviesLocation);
	return mvList;
}
