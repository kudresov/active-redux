const { Users, initialiseStore } = require('./active-redux');

let store;

beforeEach(() => {
  store = {
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
  }
});

describe('User', () => {
  it('find user by id', () => {
    initialiseStore(store);
    expect(Users.findById(1).name).toEqual('Vitalij');
  });

  it('find another user by id', () => {
    initialiseStore(store);
    expect(Users.findById(2).name).toEqual('Beata');
  });

  it('get at least one user order', () => {
    initialiseStore(store);
    expect(Users.findById(1).orders.length).toEqual(1);
  });

  it('should allow to find user with highest points', () => {
    initialiseStore(store);
    expect(Users.max('points').name).toEqual('Beata');
  })

  it('should find a user with least amount of points', () => {
    initialiseStore(store);
    expect(Users.min('points').name).toEqual('Vitalij');
  })

  it('should return all Users', () => {
    expect(Users.all.length).toEqual(2);
  })
});

describe('Products', () => {
  it('should get order products', () => {
    initialiseStore(store);
    expect(Users.findById(1).orders.products.length).toEqual(2);
  });

  it('should find cheapest product in the order', () => {
    initialiseStore(store);  
    expect(Users.findById(1).orders.products.min('price').price).toEqual(0.25);
  });

  it('should find the cheapest item in the order with 3 items', () => {
    store.entitities.products[3] = ({name: 'onion', price: 0.1});
    initialiseStore(store);
    expect(Users.findById(1).orders.products.min('price').price).toEqual(0.10);
  });

  it('should find most expensive item in the order', () => {
    initialiseStore(store);
    expect(Users.findById(1).orders.products.max('price').price).toEqual(0.50);
  });
});
