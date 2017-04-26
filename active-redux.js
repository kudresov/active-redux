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

  min(propName) {
    const initValue = {[propName]: Infinity};
    const res = R.reduce((a, b) => a[propName] < b[propName] ? a : b, initValue, this.all);      
    return res;
  }

  findBy(predicate){
    return R.find(predicate, this.all);
  }

  get all(){
    return R.values(this._items);
  }
}

class Products extends Records{
  constructor(items, store) {
    super(items);
    this._items = items;
  }
}

class Orders extends Records{ 
  constructor(items, store) {
    super(items);
    this._items = items;
    this._store = store;
  }

  get products(){
    const getOrderProducts = R.compose(
      R.map(id => this._store.entitities.products[id]),
      R.flatten,
      R.map(R.prop('products')),
      R.values);
    return new Products(getOrderProducts(this._items));
  }
}

const User = (user, store) => {
  return {
    get orders(){
      return new Orders(store.entitities.orders, store);
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