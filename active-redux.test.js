const { Products, Orders, Users, Posts } = require('./models');
const sinon = require('sinon');
let products, users, orders, posts;
let store;

const createStore = () => ({
  entitities: {
    profiles: {
      1: {
        notificationsEnabled: true,
        userId: 1,
      },
      2: {
        notificationsEnabled: false,
        userId: 2,
      }
    },
    posts: {
      1: {
        title: 'Intro to Active Redux',
        url: '/intro-to-active-redux',
        authorId: '1',
      }
    },
    users: {
      1: {
        id: 1,
        name: 'Vitalij',
        surname: 'Kudresov',
        points: 23,
        profileId: 1,
      },
      2: {
        id: 2,
        name: 'Beata',
        surname: 'Vaiciunate',
        points: 90,
        profileId: 2,
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
  products = new Products(store);
  users = new Users(store);
  orders = new Orders(store);
  posts = new Posts(store);
});

describe('User', () => {
  it('find user by id', () => {
    expect(users.findById(1).name).toEqual('Vitalij');
  });

  it('user has correct number of poings', () => {
    expect(users.findById(1).points).toEqual(23);
  });

  it('find another user by id', () => {
    expect(users.findById(2).name).toEqual('Beata');
  });

  it('get at least one user order', () => {
    expect(users.findById(1).orders.length).toEqual(1);
  });

  it('should allow to find user with highest points', () => {
    expect(users.max('points').name).toEqual('Beata');
  })

  it('should find a user with least amount of points', () => {
    expect(users.min('points').name).toEqual('Vitalij');
  })

  it('should return all users', () => {
    expect(users.length).toEqual(2);
  })

  it('should find by name', () => {
    expect(users.findBy(u => u.name === 'Vitalij').name).toEqual('Vitalij');
  })

  it('returns full name for computed properties', () => {
    expect(users.findById(1).fullName).toEqual('Vitalij Kudresov');
  });

  it.only('formats correctly a collection of Users', () => {
    var spy = sinon.spy({aa: function() {return 1}});
    const expectedResult = {"_item": {"id": 1, "name": "Vitalij", "points": 23, "profileId": 1, "surname": "Kudresov"}, "_store": "defined", "methods": ["orders", "profile", "fullName"]};
    expect(users.findById(1).format()).toEqual(expectedResult);
    // console.log(spy.lastCall);
  });

  it.skip('should have one profile', () => {
    expect(users.findById(1).profile.notificationsEnabled).toEqual(true);
  });
});

describe('Products', () => {
  it('should get user.order.products', () => {
    expect(users.findById(1).orders.products.length).toEqual(2);
  });

  it('should find cheapest user.order.products', () => {
    expect(users.findById(1).orders.products.min('price').price).toEqual(0.25);
  });

  it('should not call memoized function', () => {
    for (i = 0; i < 50; i++) { 
      expect(users.findById(1).orders.products.min('price').price).toEqual(0.25);
    }
  });

  it('should find the cheapest item in the order with 3 items', () => {
    const store = createStore();
    store.entitities.products[4] = ({name: 'onion', price: 0.1});
    store.entitities.orders[1].products.push(4);
    const users = new Users(store);
    expect(users.findById(1).orders.products.min('price').price).toEqual(0.10);
  });

  it('should find most expensive item in the order', () => {
    expect(users.findById(1).orders.products.max('price').price).toEqual(0.50);
  });

  it('should find total number of products', () => {
    expect(products.length).toEqual(3);
  });
});

describe('Orders', () => {
  it('should get correct order count', () => {
    expect(users.findById(1).orders.length).toEqual(1);
  });

  it('should find a total number of orders', () => {
    expect(orders.length).toEqual(2);
  });

  it('should find order using predicate', () => {
    expect(orders.findBy(o => o.id === 1).userId).toEqual(1);
  });

  it('should allow to select orders products', () => {
    expect(orders.findBy(o => o.id === 1).products.length).toEqual(2);
  })

  it('should allow to filter orders based on predicate', () => {
    expect(orders.where(o => o.isPaid).length).toEqual(1);
  });
})

describe('Posts', () => {
  it('should find Post`s author', () => {
    expect(posts.findById(1).author.name).toEqual('Vitalij');
  });
});