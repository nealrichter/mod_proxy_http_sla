var sys = require('sys'), 
   http = require('http'),
   url = require('url');

var getIntParameter = function(index, defaultValue) {
  var i = defaultValue;
  try {
    var j = parseInt(process.argv[index]);
    if (j) i = j;
    return i;
  } catch(err) { }
};

var port = getIntParameter(2, 8002);
var minSleepTime = getIntParameter(3, 0);
var maxSleepTime = getIntParameter(4, 150);

http.createServer(function (req, res) {
  try { 
    var params = require("url").parse(req.url, true);
    if (req.url.match('/slatest')) {

       if(!params.query.sleep)
           params.query.sleep = 5;

       if((params.query.httpcode > 299) && (params.query.httpcode < 400))
       {
          setTimeout(function() {
            res.writeHead(params.query.httpcode, {'Content-Type':'text/html', 'Location':"/status"});
            res.write('');
            res.close();
            sys.puts(Date() +' Request to: ' + req.url + ' ' + params.query.httpcode); 
        }, params.query.sleep);
       }
       else if((params.query.httpcode > 399) && (params.query.httpcode < 500))
       {
          setTimeout(function() {
            res.writeHead(params.query.httpcode, {'Content-Type':'text/html', 'Location':"/status"});
            res.write('Error of not found variety!\n');
            res.close();
            sys.puts(Date() +' Request to: ' + req.url + ' ' + params.query.httpcode); 
        }, params.query.sleep);
       }
       else if((params.query.httpcode > 499) && (params.query.httpcode < 600))
       {
          setTimeout(function() {
            res.writeHead(params.query.httpcode, {'Content-Type':'text/html', 'Location':"/status"});
            res.write('Error of internal variety!\n');
            res.close();
            sys.puts(Date() +' Request to: ' + req.url + ' ' + params.query.httpcode); 
        }, params.query.sleep);
       }
       else
       {
          setTimeout(function() {
            res.writeHead(params.query.httpcode, {'Content-Type':'text/html'});
            res.write('Hello World\n');
            res.close();
            sys.puts(Date() +' Request to: ' + req.url + ' ' + params.query.httpcode); 
        }, params.query.sleep);
       }
    } else if (req.url.match('/status')){
      res.writeHead(200, {'Content-Type':'text/plain'});
      res.write('Status Nominal\n');
      res.close();
      sys.puts(Date() +' Request to: ' + req.url + ' 400 "Invalid url"');
    } else {
      res.writeHead(400, {'Content-Type':'text/plain'});
      res.write('Invalid url: ' + req.url);
      res.close();
      sys.puts(Date() +' Request to: ' + req.url + ' 400 "Invalid url"');
    }
  } catch(err) {
    sys.puts(err);
    res.writeHead(500, {'Content-Type':'text/plain', 'Content-Length':err.length});
    res.write(err);
    res.close();
    sys.puts(Date() +' Request to: ' + req.url + ' 500 "http.createServer.catch(err)"');
  }
}).listen(port);
sys.puts('slatest.js running at http://0.0.0.0:' + port);
