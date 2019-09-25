const users = [
  {
    id: "1",
    firstName: "Maurice",
    lastName: "Moss",
    email: "maurice@moss.com",
    password: "abcdefg"
  },
  {
    id: "2",
    firstName: "Roy",
    lastName: "Trenneman",
    email: "roy@trenneman.com",
    password: "imroy"
  }
];

export default {
  getUsers: () => users,
  findById: id => users.find(us => us.id === id),
  addUser: user => users.push(user)
};
