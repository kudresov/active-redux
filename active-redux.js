const R = require('ramda');

let ars = {}

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
}

class Products extends Records{
  constructor(items, store) {
    super(items);
    this._items = items;
  }
}

class Order {
  constructor(item, store) {
    this._item = item;
    this._store = store;
  }

  get products() {
    return new Products(R.map(p => this._store.entitities.products[p], this._item.products));
  }

  get value() {
    return this._item;
  }
}

class Orders extends Records { 
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
    return new Products(getOrderProducts(this._items), this._store);
  }
}

class User {
  constructor(item, store) {
    this._item = item;
    this._store = store;
  }

  get orders(){
    const getUserOrders = R.filter(R.propEq('userId', this._item.id), R.values(this._store.entitities.orders));
    
    return new Orders(getUserOrders, this._store);
  }

  get value(){
    return this._item;
  }
}

class Users extends Records {
  constructor(items, store){
    super(items);
    this._items = items;
    this._store = store;
  }
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