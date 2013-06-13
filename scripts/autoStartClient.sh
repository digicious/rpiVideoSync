#!/bin/bash
USER=pi
OUT=/home/pi/slave.log
CLIENTSCRIPT=/home/pi/rpiVideoSync/slave/client.py
PYTHONBIN=/usr/bin/python

case "$1" in

start)
	echo "starting node: $PYTHONBIN $CLIENTSCRIPT"
	sudo -u $USER $PYTHONBIN $CLIENTSCRIPT > $OUT 2>$OUT &
	;;

stop)
	kill $(ps aux | grep "$CLIENTSCRIPT" | awk '{ print $2 }')
	;;

*)
	echo "usage: $0 (start|stop)"
esac

exit 0
