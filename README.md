# FTP2HTTP
NodeJS proxy application to get a ftp file over http

## Dev
- npm install
- node app.js

## Prod (IIS)
- npm install
- Install IISNODE
- Deploy application on IIS path
- Convert path to an application

# Usage

## Parameters
- host
- port
- user
- password
- download
- file

## Example
http://localhost:3000/ftp2http?host=200.999.999.999&port=21&user=user.name&password=myPassword&download=false&file=fileToDownload.txt
