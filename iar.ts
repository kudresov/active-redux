#!/usr/bin/env node
import repl from 'repl';
import { Products, Orders, Users } from './models';

var replServer = repl.start({
  prompt: "iar > ",
});

replServer.context.Products = Products;
replServer.context.Orders = Orders;
replServer.context.Users = Users;
