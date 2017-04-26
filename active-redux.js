const R = require('ramda');
let store = {};

const initialiseStore = (s) => {
  store = s;
}

const Products = (products) => {
  return {
    min(propName){
      const res = R.reduce((a, b) => {
      return a[propName] < b[propName] ? a : b;
      
      }, {[propName]: Infinity}, R.values(products));      
      return res;
    },
    max(propName){
      const res = R.reduce((a, b) => {
      return a[propName] > b[propName] ? a : b;
      
      }, {[propName]: -Infinity}, R.values(products));      
      return res;
    },
    get length() { 
      return R.values(products).length
    }
  }
}

const Order = (order) => {
  return {
    get products(){
      return Products(store.entitities.products);
    }
  }
}

const Orders = (orders) => {
  return {
    get products(){
      return Products(store.entitities.products);
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
    }
  }
}

const Users = {
  findById(id) {
    return User(store.entitities.users[id]);
  }
};

module.exports = {
  Users,
  initialiseStore
};