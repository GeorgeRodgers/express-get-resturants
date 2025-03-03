const { Router } = require(`express`);
const { Item, Menu, Restaurant } = require("../models/index")
const { check, validationResult } = require(`express-validator`) // added for Express Resturant Part 5

const restaurantRouter = Router();

restaurantRouter.get(`/`, async (req, res) => {
    const restaurants = await Restaurant.findAll({include: Menu}, { // added for Bonus Express Restaurants check with Haami
        include: Menu,
        include: [{
            model: Menu,
            include: [{
                model: Item
            }]
        }]
    }); 
    res.json(restaurants);
});

restaurantRouter.get(`/:id`, async (req, res) => {
    const id = req.params.id;
    const foundRestaurant = await Restaurant.findByPk(id);
    res.json(foundRestaurant);
});

// Updated for Express Restaurants Part 6
restaurantRouter.post(`/`, [
    check("name").not().isEmpty().trim(),
    check("location").not().isEmpty().trim(),
    check("cuisine").not().isEmpty().trim(),
    check("name").isLength({min: 10, max: 30})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json({errors: errors.array()});
    } else {
        const newRestaurant = await Restaurant.create(req.body);
        res.json(newRestaurant);
    };
});

restaurantRouter.put(`/:id`, async (req, res) => {
await Restaurant.update(req.body, {where: {id: req.params.id}});
const foundRestaurant = await Restaurant.findByPk(req.params.id);
res.json(foundRestaurant);
});

restaurantRouter.delete(`/:id`, async (req, res) => {
const foundRestaurant = await Restaurant.findByPk(req.params.id);
await foundRestaurant.destroy();
res.json(foundRestaurant);
});

module.exports = { restaurantRouter }