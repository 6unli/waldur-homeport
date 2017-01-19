import template from './auth-init.html';

export const authInit = {
  template,
  controller: class AuthInitController {
    constructor(usersService, $state, ENV, ncUtilsFlash) {
      // @ngInject
      this.usersService = usersService;
      this.$state = $state;
      this.ncUtilsFlash = ncUtilsFlash,
      this.user = {};
      this.pageTitle = ENV.shortPageTitle;
    }

    $onInit() {
      this.loading = true;
      this.usersService.getCurrentUser().then(user => {
        this.user = user;
      }).finally(() => {
        this.loading = false;
      });
    }

    save({ user }) {
      return this.usersService.update(user).then(response => {
        this.usersService.currentUser = response.data;
        this.$state.go('profile.details');
      }).catch(response => {
        this.ncUtilsFlash.error('Unable to save user');
        if (response.status === 400) {
          this.errors = response.data;
        }
      });
    }
  }
};
