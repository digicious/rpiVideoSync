from socketIO_client import SocketIO
import os
import glob 

filePattern = '*.py';

def getMovieList():
	mvs = glob.glob(filePattern);
	return mvs;
	
def getMovieListResponse():
	dic = {}
	dic["id"] ="me";
	dic["pid"] = os.getpid(); 
	dic["movieList"] = getMovieList();
	return dic;



def on_newPiConnected_response(*args):
    print 'on_newPiConnected_response', args
	
def on_getMovieList(*args):
    global socketIO
    pid = os.getpid();
    socketIO.emit('onMovieListResponse', getMovieListResponse() );	

socketIO = SocketIO('192.168.2.166', 8082)
socketIO.on('newPiConnected', on_newPiConnected_response)
socketIO.on('getMovieList',on_getMovieList);
print(getMovieList());
socketIO.emit('newPiConnected')
socketIO.wait()
