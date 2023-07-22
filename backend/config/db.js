const mongoose = require("mongoose").set("strictQuery", true);

//Connection URL
const connection_url =
  "mongodb+srv://Mehul:2319Mehul@shopon.81a6kze.mongodb.net/SHOPON?retryWrites=true&w=majority";

mongoose
  .connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log(err);
  });
