var http = require("http");
var server = http.createServer(function (request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World\n");
});
server.listen(8000,()=>{
   console.log("listening on port 8000")
});

function init(options) {
  function charToNumber(char) {
    return char.charCodeAt(0) - 96;
  }

  function StringManipulation() {}

  var stringManipulation = new StringManipulation();

  stringManipulation.contains = function (a, b) {
    return a.indexOf(b) > -1;
  };

  stringManipulation.stringToOrdinal = function (str) {
    var result = "";
    for (var i = 0, len = str.length; i < len; i++) {
      result += charToNumber(str[i]);
    }
    return result;
  };
  return stringManipulation;
}
module.exports = init;
