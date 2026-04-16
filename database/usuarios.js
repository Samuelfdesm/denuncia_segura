const Sequelize = require("sequelize");
const connection = require("./database");

const Questions = connection.define("questions", {
    question_name:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    difficulty_level:{
        type: Sequelize.ENUM('fácil', 'médio', 'difícil'),
        allowNull: false
    }
});

Questions.sync({force: false}).then(() => {});

module.exports = Questions;