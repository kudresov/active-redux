let store = {};

const initialiseStore = (store) => {
  this.store = store;
}

const Users = {
  findById() {
    return {
      orders: {
        products: {
          min() {
            return 0.25;
          },
          max() {
            return 0.5;
          }
        }
      }
    }
  }
};

module.exports = {
  Users,
  initialiseStore
};