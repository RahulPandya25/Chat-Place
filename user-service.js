// user counts
let userCount = 0;
const incUserCount = () => ++userCount;
const decUserCount = () => --userCount;
const getUserCount = () => userCount;

let userList = [];
const addUser = (user) => userList.push(user);
const getUserList = () => userList;

module.exports = {
  incUserCount,
  decUserCount,
  getUserCount,
  addUser,
  getUserList,
};
