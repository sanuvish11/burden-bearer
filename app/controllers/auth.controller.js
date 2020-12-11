const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


// Save User to Database
exports.signup = (req, res) => {
  const date = new Date().toISOString().
    replace(/T/, '').
    replace(/\..+/, '');

  const uid = ((req.body.username).slice(0, 3)) + date
  console.log(date)
  User.create({
    username: req.body.username,
    email: req.body.email,
    first_name: req.body.first_name,
    middle_name: req.body.middle_name,
    phone_no: req.body.phone_no,
    last_name: req.body.last_name,
    gender: req.body.gender,
    city: req.body.city,
    state: req.body.state,
    yob: req.body.yob,
    time_zone: req.body.time_zone,
    church_name: req.body.church_name,
    paster_name: req.body.paster_name,
    church_city: req.body.church_city,
    church_state: req.body.church_state,
    id_is_Active: 1,
    restricted: 0,
    created_by: req.body.created_by,
    modify_by: req.body.modify_by,
    password: bcrypt.hashSync(req.body.password, 8),
    u_id: uid
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// user login api
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (user.restricted == 0) {

        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
      }
      else {
        res.send("user not authorized to access")
      }
      //jwt token
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })

    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

//search user by username
exports.search = (req, res) => {
  if (req.body.username == "" || req.body.username == null) {
    res.send("no record");
  }
  else {
    User.findAll({
      where: {
        username: {
          [Op.like]: '%' + req.body.username + '%'
        }
      }
    })
      .then(user => {
        console.log(user);
        if (user.length == 0) {
          return res.send({ message: "User Not found." });
        }
        res.json({
          data: user.map(function (v) {
            return {
              user: v.username
            }
          })
        })
      });
  }
};
// update record using username
exports.update = (req, res) => {
  const username = req.body.username;
  User.update(req.body, {
    where: { username: username }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${username}. Maybe User was not found or req.body is empty!`
        });
      }
    }).catch(err => {
      res.status(500).send({
        message: "Error updating username with id=" + username
      });
    });
};