var express = require("express");
var app = express();
let bodyParser = require("body-parser");

//7. Implement a Root-Level Request Logger Middleware ---> middleware function
//ditaruh di atas karena ingin menjalankan ini  dukuan dan karena ada "next()" maka akan mengeksekusi middleware selanjutnya
app.use((request, response, next) => {
  console.log(request.method + " " + request.path + " - " + request.ip);
  next();
});

//11.Use body-parser to Parse POST Requests --> install dulu body-parser di package.json (npm install body-parser)
//di sini klik tools -> terminal -> npm install body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// 1. meet the node console
console.log("Hello World");

// 2. menambahkan string hello express ke PATH: /root ---> ("/")
// app.get("/", (request, response) => {
//   response.send("Hello Express");
// });

//3. serve an HTML file --> Send the /views/index.html file as a response to GET requests to the / path.
// biar bisa jalan, nomor 2 harus di comment out dulu
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

//4. serve static assets --> Mount the express.static() middleware to the path /public with app.use().
// The absolute path to the assets folder is __dirname + /public.
// Biar assets di dalam folder "/public" terpakai
// no 2 di comment out no 3 jangan

app.use("/public", express.static(__dirname + "/public"));

//5. Serve JSON on a Specific Route
//menyajikan JSON object dengan node
//nanti di https://...../json akan keluar isi json. // 2 di comment out
// app.get("/json", (request, response) => {
//   response.json({
//     message: "Hello json"
//   });
// });

//6. Add an environment variable as a configuration option. .env adalah hidden file yg gabisa dilihat selain kita
// Harus install packages 'dotenv' di npm, di sini udah ada dari glith jd gaperlu
// no 5 di comment out ya baru bisa
app.get("/json", (request, response) => {
  if (process.env.MESSAGE_STYLE === "uppercase") {
    response.json({
      message: "HELLO JSON"
    });
  } else {
    response.json({
      message: "Hello json"
    });
  }
});

//8. Chain Middleware to Create a Time Server
// walaupun bisa di mount di luar dan proses tetap sama (jika ada next(), seperti nomor 7, terus bisa run nomor 3,4 dst),
// middleware juga bisa di chain atau di dalam satu fungsi kayak gini:
app.get(
  "/now",
  (request, response, next) => {
    request.time = new Date().toString();
    next();
  },
  (request, response) => {
    response.json({
      time: request.time
    });
  }
);

//9. Get Route Parameter Input from the Client
//Route parameters are named segments of the URL, delimited by slashes (/).
//Each segment captures the value of the part of the URL which matches its position.
//The captured values can be found in the req.params object.
//Jadi, kita bisa mengizinkan users untuk akses API mana yang dia mau dari kita, contoh: https//:fjr.com/blabla/blabli/blablu
app.get("/:word/echo", (request, response) => {
  response.json({
    echo: request.params.word
  });
});

//10. Get Query Parameter Input from the Client
//Selain pakai '/', bisa pakai string dimana delimited by a question mark (?),
//and includes field=value couples. Each couple is separated by an ampersand (&).
//contoh: https://www.youtube.com/watch?v=gFfQXY1lYoM&list=PLhGp6N0DI_1SdIZ3uhbXnKAq2UcICSnWS&index=11
//di bawah ini contoh mau buat https://.../name?first=<firstname>&last=<lastname>
//bole dicobs nulis https://learn-basic-node-express-fcc.glitch.me/name?first=fajriawan&last=sutansa
app.get("/name", (request, response) => {
  let urlstring = request.query.first + " " + request.query.last;
  response.json({
    name: urlstring
  });
});

//12. Get Data from POST Requests
//Coba run https://learn-basic-node-express-fcc.glitch.me, terus ini first and last name nya
//nanti akan POST data dan menampilkan json sesuai tampilan di bawah (yaitu: {name: first last})
app.post(
  "/name",
  bodyParser.urlencoded({ extended: false }),
  (request, response) => {
    let urlstring = request.body.first + " " + request.body.last;
    response.json({
      name: urlstring
    });
  }
);

module.exports = app;
