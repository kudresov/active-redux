const R = require('ramda');
const ars = {};

function recordInverse(ctor) {
  const className = ctor.name.toLowerCase();
  const referenceId = this.constructor.name.toLowerCase() + 'Id';
  const items = R.filter(R.propEq(referenceId, this._item.id), R.values(this._store.entitities[className]));
  return new ctor(this._store, items);
}

function recordHasMany(ctor) {
  const className = ctor.name.toLowerCase();
  return new ctor(this._store, R.map(p => this._store.entitities[className][p], this._item[className]));
}

function belongsTo(ctor, ref) {
  const className = ctor.name.toLowerCase() + 's';
  const recordId = this[ref];
  return new ctor(this._store, this._store.entitities[className][recordId]);
};

function Record(store, item) {
  this._store = store;
  this._item = item;
  this.inverse = R.memoize(recordInverse);
  this.hasMany = R.memoize(recordHasMany);
  this.belongsTo = R.memoize(belongsTo);

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

Record.prototype.getParentMethods = function() {
  return R.filter(p => p !== 'constructor', Object.getOwnPropertyNames(this.__proto__));
}

Record.prototype.format = function() {
  return {
    _store: this._store ? 'defined' : 'undefined',
    _item: this._item,
    methods: this.getParentMethods()
  };
}


class Records {
  constructor(store, items){
    this._store = store;
    this._items = items ? items : store.entitities[this.getStorePropName()];
    this.findById = R.memoize((id) => {
      const RecordFunc = this.getRecordFunc();
      return new RecordFunc(this._store, this._items[id]);
    });

    this.hasMany = R.memoize((className) => {
      const propName = className.name.toLowerCase();
      const getOrderProducts = R.compose(
          R.map(id => this._store.entitities[propName][id]),
          R.flatten,
          R.map(R.prop(propName)),
          R.values);
        return new className(this._store, getOrderProducts(this._items));
    });
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

  // findById(id) {
  //   const RecordFunc = this.getRecordFunc();
  //   return new RecordFunc(this._store, this._items[id]);
  // }

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
    const getOrderProducts = R.compose(
      R.map(id => this._store.entitities[propName][id]),
      R.flatten,
      R.map(R.prop(propName)),
      R.values);
    return new className(this._store, getOrderProducts(this._items));
  }

  getParentMethods() {
    return R.filter(p => p !== 'constructor', Object.getOwnPropertyNames(this.__proto__));
  }

  format() {
    return {
      _store: this._store ? 'defined' : 'undefined',
      _items: this._items,
      methods: this.getParentMethods(),
      coreMethods: ['min', 'max', 'findBy', 'findById', 'where', 'all', 'length']
    };
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