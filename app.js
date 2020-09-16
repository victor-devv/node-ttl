const http = require("http");

// Import routes.js
const routes = require("./routes");

const server = http.createServer(routes);

// if routes is exported via method2 in routes.js
// const server =  http.createServer(routes.handler);
// console.log(routes.someText);
server.listen(3000);
