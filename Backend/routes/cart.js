// routes/cart.js
const express = require("express");
const router = express.Router();
const { getDb } = require("../db");
const verifyToken = require("../middleware/verifyToken");

// Add to cart
router.post("/add-to-cart", verifyToken, async (req, res) => {
    try {
        const db = await getDb();
        const { id, name, price, quantity, image } = req.body;
        const userEmail = req.user.email;

        // Find the user and update their cart
        const userCollection = db.collection("register");
        const user = await userCollection.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the item already exists in the cart
        const itemIndex = user.cart?.findIndex((item) => item.id === id);

        if (itemIndex >= 0) {
            // Update quantity if the item exists
            user.cart[itemIndex].quantity += quantity;
        } else {
            // Add new item to the cart
            user.cart = user.cart || [];
            user.cart.push({ id, name, price, quantity, image });
        }

        // Save the updated cart
        await userCollection.updateOne(
            { email: userEmail },
            { $set: { cart: user.cart } }
        );

        res.status(200).json({ message: "Item added to cart", cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error });
    }
});

// Fetch cart
router.get("/cart", verifyToken, async (req, res) => {
    try {
        const db = await getDb();
        const userEmail = req.user.email;

        const userCollection = db.collection("register");
        const user = await userCollection.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ cart: user.cart || [] });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error });
    }
});

// Update cart item quantity
router.put("/cart/:id", verifyToken, async (req, res) => {
    try {
        const db = await getDb();
        const { id } = req.params;
        const { quantity } = req.body;
        const userEmail = req.user.email;

        const userCollection = db.collection("register");
        const user = await userCollection.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const itemIndex = user.cart?.findIndex((item) => item.id === id);

        if (itemIndex >= 0) {
            user.cart[itemIndex].quantity = quantity;
            await userCollection.updateOne(
                { email: userEmail },
                { $set: { cart: user.cart } }
            );
            res.status(200).json({ message: "Cart updated", cart: user.cart });
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating cart", error });
    }
});

// Remove item from cart
router.delete("/cart/:id", verifyToken, async (req, res) => {
    try {
        const db = await getDb();
        const { id } = req.params;
        const userEmail = req.user.email;

        const userCollection = db.collection("register");
        const user = await userCollection.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.cart = user.cart?.filter((item) => item.id !== id) || [];
        await userCollection.updateOne(
            { email: userEmail },
            { $set: { cart: user.cart } }
        );

        res.status(200).json({ message: "Item removed from cart", cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: "Error removing item", error });
    }
});

module.exports = router;