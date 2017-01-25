import template from './auth-login-failed.html';

const authLoginFailed = {
  template,
  controller: function AuthLoginFailedController(ncUtils) {
    // @ngInject
    const qs = ncUtils.parseQueryString(ncUtils.getQueryString());
    if (qs) {
      this.message = decodeURIComponent(qs.message);
    }
  }
};

export default authLoginFailed;
