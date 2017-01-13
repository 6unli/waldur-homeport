const openstackSubnetsList = {
  bindings: {
    resource: '<'
  },
  templateUrl: 'views/partials/filtered-list.html',
  controller: OpenstackSubnetsListController,
  controllerAs: 'ListController',
};

// @ngInject
function OpenstackSubnetsListController(
  baseResourceListController, openstackSubnetsService) {
  var controllerScope = this;
  var controllerClass = baseResourceListController.extend({
    init: function() {
      this.controllerScope = controllerScope;
      this._super();
      this.service = openstackSubnetsService;
      this.rowFields.push('cidr');
    },
    getTableOptions: function() {
      var options = this._super();
      var vm = this;
      options.noDataText = 'No subnets yet.';
      options.noMatchesText = 'No subnets found matching filter.';
      options.columns = [
        {
          title: 'Name',
          className: 'all',
          render: function(row) {
            return vm.renderResourceName(row);
          }
        },
        {
          title: 'CIDR',
          className: 'min-tablet-l',
          render: function(row) {
            return row.cidr;
          }
        },
        {
          title: 'State',
          className: 'min-tablet-l',
          render: function(row) {
            return vm.renderResourceState(row);
          }
        }
      ];

      return options;
    },
    getFilter: function() {
      return {
        network_uuid: controllerScope.resource.uuid
      };
    },
    getTableActions: function() {
      return [];
    }
  });

  controllerScope.__proto__ = new controllerClass();
}

export default openstackSubnetsList;
