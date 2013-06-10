from socketIO_client import SocketIO

def on_aaa_response(*args):
    print 'on_aaa_response', args

	
def on_bbb_response(*args):
    print 'on_start', args
	
	
def on_newPiConnected_response(*args):
    print 'on_newPiConnected_response', args
	
	
socketIO = SocketIO('192.168.1.8', 8082)
socketIO.on('aaa_response', on_aaa_response)
socketIO.on('start', on_bbb_response)
socketIO.on('newPiConnected', on_newPiConnected_response)

socketIO.emit('newPiConnected')
socketIO.wait()
