// @ngInject
function loadProject($stateParams, $q, $state, currentStateService, projectsService, customersService, WorkspaceService) {
  if (!$stateParams.uuid) {
    return $q.reject();
  }
  return projectsService.$get($stateParams.uuid).then(project => {
    currentStateService.setProject(project);
    return { project };
  }).then(({ project }) => {
    return customersService.$get(project.customer_uuid).then(customer => {
      currentStateService.setCustomer(customer);
      return { customer, project };
    });
  }).then(({ customer, project }) => {
    WorkspaceService.setWorkspace({
      customer: customer,
      project: project,
      hasCustomer: true,
      workspace: 'project',
    });
    return project;
  }).catch(response => {
    if (response.status === 404) {
      $state.go('errorPage.notFound');
    }
  });
}

// @ngInject
function projectController($scope, usersService, currentStateService, customersService) {
  usersService.getCurrentUser().then(currentUser => {
    currentStateService.getCustomer().then(currentCustomer => {
      currentStateService.getProject().then(currentProject => {
        $scope.currentProject = currentProject;

        const status = customersService.checkCustomerUser(currentCustomer, currentUser);
        currentStateService.setOwnerOrStaff(status);
      });
    });
  });
}

// @ngInject
export default function projectRoutes($stateProvider) {
  $stateProvider
    .state('project', {
      url: '/projects/:uuid/',
      abstract: true,
      templateUrl: 'views/project/base.html',
      data: {
        auth: true,
        workspace: 'project',
      },
      resolve: {
        currentProject: loadProject,
      },
      controller: projectController
    })

    .state('project.details', {
      url: '',
      template: '<project-dashboard project="currentProject"></project-dashboard>',
      data: {
        pageTitle: 'Project dashboard',
        pageClass: 'gray-bg'
      }
    })

    .state('project.issues', {
      url: 'issues/',
      template: '<project-issues></project-issues>',
      data: {
        pageTitle: 'Issues',
        pageClass: 'gray-bg'
      }
    })

    .state('project.events', {
      url: 'events/',
      template: '<project-events project="currentProject"></project-events>',
      data: {
        pageTitle: 'Audit logs'
      }
    })

    .state('project.alerts', {
      url: 'alerts/',
      templateUrl: 'views/partials/filtered-list.html',
      controller: 'ProjectAlertTabController',
      controllerAs: 'ListController',
      data: {
        pageTitle: 'Alerts'
      }
    })

    .state('project.resources', {
      url: '',
      abstract: true,
      template: '<ui-view/>'
    })

    .state('project.resources.vms', {
      url: 'virtual-machines/',
      templateUrl: 'views/partials/filtered-list.html',
      controller: 'ProjectVirtualMachinesListController',
      controllerAs: 'ListController',
      data: {
        pageTitle: 'Virtual machines'
      }
    })

    .state('project.resources.apps', {
      url: 'applications/',
      templateUrl: 'views/partials/filtered-list.html',
      controller: 'ProjectApplicationsTabController',
      controllerAs: 'ListController',
      data: {
        pageTitle: 'Applications'
      }
    })

    .state('project.resources.clouds', {
      url: 'private-clouds/',
      templateUrl: 'views/partials/filtered-list.html',
      controller: 'ProjectPrivateCloudsTabController',
      controllerAs: 'ListController',
      data: {
        pageTitle: 'Private clouds'
      }
    })

    .state('project.resources.storage', {
      url: 'storage/',
      templateUrl: 'views/project/storage.html',
      controller: 'StorageTabController',
      data: {
        pageTitle: 'Storage'
      },
      abstract: true
    })

    .state('project.resources.storage.tabs', {
      url: '',
      views: {
        volumes: {
          controller: 'VolumesListController as ListController',
          templateUrl: 'views/partials/filtered-list.html',
        },
        snapshots: {
          controller: 'SnapshotsListController as ListController',
          templateUrl: 'views/partials/filtered-list.html',
        }
      }
    })

    .state('project.delete', {
      url: 'delete/',
      template: '<project-manage></project-manage>',
      data: {
        pageTitle: 'Manage'
      }
    })

    .state('project.team', {
      url: 'team/',
      template: '<project-users></project-users>',
      data: {
        pageTitle: 'Team'
      }
    })

    .state('import', {
      url: 'import/',
      parent: 'project',
      template: '<ui-view></ui-view>',
      abstract: true,
      data: {
        auth: true,
        workspace: 'project',
        pageTitle: 'Import resources from provider'
      }
    })

    .state('import.import', {
      url: '?service_type&service_uuid',
      templateUrl: 'views/import/import.html',
    });
}
