const activeReduxCreate = require('./active-redux');

const createStore = () => ({
  entitities: {
    users: {
      1: {
        id: 1,
        name: 'Vitalij',
        points: 23,
      },
      2: {
        id: 2,
        name: 'Beata',
        points: 90,
      }
    },
    orders: {
      1: {
        id: 1,
        products: [1, 2],
        user: 1
      }
    },
    products: {
      1: {
        id: 1,
        name: 'apple',
        price: 0.25
      },
      2: {
        id: 2,
        name: 'kiwi',
        price: 0.5
      }
    }
  }
});

const createAr = (store) => {
  const activeRedux = activeReduxCreate(store);
  return activeRedux.Users;
}

describe('User', () => {
  it('find user by id', () => {
    const store = createStore();
    const Users = createAr(store);
    expect(Users.findById(1).name).toEqual('Vitalij');
  });

  it('find another user by id', () => {
    const store = createStore();
    const Users = createAr(store);
    expect(Users.findById(2).name).toEqual('Beata');
  });

  it('get at least one user order', () => {
    const store = createStore();
    const Users = createAr(store);
    expect(Users.findById(1).orders.length).toEqual(1);
  });

  it('should allow to find user with highest points', () => {
    const store = createStore();
    const Users = createAr(store);
    expect(Users.max('points').name).toEqual('Beata');
  })

  it('should find a user with least amount of points', () => {
    const store = createStore();
    const Users = createAr(store);
    expect(Users.min('points').name).toEqual('Vitalij');
  })

  it('should return all Users', () => {
    const store = createStore();
    const Users = createAr(store);
    expect(Users.all.length).toEqual(2);
  })
});

describe('Products', () => {
  it('should get order products', () => {
    const store = createStore();
    const Users = createAr(store);
    expect(Users.findById(1).orders.products.length).toEqual(2);
  });

  it('should find cheapest product in the order', () => {
    const store = createStore();
    const Users = createAr(store)  ;
    expect(Users.findById(1).orders.products.min('price').price).toEqual(0.25);
  });

  it('should find the cheapest item in the order with 3 items', () => {
    const store = createStore();
    store.entitities.products[3] = ({name: 'onion', price: 0.1});
    const Users = createAr(store);
    expect(Users.findById(1).orders.products.min('price').price).toEqual(0.10);
  });

  it('should find most expensive item in the order', () => {
    const store = createStore();
    const Users = createAr(store);
    expect(Users.findById(1).orders.products.max('price').price).toEqual(0.50);
  });
});

describe('Orders', () => {
  it('should get correct order count', () => {
  const store = createStore();
  const Users = createAr(store);
  // expect()
  });
})