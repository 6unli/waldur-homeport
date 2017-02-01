// @ngInject
export default function authRoutes($stateProvider) {
  $stateProvider
    .state('home', {
      url: '',
      abstract: true,
      templateUrl: 'views/partials/base.html',
    })

    .state('login', {
      parent: 'home',
      url: '/login/',
      template: '<auth-login mode="\'login\'"></auth-login>',
      data: {
        bodyClass: 'old',
        anonymous: true,
      }
    })

    .state('register', {
      parent: 'home',
      url: '/register/',
      template: '<auth-login mode="\'register\'"></auth-login>',
      data: {
        bodyClass: 'old',
        anonymous: true
      }
    })

    .state('home.activate', {
      url: '/activate/:user_uuid/:token/',
      template: '<auth-activation></auth-activation>',
      data: {
        anonymous: true,
        bodyClass: 'old',
      }
    })

    .state('home.login_complete', {
      url: '/login_complete/:token/',
      template: '<auth-login-complete></auth-login-complete>',
      data: {
        anonymous: true,
        bodyClass: 'old',
      }
    })

    .state('home.login_failed', {
      url: '/login_failed/',
      template: '<auth-login-failed></auth-login-failed>',
      data: {
        anonymous: true,
        bodyClass: 'old',
      }
    })

    .state('initialdata', {
      parent: 'home',
      url: '/initial-data/',
      template: '<ui-view/>',
      abstract: true
    })

    .state('initialdata.view', {
      url: '',
      template: '<auth-init></auth-init>',
      noInitialData: true,
      data: {
        auth: true,
        bodyClass: 'old'
      },
      resolve: {
        currentUser: usersService => usersService.getCurrentUser()
      }
    });
}
