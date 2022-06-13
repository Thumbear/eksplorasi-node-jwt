const express = require('express');  
const app = express(); 
const mongooseDB = require('./connection');

// import the router
const authRouter = require("./routes/auth.js");
const postsRouter = require("./routes/posts.js");

// midleware
app.use(express.json());


// route middleware
app.use("/api/user", authRouter);
app.use("/api/posts", postsRouter);

app.listen(5001, () => {
    console.log("Server is running on port 5001");
}) 
