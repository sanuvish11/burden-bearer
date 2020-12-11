module.exports = (sequelize, Sequelize) => {
    const Registration = sequelize.define("Registration", {
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        first_name: {
            type: Sequelize.STRING
        },
        middle_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        gender: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        yob: {
            type: Sequelize.DATE
        },
        time_zone: {
            type: Sequelize.STRING
        },
        church_name: {
            type: Sequelize.STRING
        },
        paster_name: {
            type: Sequelize.STRING
        },
        phone_no: {
            type: Sequelize.STRING
        }, 
        church_city: {
            type: Sequelize.STRING
        },
        church_state: {
            type: Sequelize.STRING
        },
    });

    return Registration;
};
