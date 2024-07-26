#!/bin/bash

# Check if a filename is passed as an argument
if [ -z "$1" ]; then
  echo "No file name provided"
  exit 1
fi

FILE_NAME="$1"

# Check if the file exists
if [ ! -f "$FILE_NAME" ]; then
  echo "File not found: $FILE_NAME"
  exit 1
fi

# Compile the C++ code
g++ "$FILE_NAME" -o main

# Run the compiled binary
./main
