const activeReduxCreate = require('./active-redux');
let Users, Products, Orders, store;

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
        userId: 1,
        isPaid: false,
      },
      2: {
        id: 2,
        userId: 2,
        products: [3],
        isPaid: true,
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
      },
      3: {
        id: 3,
        name: 'orange',
        price: 0.75
      }
    }
  }
});

beforeEach(() => {
  store = createStore();
  const ar = activeReduxCreate(store);
  Users = ar.Users;
  Products = ar.Products;
  Orders = ar.Orders;
});

describe('User', () => {
  it('find user by id', () => {
    expect(Users.findById(1).name).toEqual('Vitalij');
  });

  it('user has correct number of poings', () => {
    expect(Users.findById(1).points).toEqual(23);
  });

  it('find another user by id', () => {
    expect(Users.findById(2).name).toEqual('Beata');
  });

  it('get at least one user order', () => {
    expect(Users.findById(1).orders.all.length).toEqual(1);
  });

  it('should allow to find user with highest points', () => {
    expect(Users.max('points').name).toEqual('Beata');
  })

  it('should find a user with least amount of points', () => {
    expect(Users.min('points').name).toEqual('Vitalij');
  })

  it('should return all Users', () => {
    expect(Users.all.length).toEqual(2);
  })

  it('should find by name', () => {
    expect(Users.findBy(u => u.name === 'Vitalij').name).toEqual('Vitalij');
  })
});

describe('Products', () => {
  it('should get user.order.products', () => {
    expect(Users.findById(1).orders.products.all.length).toEqual(2);
  });

  it('should find cheapest user.order.products', () => {
    expect(Users.findById(1).orders.products.min('price').price).toEqual(0.25);
  });

  it('should find the cheapest item in the order with 3 items', () => {
    const store = createStore();
    store.entitities.products[4] = ({name: 'onion', price: 0.1});
    store.entitities.orders[1].products.push(4);
    const { Users } = activeReduxCreate(store);
    expect(Users.findById(1).orders.products.min('price').price).toEqual(0.10);
  });

  it('should find most expensive item in the order', () => {
    expect(Users.findById(1).orders.products.max('price').price).toEqual(0.50);
  });

  it('should find total number of products', () => {
    expect(Products.all.length).toEqual(3);
  });
});

describe('Orders', () => {
  it('should get correct order count', () => {
    expect(Users.findById(1).orders.all.length).toEqual(1);
  });

  it('should find a total number of orders', () => {
    expect(Orders.all.length).toEqual(2);
  });

  it('should find order using predicate', () => {
    expect(Orders.findBy(o => o.id === 1).userId).toEqual(1);
  });

  it('should allow to select orders products', () => {
    expect(Orders.findBy(o => o.id === 1).products.all.length).toEqual(2);
  })
})