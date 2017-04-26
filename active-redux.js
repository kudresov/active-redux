const R = require('ramda');
let store = {};

const initialiseStore = (s) => {
  store = s;
}

class Record {
  constructor(){
  }

  max(propName) {
    const initValue = {[propName]: -Infinity};
    const res = R.reduce((a, b) => a[propName] > b[propName] ? a : b, initValue, this.all);      
    return res;
  }

  min(propName){
    const initValue = {[propName]: Infinity};
    const res = R.reduce((a, b) => a[propName] < b[propName] ? a : b, initValue, this.all);      
    return res;
  }

  get all(){
    return R.values(R.path(itemsPath, store));
  }
}

class Products extends Record{
  constructor(products){
    super();
    this._products = products;
  }

  min(propName){
    const initValue = {[propName]: Infinity};
    const res = R.reduce((a, b) => a[propName] < b[propName] ? a : b, initValue, R.values(this._products));      
    return res;
  }
  max(propName){
    const initValue = {[propName]: -Infinity};
    const res = R.reduce((a, b) => a[propName] > b[propName] ? a : b, initValue, R.values(this._products));      
    return res;
  }
  get length() { 
    return R.values(this._products).length
  }
}

const Order = (order) => {
  return {
    get products(){
      return new Products(store.entitities.products);
    }
  }
}

const Orders = (orders) => {
  return {
    get products(){
      return new Products(store.entitities.products);
    },
    get length(){
      return R.values(orders).length;
    }
  }
}

const User = (user) => {
  return {
    get orders(){
      return Orders(store.entitities.orders);
    },
    get name(){
      return user.name;
    },
  }
}

class Users extends Record {
  constructor(itemsPath){
    super();
    this._itemsPath = itemsPath;
  }

  findById(id) {
    return User(store.entitities.users[id]);
  }

  get all(){
    return R.values(R.path(this._itemsPath, store));
  }
}

Users.prototype = new Record();

module.exports = {
  Users: new Users(['entitities', 'users']),
  initialiseStore
};