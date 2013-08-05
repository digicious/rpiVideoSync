from socketIO_client import SocketIO
import os
import glob 
import  subprocess
import json
import platform
import time
import pexpect 

home = '/home/pi/rpiVideoSync/'
filePattern = home +'movies/*.mp4';
waitInSeconds = 5;
maxRetry = 10;
masterIp = '10.0.4.253' ;



def getMovieList():
	mvs = glob.glob(filePattern);
	return mvs;
	
def getMovieListResponse():
	dic = {}
	dic["id"] = platform.node();
	dic["pid"] = os.getpid(); 
	dic["movieList"] = getMovieList();
	return dic;

lastProcess = -1;
nbRetry = 0 ;

def on_newPiConnected_response(*args):
	try:
		print 'on_newPiConnected_response', args
	except:
		print("error on_newPiConnected_response");
	
def on_getMovieList(*args):
	try:
		global socketIO
		pid = os.getpid();
		socketIO.emit('onMovieListResponse', getMovieListResponse() );	
	except:
		print("error on_getMovieList");
	

def on_MovieStart(*args):	
	try:
		global lastProcess;
		print("Let's play : " + args[0][0]["selectedMovie"]);
#		time.sleep(2)
		lastProcess = subprocess.Popen( home + "../omxplayer-sync/omxplayer-sync -l --loop " + args[0][0]["selectedMovie"], shell=True).pid;
	except:
		print("error on_getMovieList");
	

def on_Stop(*args):	
	try:
	#this script will kill everything...
		print("killing everything");
		subprocess.Popen(home + "scripts/killOmx.sh", shell=True)
		print("kill done !");
	except:
		print("error on_getMovieList");
		 

def on_Halt(*args):	
	try:
	#this script will kill everything...
		print("killing everything");
		subprocess.Popen("/usr/bin/sudo /sbin/halt", shell=True)
		print("kill done !");
	except:
		print("error on_getMovieList");
		
		
socketIO = None ;	
while(nbRetry < maxRetry):
	try:
		socketIO = SocketIO(masterIp, 8082)
		socketIO.on('newPiConnected', on_newPiConnected_response)
		socketIO.on('getMovieList',on_getMovieList);
		socketIO.on('start', on_MovieStart);
		socketIO.on('stop', on_Stop);
		socketIO.on('halt', on_Halt);
		socketIO.emit('newPiConnected')
		socketIO.wait()
	except:
		if( socketIO != None) :
			del socketIo
		nbRetry = nbRetry + 1;
		print("error fail to connect to the main server.. I'll retry later Attempt Nb :" + str(nbRetry));
		time.sleep(waitInSeconds);

		
