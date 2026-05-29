const express = require("express");
const auth = require("../middleware/auth");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/userController");

const router = express.Router();

// PUBLIC ROUTES
router.post("/", createUser);
router.post("/login", loginUser);

// PROTECTED ROUTES
router.get("/", auth, getUsers);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

module.exports = router;
