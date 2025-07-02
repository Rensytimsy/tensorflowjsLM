import express from "express";
var app = express();
app.get("/", function (req, res) {
    res.send({ message: "Hello world from root endpoint" });
});
app.listen(3000, function () {
    console.log("http://localhost:3000");
});
