'use strict';

(function() {
  angular.module('ncsaas')
    .service('hooksService', ['baseServiceClass', 'ENV', hooksService]);

  function hooksService(baseServiceClass, ENV) {
    var endpoints = {
      'email': '/hooks-email/',
      'webhook': '/hooks-web/',
    };

    var ServiceClass = baseServiceClass.extend({
      init:function() {
        this._super();
        this.endpoint = '/hooks/';
      },
      getUrlByType: function(hook_type) {
        return ENV.apiEndpoint + 'api' + endpoints[hook_type];
      },
      getTypes: function() {
        return Object.keys(endpoints);
      },
      create: function(url, options) {
        var instance = this.$create(url);
        this.cleanupOptions(options, instance);
        return instance.$save();
      },
      update: function(url, options) {
        var data = {};
        this.cleanupOptions(options, data);
        return this.$update(null, url, data);
      },
      cleanupOptions: function(input, output) {
        var fields = ['is_active', 'event_types', 'email', 'destination_url'];
        for(var i in fields) {
          var field = fields[i];
          if (input[field] != undefined) {
            output[field] = input[field];
          }
        }
      }
    });
    return new ServiceClass();
  }

})();
