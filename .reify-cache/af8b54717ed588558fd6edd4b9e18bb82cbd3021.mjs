"use strict";module.export({inputValidator:()=>inputValidator,checkUserExists:()=>checkUserExists,postData:()=>postData});var joi;module.link('joi',{default(v){joi=v}},0);var jwt;module.link('jsonwebtoken',{default(v){jwt=v}},1);var short;module.link('short-uuid',{default(v){short=v}},2);var users;module.link('../models/dummyUsers.mjs',{users(v){users=v}},3);



const appSecreteKey = 'hksuua7as77hjvb348b3j2hbrbsc9923k';

function inputValidator(req, res, next) {
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
  if (result.error) {
    res.status(400).send({ message: result.error.details[0].message });
    return;
  }

  next();
}

function checkUserExists(req, res, next) {
  const user = users.find(u => u.data.email === req.body.email);
  if (user) {
    res.status(409).send({ message: `user ${user.data.email} already exists ` });
    return;
  }
  next();
}

function postData(req, res, next) {
  // token const
  const token = jwt.sign({ email: req.body.email }, appSecreteKey, { expiresIn: '1hr' });
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
}
