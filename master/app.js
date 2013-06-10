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
		data.socketId = socket.id ;
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
	/*var rspArray = [ 
		{"rsp" : { id: "master", movies:["movie.mp4","movieOld.mp4"] }}, 
		{"rsp" : { id: "192.168.1.2", movies:["movie1.mp4","movie2.mp4"] }}, 
		{"rsp": { id: "192.168.1.3", movies:["movie54.mp4","movie6.mp4"] }} ];*/
    res.write(
     JSON.stringify( rspArray ));
  res.end();
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
