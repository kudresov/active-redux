const R = require('ramda');
const ars = {}

class Records {
  constructor(store, items){
    this._store = store;
    this._items = items ? items : store.entitities[this.getStorePropName()];
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
    return new RecordFunc(this._store, record);
  }

  findById(id) {
    const RecordFunc = this.getRecordFunc();
    return new RecordFunc(this._store, this._items[id]);
  }

  where(predicate) {
    const RecordsFunc = this.getRecordsFunc();
    return new RecordsFunc(this._store, R.filter(predicate, this._items));
  }

  get length(){
    return this.all.length;
  }

  get all(){
    return R.values(this._items);
  }

  getStorePropName(){
    return this.getClassName().toLowerCase();
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

  getRecordsFunc(){
    return ars[this.getClassName()];
  }

  hasMany(className){
    const propName = className.name.toLowerCase();
    // console.log(R.map(R.prop(propName), R.values(this._items)));
    const getOrderProducts = R.compose(
      R.map(id => this._store.entitities[propName][id]),
      R.flatten,
      R.map(R.prop(propName)),
      R.values);
    return new className(this._store, getOrderProducts(this._items));
  }
}

class Record {
  constructor(store, item) {
    this._store = store;
    this._item = item;
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
    return new className(this._store, R.map(p => this._store.entitities[propName][p], this._item[propName]));
  }

  inverse(className) {
    const propName = className.name.toLowerCase();
    const referenceId = this.constructor.name.toLowerCase() + 'Id';
    const items = R.filter(R.propEq(referenceId, this._item.id), R.values(this._store.entitities[propName]));
    return new className(this._store, items);
  }
}

const registerModel = (model) => {
  ars[model.name] = model;
}

const registerModels = (models) => {
  models.forEach(registerModel);
  return ars;
}

module.exports = {
  registerModel,
  registerModels,
  Records,
  Record,
}