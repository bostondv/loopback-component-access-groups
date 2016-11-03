'use strict';

const debug = require('debug')('loopback:component:access:utils');

module.exports = function getCurrentUserMixin(Model) {
  debug('initializing GetCurrentUser Mixin for model %s', Model.modelName);

  Model.getCurrentUser = function getCurrentUser(ctx) {
    const currentUser = ctx && ctx.req.currentUser || null;

    if (currentUser) {
      debug(`${Model.definition.name}.getCurrentUser() - currentUser: %o`, currentUser);
    } else {
      // this means its a server-side logic call w/o any HTTP req/resp aspect to it.
      debug(`${Model.definition.name}.getCurrentUser() - no loopback context`);
    }

    return currentUser;
  };
};
