const R = require('ramda');

let ars = {}

class Records {
  constructor(items, store){
    this._items = items;
    this._store = store;
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
    const RecordFunc = this.getRecordFunc();
    const record = R.find(predicate, this.all);
    return new RecordFunc(record, this._store);
  }

  findById(id) {
    const RecordFunc = this.getRecordFunc();
    return new RecordFunc(this._items[id], this._store);
  }

  get all(){
    return R.values(this._items);
  }

  getClassName(){
    return Object.getPrototypeOf(this).constructor.name;
  }

  getRecordClassName(){
    return this.getClassName().substring(0, this.getClassName().length - 1);
  }

  getRecordFunc(){
    return ars[this.getRecordClassName()];
  }

  hasMany(className){
    const propName = className.name.toLowerCase();
    const getOrderProducts = R.compose(
      R.map(id => this._store.entitities[propName][id]),
      R.flatten,
      R.map(R.prop(propName)),
      R.values);
    return new Products(getOrderProducts(this._items), this._store);
  }
}

class Record {
  constructor(item, store) {
    this._item = item;
    this._store = store;
    this.setupProps();
  }

  setupProps() {
    for(let key of Object.keys(this._item)) {
      const parentKeys = Object.getOwnPropertyNames(this.__proto__);
      if(!R.contains(key, parentKeys)) {
        Object.defineProperty(this, key, {
          get: () => this._item[key],
          configurable: true,
          enumerable: true,
        });
      }
    }
  }

  hasMany(className) {
    const propName = className.name.toLowerCase();
    return new className(R.map(p => this._store.entitities[propName][p], this._item[propName]), this._store);
  }

  inverse(className) {
    const propName = className.name.toLowerCase();
    const referenceId = this.constructor.name.toLowerCase() + 'Id';
    const items = R.filter(R.propEq(referenceId, this._item.id), R.values(this._store.entitities[propName]));
    return new className(items, this._store);
  }
}

class Products extends Records {

}

class Order extends Record {
  get products() { return this.hasMany(Products) }
}

class Orders extends Records { 
  get products() { return this.hasMany(Products) }
}

class User extends Record{
  get orders() { return this.inverse(Orders) }
}

class Users extends Records {
}

ars = {
  Users,
  User,
  Orders,
  Order,
  Products,
}

module.exports = (store) => ({
  Users: new Users(store.entitities.users, store),
  Orders: new Orders(store.entitities.orders, store),
  Products: new Products(store.entitities.products, store)
});