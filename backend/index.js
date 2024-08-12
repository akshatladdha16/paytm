const express = require("express");
const app =express();
const mainRouter=require('./routes/index')

app.use("/api/v1/user",mainRouter); // to maintain different api routes in future