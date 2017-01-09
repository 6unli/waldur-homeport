// @ngInject
export default function issueRoutes($stateProvider) {
  $stateProvider
    .state('support', {
      url: '/support/',
      template: '<issues-workspace></issues-workspace>',
      abstract: true,
      data: {
        auth: true,
        workspace: 'support'
      }
    })

    .state('support.dashboard', {
      url: '',
      template: '<issues-dashboard></issue-dashboard>',
      data: {
        pageTitle: 'Support dashboard',
        hideBreadcrumbs: true
      }
    })

    .state('support.helpdesk', {
      url: 'helpdesk/',
      template: '<issues-helpdesk></issues-helpdesk>',
      data: {
        pageTitle: 'Helpdesk dashboard'
      }
    })

    .state('support.detail', {
      url: 'issue/:uuid/',
      template: '<issue-detail></issue-detail>',
      data: {
        pageTitle: 'Request detail'
      }
    })

    .state('support.list', {
      url: 'list/',
      template: '<issues-list-filtered></issues-list-filtered>',
      data: {
        pageTitle: 'Support requests'
      }
    });
}
