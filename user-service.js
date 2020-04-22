// user counts
let userCount = 0;
const incUserCount = () => ++userCount;
const decUserCount = () => --userCount;
const getUserCount = () => userCount;

module.exports = {
  incUserCount,
  decUserCount,
  getUserCount,
};
