"use strict";var express;module.link('express',{default(v){express=v}},0);var jwt;module.link('jsonwebtoken',{default(v){jwt=v}},1);var short;module.link('short-uuid',{default(v){short=v}},2);var joi;module.link('joi',{default(v){joi=v}},3);var jwtDecode;module.link('jwt-decode',{default(v){jwtDecode=v}},4);var users;module.link('../models/dummyUsers.mjs',{users(v){users=v}},5);








const router = express.Router();
const appSecreteKey = 'hksuua7as77hjvb348b3j2hbrbsc9923k';

// signup route
router.post('/auth/signup', (req, res, next) => {
  // joi validation shema
  const schema = {
    firstName: joi.string().min(3).required(),
    lastName: joi.string().min(3).required(),
    adress: joi.string().min(3).required(),
    password: joi.string().min(3).required(),
    email: joi.string().min(3).required(),
  };
  const result = joi.validate(req.body, schema);
  // input validation
  if (result.error) { res.status(400).send({ message: result.error.details[0].message }); }

  next();
},
  // check if user exists
  (req, res, next) => {
    const user = users.find(u => u.email === req.body.email);
    if (user) res.status(409).send({ message: `user ${user.email} already exists ` });

    next();
  },

  (req, res) => {
    // token const
    const token = jwt.sign({ email: req.body.email, password: req.body.password }, appSecreteKey, { expiresIn: '1hr' });
    const user = {
      status: 200,
      data: {
        id: short.generate(),
        token,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        adress: req.body.adress,
        isAdmin: false,
      },
    };
    users.push(user);
    res.status(201).send(user);
  },
);

// signin route
router.post('/auth/signin', (req, res, next) => {
  // token const
  const token = jwt.sign({ email: req.body.email }, appSecreteKey, { expiresIn: '1hr' });
  // check for the details existance
  const user = users.find(u => u.data.email === req.body.email);
  if (user.data.password !== req.body.password) {
    res.status(400).send({ message: 'Auth failed,invalid details' });
  } else {
    user.data.token = token;
    res.send(user);
  }
});

// admin routes

// admin verify user
router.patch('/:email/verify',(req, res, next) => {
    // check if user is admin
    const  token = req.headers.authorization;
    let  decoded = jwtDecode(token);
    const user = users.find(u => u.data.email === decoded.email);
    // check if admin
    if (user.data.isAdmin === true){
        user.data.status = "verified";
        res.send(user);
    } 
    next()
    }
  );

  // admin verify user
router.get('/',(req, res, next) => {
  // check if user is admin
  res.send(users);

  next()
  });


module.exportDefault(router);
