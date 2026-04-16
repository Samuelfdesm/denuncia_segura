const Sequelize = require("sequelize");

// const connection = new Sequelize("quiz", "quiz", "yrsZo1XsAFGgZO72gbzK5fuyW9XhKf7pGJqtc03tNlA=", {
//     host: "159.223.186.117",
//     dialect: "mysql"
// });

const connection = new Sequelize("quiz", "root", "as,k71l;", {
    host: "localhost",
    dialect: "mysql"
});


module.exports = connection;
