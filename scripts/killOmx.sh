#!/bin/bash
kill $(ps aux | grep "omx" | awk '{ print $2 }')
