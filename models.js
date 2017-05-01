const { registerModels, Records, Record } = require('./active-redux');

class Products extends Records {
  
}

class Order extends Record {
  get products() { return this.hasMany(Products); }
}

class Orders extends Records { 
  get products() { return this.hasMany(Products); }
}

class User extends Record{
  get orders() { return this.inverse(Orders); }
  get fullName() { return `${this.name} ${this.surname}`; }
}

class Users extends Records {
}

class Post extends Record {
  get author() { return this.hasOne(User, 'authorId'); }
}

class Posts extends Records {

}

module.exports = registerModels([Products, Orders, Order, Users, User, Posts, Post]);
