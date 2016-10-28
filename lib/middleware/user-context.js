'use strict';

const debug = require('debug')('loopback:component:access:context');
const Promise = require('bluebird');

module.exports = function userContextMiddleware() {
  debug('initializing user context middleware');
  // set current user to enable user access for remote methods
  return function userContext(req, res, next) {
    if (!req.accessToken) {
      debug('No access token found');
      return next();
    }

    const app = req.app;
    const UserModel = app.accessUtils.options.userModel || 'User';

    return Promise.join(
      app.models[UserModel].findById(req.accessToken.userId),
      app.accessUtils.getUserGroups(req.accessToken.userId),
      (user, groups) => {
        if (!user) {
          return next(new Error('No user with this access token was found.'));
        }
        req.currentUser = user;
        req.currentGroups = groups;
        debug('currentUser', user);
        debug('currentGroups', groups);
        return next();
      })
      .catch(next);
  };
};
