export default function userOrganizations() {
  return {
    restrict: 'E',
    templateUrl: 'views/partials/filtered-list.html',
    controller: UserOrganizationsController,
    controllerAs: 'ListController',
    scope: {}
  };
}

// @ngInject
function UserOrganizationsController(
  baseControllerListClass, customerPermissionsService, usersService) {
  var controllerScope = this;
  var ControllerListClass = baseControllerListClass.extend({
    init: function() {
      this.service = customerPermissionsService;
      this.controllerScope = controllerScope;
      this.tableOptions = {
        disableSearch: true,
        noDataText: 'No organizations yet',
        noMatchesText: 'No organizations found matching filter.',

        columns: [
          {
            title: 'Organization name',
            className: 'all',
            render: function(row) {
              return row.customer_name;
            },
          },
          {
            title: 'Owner',
            className: 'text-center min-tablet-l',
            render: function(row) {
              var cls = (row.role === 'owner') && 'fa-check' || 'fa-minus';
              return '<a class="bool-field"><i class="fa {cls}"/></a>'.replace('{cls}', cls);
            },
            width: '50px'
          }
        ]
      };
      this._super();
    },
    getFilter: function() {
      return {
        user_url: usersService.currentUser.url
      };
    }
  });

  controllerScope.__proto__ = new ControllerListClass();
}
