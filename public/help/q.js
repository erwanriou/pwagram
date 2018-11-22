const express = require("express");
const passport = require("passport");

const Entity = require("../../models/Entity");
const User = require("../../models/User");
const router = express.Router();

// @route  GET api/q/entities
// @desc   Get entities list
// @access Private
router.get(
  "/entities",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const entities = await Entity.find();
    res.send(entities);
  }
);

// @route  POST api/q/create-entity
// @desc   Create an entity
// @access Private
router.post(
  "/create-entity",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let newEntity;
    req.user.authorities.includes("ROLE_ADMIN") === false
      ? (valid = res.status(403).json({
          error: "You doesnt have admin right to create a new entity"
        }))
      : (newEntity = new Entity({
          ...req.body,
          _user: req.user.id
        }));
    try {
      await newEntity.save();
      res.json({ post: "Entity created with success!" });
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

module.exports = router;
