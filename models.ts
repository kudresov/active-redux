import { registerModels, Records, Record } from './active-redux';

export class Products extends Records {
  
}

export class Order extends Record {
  get products() { return this.hasMany(Products) }
}

export class Orders extends Records { 
  get products() { return this.hasMany(Products) }
}

export class User extends Record{
  get orders() { return this.inverse(Orders); }
  // get fullName() { return `${this.name} ${this.surname}`; }
}

export class Users extends Records {
}

registerModels([Products, Orders, Order, Users, User]);