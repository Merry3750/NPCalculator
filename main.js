var express = require("express");
var app = express();
app.use(express.static(__dirname));
var path = require("path");
var open = require("open");
app.get('/',function(req,res)
{
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});
app.listen(3000);
console.log("Server running at Port 3000");
open("http://127.0.0.1:3000");