export default function hookList() {
  return {
    restrict: 'E',
    templateUrl: 'views/partials/filtered-list.html',
    controller: HookListController,
    controllerAs: 'ListController',
    scope: {}
  };
}

// @ngInject
function HookListController(
  baseControllerListClass, $filter, $uibModal, hooksService) {
  var controllerScope = this;
  var Controller = baseControllerListClass.extend({
    init: function() {
      this.controllerScope = controllerScope;
      this.service = hooksService;
      this._super();

      this.tableOptions = {
        noDataText: 'No notifications registered.',
        noMatchesText: 'No notifications found matching filter.',
        columns: [
          {
            title: 'State',
            className: 'text-center all',
            render: function(data, type, row, meta) {
              var cls = row.is_active && 'online' || '';
              var title = row.is_active && 'Enabled' || 'Disabled';
              return '<a class="status-circle {cls}" title="{title}"></a>'
                        .replace('{cls}', cls).replace('{title}', title);
            },
            width: '40px'
          },
          {
            title: 'Method',
            className: 'min-tablet-l',
            render: function(data, type, row, meta) {
              return row.label;
            },
            width: '100px'
          },
          {
            title: 'Destination',
            className: 'min-tablet-l',
            render: function(data, type, row, meta) {
              return row.destination;
            },
            width: '100px'
          },
          {
            title: 'Events',
            className: 'min-tablet-l',
            render: function(data, type, row, meta) {
              return row.events;
            }
          }
        ],
        tableActions: [
          {
            name: '<i class="fa fa-plus"></i> Add notification',
            callback: this.openDialog.bind(controllerScope)
          }
        ],
        rowActions: [
          {
            name: '<i class="fa fa-pencil"></i> Edit',
            callback: this.openDialog.bind(controllerScope)
          },
          {
            name: '<i class="fa fa-trash"></i> Remove',
            className: 'danger',
            callback: this.remove.bind(controllerScope)
          }
        ],
        actionsColumnWidth: '150px'
      };
    },

    openDialog: function(hook) {
      $uibModal.open({
        component: 'hookDetails',
        resolve: {
          hook: () => hook
        }
      }).result.then(function() {
        controllerScope.resetCache();
      });
    },

    removeInstance: function(hook) {
      return this.service.$deleteByUrl(hook.url);
    },

    search: function() {
      var vm = this,
        searchInput = vm.searchInput.toLowerCase();

      vm.list = vm.service.list.filter(function(item) {
        if (
          item.label.toLowerCase().indexOf(searchInput) >= 0
          || item.destination.toLowerCase().indexOf(searchInput) >= 0
        ) {
          return item;
        }
      });
    },

    afterGetList: function() {
      this.list.forEach(function(item) {
        item.label = $filter('titleCase')(item.hook_type);
        item.destination = item.destination_url || item.email;
        item.events = item.event_groups.map($filter('formatEventTitle')).join(', ');
      });
      this.service.list = this.list;
    }
  });
  Object.setPrototypeOf(controllerScope, new Controller());
}
