// @ngInject
function loadCustomer($q, $stateParams, $state, customersService, currentStateService, WorkspaceService) {
  if (!$stateParams.uuid) {
    return $q.reject();
  }
  return customersService.$get($stateParams.uuid)
    .then(customer => {
      currentStateService.setCustomer(customer);
      return customer;
    }).then(customer => {
      WorkspaceService.setWorkspace({
        customer: customer,
        project: null,
        hasCustomer: true,
        workspace: 'organization',
      });
      return customer;
    }).catch(error => {
      if (error.status === 404) {
        $state.go('errorPage.notFound');
      }
    });
}

// @ngInject
function CustomerController($scope, $state, usersService, currentStateService, customersService) {
  usersService.getCurrentUser().then(currentUser => {
    currentStateService.getCustomer().then(currentCustomer => {
      $scope.currentCustomer = currentCustomer;
      $scope.currentUser = currentUser;

      if (customersService.checkCustomerUser(currentCustomer, currentUser) || currentUser.is_support) {
        currentStateService.setOwnerOrStaff(true);
      } else {
        currentStateService.setOwnerOrStaff(false);
        $state.go('profile.details');
      }
    });
  });
}

// @ngInject
export default function organizationRoutes($stateProvider) {
  $stateProvider
    .state('organization', {
      url: '/organizations/:uuid/',
      abstract: true,
      data: {
        auth: true,
        workspace: 'organization'
      },
      template: '<customer-workspace><ui-view></ui-view></customer-workspace>',
      resolve: {
        currentCustomer: loadCustomer,
      },
      controller: CustomerController
    })

    .state('organization.dashboard', {
      url: 'dashboard/',
      template: '<organization-dashboard customer="currentCustomer"></organization-dashboard>',
      data: {
        pageTitle: 'Dashboard',
        pageClass: 'gray-bg',
      }
    })

    .state('organization.details', {
      url: 'events/',
      template: '<customer-events customer="currentCustomer"></customer-events>',
      data: {
        pageTitle: 'Audit logs'
      }
    })

    .state('organization.issues', {
      url: 'issues/',
      template: '<customer-issues></customer-issues>',
      data: {
        pageTitle: 'Issues'
      }
    })

    .state('organization.alerts', {
      url: 'alerts/',
      templateUrl: 'views/partials/filtered-list.html',
      controller: 'CustomerAlertsListController',
      controllerAs: 'ListController',
      data: {
        pageTitle: 'Alerts'
      }
    })

    .state('organization.projects', {
      url: 'projects/',
      template: '<projects-list></projects-list>',
      data: {
        pageTitle: 'Projects'
      }
    })

    .state('organization.team', {
      url: 'team/',
      templateUrl: 'views/customer/tab-team.html',
      data: {
        pageTitle: 'Team'
      },
      abstract: true
    })

    .state('organization.team.tabs', {
      url: '',
      views: {
        users: {
          template: '<customer-users-list></customer-users-list>'
        },
        invitations: {
          template: '<invitations-list></invitations-list>'
        }
      }
    })

    .state('organization.providers', {
      url: 'providers/?providerUuid&providerType',
      templateUrl: 'views/partials/filtered-list.html',
      controller: 'ProviderListController',
      controllerAs: 'ListController',
      data: {
        pageTitle: 'Providers'
      }
    })

    .state('organization.billing', {
      url: 'billing/',
      templateUrl: 'views/customer/tab-billing.html',
      data: {
        pageTitle: 'Billing'
      },
      abstract: true
    })

    .state('organization.billing.tabs', {
      url: '',
      views: {
        invoices: {
          template: '<invoices-list></invoices-list>'
        }
      }
    })

    .state('organization.invoiceDetails', {
      url: 'invoice/:invoiceUUID/',
      template: '<invoice-details></invoice-details>'
    })

    .state('organization.sizing', {
      url: 'sizing/',
      templateUrl: 'views/customer/tab-sizing.html',
      data: {
        pageTitle: 'Sizing'
      }
    })

    .state('organization.delete', {
      url: 'delete/',
      template: '<customer-delete></customer-delete>',
      data: {
        pageTitle: 'Delete organization'
      }
    })

    .state('organization.plans', {
      url: 'plans/',
      template: '<plans-list/>',
      data: {
        pageTitle: 'Plans'
      }
    })

    .state('organization.createProject', {
      url: 'createProject/',
      template: '<project-create></project-create>',
      data: {
        pageTitle: 'Create project',
      }
    })

    .state('organization.createProvider', {
      url: 'createProvider/',
      template: '<provider-create></provider-create>',
      data: {
        pageTitle: 'Create provider'
      }
    });
}
