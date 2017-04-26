const { Users, initialiseStore } = require('./active-redux');

let store;

beforeEach(() => {
  store = {
    entitities: {
      users: {
        1: {
          id: 1,
          name: 'Vitalj'
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

it('should find cheapest prodcut in the order', () => {
  initialiseStore(store);
  expect(Users.findById(1).orders.products.min('price')).toEqual(0.25);
});

it('should find the cheapest item in the order with 3 items', () => {
  store.entitities.products[3] = ({name: 'onion', price: 0.1});
  initialiseStore(store);
  expect(Users.findById(1).orders.products.min('price')).toEqual(0.10);
});

it('should find most expensive item in the order', () => {
  initialiseStore(store);
  expect(Users.findById(1).orders.products.max('price')).toEqual(0.50);
});
