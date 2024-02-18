export const Role = {
  SELLER: "seller",
  REGULAR_USER: "regular_user",
};

export const Permission = {
  BROWSE_PRODUCTS: "browse_products",
  VIEW_PRODUCT: "view_product",
  ADD_PRODUCT: "add_product",
  EDIT_PRODUCT: "edit_product",
  DELETE_PRODUCT: "delete_product",

  ADD_TO_CART: "add_to_cart",
  REMOVE_FROM_CART: "remove_from_cart",
  VIEW_CART: "view_cart",
  EMPTY_CART: "empty_cart",

  PLACE_ORDER: "place_order",
  BROWSE_ORDERS: "browse_orders",
  VIEW_ORDER: "view_order",
  DELETE_ORDER: "delete_order",
};

export const PermissionAssignment = {
  [Role.SELLER]: [
    Permission.BROWSE_PRODUCTS,
    Permission.VIEW_PRODUCT,
    Permission.ADD_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.DELETE_PRODUCT,
  ],
  [Role.REGULAR_USER]: [
    Permission.BROWSE_PRODUCTS,
    Permission.VIEW_PRODUCT,

    Permission.ADD_TO_CART,
    Permission.REMOVE_FROM_CART,
    Permission.VIEW_CART,
    Permission.EMPTY_CART,

    Permission.PLACE_ORDER,
    Permission.BROWSE_ORDERS,
    Permission.VIEW_ORDER,
    Permission.DELETE_ORDER,
  ],
};
