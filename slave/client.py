from socketIO_client import SocketIO
import os

def on_aaa_response(*args):
    print 'on_aaa_response', args

	
def on_bbb_response(*args):
    print 'on_start', args
	
	
def on_newPiConnected_response(*args):
    print 'on_newPiConnected_response', args
	
def on_getMovieList(*args):
    global socketIO
    pid = os.getpid();
    socketIO.emit('onMovieListResponse', {'id': 'me','movieList': ['m1','m2'], 'pid' : pid } );	

socketIO = SocketIO('192.168.2.84', 8082)
socketIO.on('aaa_response', on_aaa_response)
socketIO.on('start', on_bbb_response)
socketIO.on('newPiConnected', on_newPiConnected_response)
socketIO.on('getMovieList',on_getMovieList);

socketIO.emit('newPiConnected')
socketIO.wait()
