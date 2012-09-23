#!/bin/bash
forever -l ~/log/$(pwd | sed -e "s/\//\-/g")-$(date +%Y-%m-%d-%k:%M:%S).log start server/chat.js
