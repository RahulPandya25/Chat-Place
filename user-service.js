// user counts
let userCount = 0;
const incUserCount = () => ++userCount;
const decUserCount = () => --userCount;
const getUserCount = () => userCount;

let userList = [];
const addUser = (user) => userList.push(user);
const getUserList = () => userList;
const removeUserFromList = (user) => {
  userList = userList.filter(function (element) {
    return element != user;
  });
};

let conversations = [];
const addConvo = (convo) => conversations.push(convo);
const getConvo = () => conversations;

module.exports = {
  incUserCount,
  decUserCount,
  getUserCount,
  addUser,
  getUserList,
  removeUserFromList,
  addConvo,
  getConvo,
};
