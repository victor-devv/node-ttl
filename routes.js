const fs = require("fs");

// Connect app.js to routes.js

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");

    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();

      const message = parsedBody.split("=")[1];

      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html");

  res.write("<html>");
  res.write("<head><title>My First Node Page</title></head>");
  res.write("<body><h1>Hello from my Node.js Server!</h1></body>");
  res.write("</html>");

  res.end();
};

// EXPORT THE FUNCTION
// METHOD 1
module.exports = requestHandler;

// METHOD 2
// LETS SAY YOU WANNA EXPORT MORE THAN ONE

// module.exports = {
//   handler: requestHandler,
//   someText: "Some hard coded text",
// };

// METHOD 3
// module.exports.handler = requestHandler;
// module.exports.someText = 'Some hard coded text';

// METHOD 4 SHORTCUT
// exports.handler = requestHandler;
// exports.someText = 'Some hard coded text';
