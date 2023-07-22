const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Products = require("./models/Products");
const Orders = require("./models/Orders");
const Users = require("./models/User");
require("./config/db");
const stripe = require("stripe")(
  "sk_test_51N0KKTSCFoL1WO2FRyU2vFNxDYQ6Z7KIdHA1dHpJ5BeiMz6sgwE6AjYmk39KZ9wQkT7teyADvu2HwPXmeSHRTM0P00eu6myiVO"
);

const app = express();
const port = 8080;

//Middlewares
app.use(express.json());
app.use(cors());

//API
app.get("/", (req, res) => res.status(200).send("Home Page"));

//Add product
app.post("/products/add", (req, res) => {
  const productDetail = req.body;

  console.log(productDetail);

  Products.create(productDetail, (err, data) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/products/get", (req, res) => {
  Products.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// API for SIGNUP

app.post("/auth/signup", async (req, res) => {
  const { email, password, fullName } = req.body;

  const encrypt_password = await bcrypt.hash(password, 10);

  const userDetail = {
    email: email,
    password: encrypt_password,
    fullName: fullName,
  };

  const user_exist = await Users.findOne({ email: email });

  if (user_exist) {
    res.send({ message: "The Email is already in use !" });
  } else {
    Users.create(userDetail, (err, result) => {
      if (err) {
        res.status(500).send({ message: err.message });
      } else {
        res.send({ message: "User Created Succesfully" });
      }
    });
  }
});

// API for LOGIN

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const userDetail = await Users.findOne({ email: email });

  if (userDetail) {
    if (await bcrypt.compare(password, userDetail.password)) {
      res.send(userDetail);
    } else {
      res.send({ error: "Invaild Password" });
    }
  } else {
    res.send({ error: "User does not exist" });
  }
});

//API for payment
app.post("/payment/create", async (req, res) => {
  const total = req.body.amount;

  console.log(total);

  const payment = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: "inr",
  });

  res.status(201).send({
    clientSecret: payment.client_secret,
  });
});

//API to add order details
app.post("/orders/add", (req, res) => {
  const products = req.body.basket;
  const price = req.body.price;
  const email = req.body.email;
  const address = req.body.address;

  const orderDetail = {
    products: products,
    price: price,
    address: address,
    email: email,
  };

  Orders.create(orderDetail, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
});

app.post("/orders/get", (req, res) => {
  const email = req.body.email;

  Orders.find((err, result) => {
    if (err) {
      console.log(err);
    } else {
      const userOrders = result.filter((order) => order.email === email);
      res.send(userOrders);
    }
  });
});

app.listen(port, () => console.log(`Server running on port : ${port}`));
