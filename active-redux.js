const R = require('ramda');

class Records {
  constructor(items){
    this._items = items;
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
    return R.values(this._items);
  }
}

class Products extends Records{
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
  get all(){
    return R.values(R.path(this._itemsPath, store));
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

const Orders = (orders, store) => {
  return {
    get products(){
      return new Products(store.entitities.products);
    },
    get length(){
      return R.values(orders).length;
    }
  }
}

const User = (user, store) => {
  return {
    get orders(){
      return Orders(store.entitities.orders, store);
    },
    get name(){
      return user.name;
    },
  }
}

class Users extends Records {
  constructor(items, store){
    super(items);
    this._items = items;
    this._store = store;
  }

  findById(id) {
    return User(this._items[id], this._store);
  }
}

module.exports = (store) => ({
  Users: new Users(store.entitities.users, store)
});