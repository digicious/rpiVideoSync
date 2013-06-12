from socketIO_client import SocketIO
import os
import glob 
import  subprocess
import json


filePattern = '../movies/*.mp4';

def getMovieList():
	mvs = glob.glob(filePattern);
	return mvs;
	
def getMovieListResponse():
	dic = {}
	dic["id"] ="me";
	dic["pid"] = os.getpid(); 
	dic["movieList"] = getMovieList();
	return dic;

lastProcess = None;

def on_newPiConnected_response(*args):
    print 'on_newPiConnected_response', args
	
def on_getMovieList(*args):
    global socketIO
    pid = os.getpid();
    socketIO.emit('onMovieListResponse', getMovieListResponse() );	

def on_MovieStart(*args):	
	 global lastProcess;
	 print("Let's play : " + args[0][0]["selectedMovie"]);
	 lastProcess = subprocess.Popen("echo ../omxplayer -v -l " + args[0][0]["selectedMovie"], shell=True);

def on_Stop(*args):	
	 global lastProcess;
	 if lastProcess is not None:
		lastProcess.poll()
		if lastProcess.returncode is not None :
			print("Stop  ! " + str( lastProcess.pid));
			lastProcess.kill();
		 
	
socketIO = SocketIO('192.168.2.166', 8082)
socketIO.on('newPiConnected', on_newPiConnected_response)
socketIO.on('getMovieList',on_getMovieList);
socketIO.on('start', on_MovieStart);
socketIO.on('stop', on_Stop);


socketIO.emit('newPiConnected')
socketIO.wait()
