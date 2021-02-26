import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      let maxPrice = action.payload.map((item) => item.price);
      maxPrice = Math.max(...maxPrice);

      return {
        ...state,
        all_products: [...action.payload],
        filtered_products: [...action.payload],
        filters: {
          ...state.filters,
          max_price: maxPrice,
          price: maxPrice,
        },
      };
    case SET_GRIDVIEW:
      return {
        ...state,
        grid_view: true,
      };
    case SET_LISTVIEW:
      return {
        ...state,
        grid_view: false,
      };
    case UPDATE_SORT:
      return {
        ...state,
        sort: action.payload,
      };
    case SORT_PRODUCTS:
      const { sort, filtered_products } = state;
      let tmpProducts = [...filtered_products];

      if (sort === "price-lowest") {
        tmpProducts = tmpProducts.sort((a, b) => a.price - b.price);
      } else if (sort === "price-highest") {
        tmpProducts = tmpProducts.sort((a, b) => b.price - a.price);
      } else if (sort === "name-a") {
        tmpProducts = tmpProducts.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      } else if (sort === "name-z") {
        tmpProducts = tmpProducts.sort((a, b) => {
          return b.name.localeCompare(a.name);
        });
      } else {
        throw new Error(`unexpected sort method "${sort}" in filter reducer`);
      }

      return {
        ...state,
        filtered_products: tmpProducts,
      };
    case UPDATE_FILTERS:
      const { value, name } = action.payload;

      return { ...state, filters: { ...state.filters, [name]: value } };
    case FILTER_PRODUCTS:
      const { all_products } = state;
      const { text, category, company, color, price, shipping } = state.filters;

      let tempProducts = [...all_products];

      // text
      if (text) {
        tempProducts = tempProducts.filter((product) => {
          return product.name.toLowerCase().startsWith(text);
        });
      }

      // category
      if (category !== "all") {
        tempProducts = tempProducts.filter(
          (product) => product.category === category
        );
      }

      // company
      if (company !== "all") {
        tempProducts = tempProducts.filter(
          (product) => product.company === company
        );
      }

      // colors
      if (color !== "all") {
        tempProducts = tempProducts.filter((product) => {
          return product.colors.find((c) => c === color);
        });
      }

      // price
      tempProducts = tempProducts.filter((product) => product.price <= price);

      // shipping
      if (shipping) {
        tempProducts = tempProducts.filter(
          (product) => product.shipping === true
        );
      }

      return { ...state, filtered_products: tempProducts };
    case CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          text: "",
          company: "all",
          category: "all",
          color: "all",
          price: state.filters.max_price,
          shipping: false,
        },
      };
    default:
      throw new Error(`unexpected action "${action.type}" in filter reducer`);
  }
};

export default filter_reducer;
