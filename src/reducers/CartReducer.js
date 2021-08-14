const initialState = {
  products: [],
  total: 0,
};

const CartReducer = (state = initialState, action) => {
  console.log(state, action);

  switch (action.type) {
    case "ADD_PRODUCT":
      let newTotal = state.total + parseInt(action.product.price);

      return {
        ...state,
        products: [...state.products, action.product],
        total: newTotal,
      };
    case "REMOVE_PRODUCT":
      const index = state.products.findIndex(
        (product) => product.product.itemId === action.product.itemId
      );
      console.log(index);

      let newCart = [...state.products];
      let total = state.total - parseInt(action.product.price);

      if (index > -1) {
        newCart.splice(index, 1);
      } else {
        console.log("item not found");
      }

      return { ...state, products: newCart, total: total };

    default:
      return initialState;
  }
};

export default CartReducer;
