(function() {
  angular.module('ncsaas')
    .controller('KeyAddController', ['baseControllerAddClass', 'keysService', '$state', '$q', KeyAddController]);

  function KeyAddController(baseControllerAddClass, keysService, $state, $q) {
    var controllerScope = this;
    var Controller = baseControllerAddClass.extend({
      init: function() {
        this.service = keysService;
        this.controllerScope = controllerScope;
        this._super();
        this.listState = 'profile.details';
      },
      successRedirect: function() {
        $state.go('profile.details', {tab: 'keys'});
      },
      save: function() {
        if (this.instance.name) {
          return this._super();
        } else {
          if (this.instance.public_key) {
            var key = this.instance.public_key.split(' ');
            if (key[2]) {
              this.instance.name = key[2].trim();
              return this._super();
            } else {
              this.errors = {name: ['This field may not be blank.']};
            }
          } else {
            this.errors = {public_key: ['This field may not be blank.']};
          }
        }
        return $q.reject();
      }
    });

    controllerScope.__proto__ = new Controller();
  }
})();
