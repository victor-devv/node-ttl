// NODE JS CORE MODULES
// HTTP(LAUNCH SERVER, SEND REQUESTS), HTTPS(LAUNCH SSL SERVER), FS, PATH, OS

const fs = require("fs");
const http = require("http");

// REQUEST LISTENER

// first parameter for request
// second parameter for response
// function rqListener(req, res) {

// }

// const server = http.createServer((req, res) => {
//   // console.log(req.url, req.method, req.headers);
//   //   process.exit(); //THIS EXITS THE SERVER

//   res.setHeader("Content-Type", "text/html");

//   res.write("<html>");
//   res.write("<head><title>My First Node Page</title></head>");
//   res.write("<body><h1>Hello From Node.js Server!</h1></body>");
//   res.write("</html>");

//   res.end();
// });

// // Server listens for incoming requests from hostname and a port
// server.listen(3000);

// R  O  U  T  I  N  G     R  E  Q  U  E  S  T  S

// const server = http.createServer((req, res) => {
//   const url = req.url;
//   const method = req.method;

//   // WE WOULD CREATE A PAGE THAT ALLOWS A USER ENTER A MESSAGE IN THE HOMEPAGE TO /message, THEN CREATE A FILE TO STORE THE MESSAE, THEN REDIRECT TO THE HOMEPAGE

//   if (url === "/") {
//     res.write("<html>");
//     res.write("<head><title>Enter Message</title></head>");
//     res.write(
//       "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form></body>"
//     );
//     res.write("</html>");

//     return res.end(); //this ends the statement. its important to return res.end cos nothing should come after ending it
//   }

//   if (url === "/message" && method === "POST") {
//     fs.writeFileSync("message.txt", "DUMMY");

//     res.statusCode = 302; //302 is status code for redirect
//     res.setHeader("Location", "/");
//     return res.end();
//   }
// });

// P  A  R  S  I  N  G     R  E  Q  U  E  S  T     B  O  D  I  E  S

// S T R E A M S   A N D   B U F F E R

// Incoming request data is sent as a stream of data (unlike request method and url).

// Requests are read by node in chunks; in multiple parts till its fully parsed. So you don't have to wait for the request to be fully read. Consider a file being uploaded, streaming the data is quite important bcos it could allow you to start writing the contents to your hard disk while the data is incoming, so you don't have to parse the entire file before you can do anything with it.

// To organise this incoming chunks of data, you need to use buffer (a bus stop). A buffer is a construct which allows you to hold mutliple chunks and work with them before they are released

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");

    return res.end(); //this ends the statement. its important to return res.end cos nothing should come after ending it
  }

  if (url === "/message" && method === "POST") {
    // GET THE REQUEST DATA => by registering an event listener

    //on method allows you to listen to certain events; data in this case, and would fire anytime a new chunk of data is ready to be read
    const body = []; //request body
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    // Register the end event listener.
    // This would be fired once it's done parsing the incoming request.
    // Here, we intereact with the chunks by buffering them
    return req.on("end", () => {
      // Buffer the chunk, concat the body and conver to string
      const parsedBody = Buffer.concat(body).toString();

      // Now let's store the input in our file
      const message = parsedBody.split("=")[1];

      // write to the file in the event listener bcos node won't wait for the event listener, and the file or the code(in future) may need something from the parsed body
      // fs.writeFileSync("message.txt", message);

      //fs.writeFileSync blocks code execution (sync stands for synchronous, opp asynchronous).
      // Working  with files is available in synchronous or asynchronous mode. When working with huge files it is important to use the asynchronous method fs.writeFile which accepts a third argument; a callback function which receivees an error object which stays null without an error adn enables you to handle an error

      fs.writeFile("message.txt", message, (err) => {
        // The response is in the event handler because we only want to get this error upon a successful file hanling, not before it(async)
        res.statusCode = 302; //302 is status code for redirect
        res.setHeader("Location", "/");
        return res.end();
      });
    }); //This req.on is returned else the code below would work and caue an error. This is due ti the asyn nature of node, as node won't wait for the request body to be parsed before moving to the line of code below. So when the parsed body has been written to the file, it tries to set the header again, but causes an error
  }
  res.setHeader("Content-Type", "text/html");

  res.write("<html>");
  res.write("<head><title>My First Node Page</title></head>");
  res.write("<body><h1>Hello from my Node.js Server!</h1></body>");
  res.write("</html>");

  res.end();
});

// S I N G L E   T H R E A D,   E V E N T   L O O P   &   B L O C K I N G   C O D E

/* 
  Note that node uses just one js thread. But how does it then handle multiple requests??

  // PERFORMANCE
  Node JS handles multiple requests using EVENT LOOP. The event loop auto starts with the server, and it handles event callbacks that contain fast finishing codes.

  Slow finishing codes such as those that involve the file system are handled by the WORKER POOL. It does the heavy lifting, and its totally detached from the code and works on a different thread. So its detached from your code and event loop. The only attachment to the event loop is that once the worker is done,e.g when a file has been written, it triggers a callback for the operation, then nodejs handles it.

  // EVENT LOOP
  This is loop run and started by nodejs which keeps things running and it handles callbacks. Basically, its just a loop.
  1. TIMERS It checks for timer callbacks that it should execute => setTimeout and setinterval callbacks.
  2. PENDING CALLBACKS It checks other pending callbacks e.g write or read file, then execute these call backs e.g I/O (input/output) callbacks
  3. POLL PHASE. Here node looks for new I/O events and executes their callbacks, else, it leaves it as a pending callback.
  4. CHECK. Here setimmediate() callbacks would be executed
  5. CLOSE. It executes close event callbacks here
  6. EXIT. process.exit occurs if there are no remaining event handlers. Nodejs keeps track of open event listeners so it knows whatsup.

  // SECURITY
*/
server.listen(3000);
