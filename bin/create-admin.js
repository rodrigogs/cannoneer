#!/usr/bin/env node

const { mongoose, logger } = require('../config');
const debug = require('debuggler')();

const User = require('../src/web/api/v1/user/user.api.v1.model');
const Role = require('../src/web/api/v1/role/role.api.v1.model');
const UserRole = require('../src/web/api/v1/userRole/userRole.api.v1.model');

const createUser = () => {
  const name = 'Administrator';
  const email = 'admin@admin.com';
  const about = 'System admin.';
  const username = 'admin';
  const password = 'admin';
  const active = true;

  return new User({
    name,
    email,
    about,
    username,
    password,
    active,
  }).save();
};

const createRule = () => {
  const name = 'Admin';
  const description = 'Full access';
  const ref = 'ADMIN';

  return new Role({
    name,
    description,
    ref,
  }).save();
};

const createUserRole = (user, role) => {
  const type = 'RW';

  return new UserRole({
    user,
    role,
    type,
  }).save();
};

const execute = async () => {
  debug('creating admin user');

  await mongoose();

  const user = await createUser();
  const role = await createRule();

  await createUserRole(user, role);
};

execute()
  .then(() => logger.info('Done!'))
  .catch(logger.error);
