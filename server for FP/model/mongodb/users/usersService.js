const User = require("./Users");

const registerUser = (userData) => {
  const user = new User(userData);
  return user.save();
};

const getUserByEmail = (email) => {
  return User.findOne({ email });
};

const getAllUsers = () => {
  return User.find();
};

const getUserById = (id) => {
  return User.findById(id);
};

const updatedUser = (id, userToUpdate) => {
  return User.findByIdAndUpdate(id, userToUpdate, {
    new: true,
  });
};
const updateAdminUser = (id) => {
  return User.findByIdAndUpdate(
    id,
    [{ $set: { isAdmin: { $eq: [false, "$isAdmin"] } } }],
    { new: true }
  );
};
const deleteUser = (id) => {
  return User.findByIdAndDelete(id);
};

module.exports = {
  registerUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateAdminUser,
  updatedUser,
  deleteUser,
};
