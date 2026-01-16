const express = require("express");
const router = express.Router();
const CartModel = require("../models/cartModel.js");
// Middleware that ensures user is logged in before accessing routes
const verifyAuthentication = require("../middleware/verifyAuthentication.js");

/*
  @route POST /cart/newCart
  @desc  Creates a new cart for the authenticated user.
         Each user can only have one cart.
*/
router.post("/newCart", verifyAuthentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const existingCart = await CartModel.findByUserId(userId);
    if (!existingCart) {
      const cart = await CartModel.create(userId);
      res.status(200).json("Cart created");
    } else {
      res.status(409).json("A cart is already created");
    }
  } catch (err) {
    next(err);
  }
});

/*
  @route POST /cart/deleteCart
  @desc  Creates a new cart for the authenticated user.
         Each user can only have one cart.
*/
router.post("/deleteCart", verifyAuthentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const existingCart = await CartModel.findByUserId(userId);
    if (existingCart) {
      const cart = await CartModel.delete(userId);
      res.status(200).json("Cart deleted");
    } else {
      res.status(409).json("There is no existing cart");
    }
  } catch (err) {
    next(err);
  }
});

/*
  @route GET /cart
  @desc  Retrieves the status of the authenticated user´s cart: total cost, number of itmes, creation date.
*/
router.get("/", verifyAuthentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await CartModel.findByUserId(userId);
    if (!cart) {
      return res.status(404).send("Cart not found");
    }
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
});

/*
  @route GET /cart/:cartId
  @desc  Retrieves the details of all the items in a cart by cartId
*/
router.get("/:cartId", verifyAuthentication, async (req, res, next) => {
  try {
    const cartId = req.params.cartId;
    const results = await CartModel.findByCartId(cartId);
    res.status(200).json({ cart:results });
  } catch (err) {
    next(err);
  }
});

/*
  @route PUT /cart/addItem/:cartId
  @desc  Adds a specific item to the authenticated user´s cart.
         If the item already exists in the cart, the model increments the quantity.
*/
router.put("/addItem/:itemId", verifyAuthentication, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const itemAdded = await CartModel.addItemToCart(itemId, userId);
    if (itemAdded) {
      res.status(200).json("Item added to cart");
    } else {
      res.status(404).json("Item cannot be added to cart");
    }
  } catch (err) {
    next(err);
  }
});

/*
  @route PUT /cart/deleteItem/:cartId
  @desc  Removes a specific item from the authenticated user´s cart.
         Depending on the model, the quantity is decremented or the item is removed from the cart completely.
*/
router.put(
  "/deleteItem/:itemId",
  verifyAuthentication,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const itemId = req.params.itemId;
      const itemDeleted = await CartModel.deleteItemFromCart(itemId, userId);
      if (itemDeleted) {
        res.status(200).json("Item deleted from cart");
      } else {
        res.status(404).json("Item cannot be deleted from cart");
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
