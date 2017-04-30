#!/usr/bin/env node
const repl = require("repl");
const { Products, Orders, Users } = require('./models');

var replServer = repl.start({
  prompt: "iar > ",
});

replServer.context.Products = Products;
replServer.context.Orders = Orders;
replServer.context.Users = Users;
