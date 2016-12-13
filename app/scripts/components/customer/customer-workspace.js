import template from './customer-workspace.html';

export default function customerWorkspace() {
  return {
    restrict: 'E',
    template: template,
    controller: CustomerWorkspaceController,
  };
}

// @ngInject
function CustomerWorkspaceController(
  $scope,
  currentStateService,
  joinService,
  eventsService,
  customersService,
  $state,
  tabCounterService,
  AppStoreUtilsService) {

  activate();

  function activate() {
    $scope.$on('currentCustomerUpdated', function() {
      refreshCustomer();
    });
    refreshCustomer();
  }

  function setItems() {
    $scope.items = [
      {
        label: "Dashboard",
        icon: "fa-th-large",
        link: "dashboard.index"
      },
      {
        label: "Providers",
        icon: "fa-database",
        link: "organization.providers({uuid: $ctrl.context.customer.uuid})",
        feature: "providers",
        countFieldKey: "services"
      },
      {
        label: "Projects",
        icon: "fa-bookmark",
        link: "organization.projects({uuid: $ctrl.context.customer.uuid})",
        feature: "projects",
        countFieldKey: "projects"
      },
      {
        icon: "fa-shopping-cart",
        label: "Service store",
        feature: "appstore",
        action: function() {
          return AppStoreUtilsService.openDialog({selectProject: true});
        },
      },
      {
        label: "Analytics",
        icon: "fa-bar-chart-o",
        link: "organization.analysis",
        feature: 'analytics',
        children: [
          {
            label: "Cost analysis",
            icon: "fa-pie-chart",
            link: "organization.analysis.cost({uuid: $ctrl.context.customer.uuid})"
          },
          {
            label: "Resource usage",
            icon: "fa-tachometer",
            link: "organization.analysis.resources({uuid: $ctrl.context.customer.uuid})"
          }
        ]
      },
      {
        label: "Audit logs",
        icon: "fa-bell-o",
        link: "organization.details({uuid: $ctrl.context.customer.uuid})",
        feature: "eventlog"
      },
      {
        label: "Issues",
        icon: "fa-question-circle",
        link: "organization.issues({uuid: $ctrl.context.customer.uuid})",
        feature: "support"
      },
      {
        label: "Alerts",
        icon: "fa-fire",
        link: "organization.alerts({uuid: $ctrl.context.customer.uuid})",
        feature: "alerts",
        countFieldKey: "alerts"
      },
      {
        label: "Team",
        icon: "fa-group",
        link: "organization.team.tabs({uuid: $ctrl.context.customer.uuid})",
        feature: "team",
        countFieldKey: "users"
      },
      {
        label: "Billing",
        icon: "fa-file-text-o",
        link: "organization.billing.tabs({uuid: $ctrl.context.customer.uuid})",
        feature: "billing"
      },
      {
        label: "Sizing",
        icon: "fa-calculator",
        link: "organization.sizing({uuid: $ctrl.context.customer.uuid})",
        feature: "sizing"
      },
      {
        label: 'Manage',
        icon: 'fa-wrench',
        link: 'organization.delete({uuid: $ctrl.context.customer.uuid})'
      }
    ];
  }

  function refreshCustomer() {
    currentStateService.isCustomerDefined && currentStateService.getCustomer().then(function(customer) {
      $scope.currentCustomer = customer;
      $scope.context = {customer: customer};
      setItems();
      connectCounters(customer);
    });
  }

  function connectCounters(customer) {
    if ($scope.timer) {
      tabCounterService.cancel($scope.timer);
    }

    $scope.timer = tabCounterService.connect({
      $scope: $scope,
      tabs: $scope.items,
      getCounters: getCounters.bind(null, customer),
      getCountersError: getCountersError
    });
  }

  function getCounters(customer) {
    var query = angular.extend(
        {UUID: customer.uuid},
        joinService.defaultFilter,
        eventsService.defaultFilter
    );
    return customersService.getCounters(query);
  }

  function getCountersError(error) {
    if (error.status == 404) {
      customersService.getPersonalOrFirstCustomer().then(function(customer) {
        $state.go('organization.details', {uuid: customer.uuid});
      });
    } else {
      tabCounterService.cancel($scope.timer);
    }
  }
}
