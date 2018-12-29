import { checkPermission } from '@waldur/issues/routes';

// @ngInject
export default function routes($stateProvider) {
  $stateProvider
    .state('marketplace-landing', {
      url: 'marketplace/',
      template: '<marketplace-landing></marketplace-landing>',
      parent: 'project',
      data: {
        pageTitle: gettext('Marketplace'),
        hideBreadcrumbs: true,
        feature: 'marketplace',
      }
    })

    .state('marketplace-landing-customer', {
      url: 'marketplace/',
      template: '<marketplace-landing></marketplace-landing>',
      parent: 'organization',
      data: {
        pageTitle: gettext('Marketplace'),
        hideBreadcrumbs: true,
        feature: 'marketplace',
      }
    })

    .state('marketplace-compare', {
      url: 'marketplace-compare/',
      template: '<marketplace-compare></marketplace-compare>',
      parent: 'project',
      data: {
        pageTitle: gettext('Compare items'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-compare-customer', {
      url: 'marketplace-compare/',
      template: '<marketplace-compare></marketplace-compare>',
      parent: 'organization',
      data: {
        pageTitle: gettext('Compare items'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-checkout', {
      url: 'marketplace-checkout/',
      template: '<marketplace-checkout></marketplace-checkout>',
      parent: 'project',
      data: {
        pageTitle: gettext('Marketplace checkout'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-checkout-customer', {
      url: 'marketplace-checkout/',
      template: '<marketplace-checkout></marketplace-checkout>',
      parent: 'organization',
      data: {
        pageTitle: gettext('Marketplace checkout'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-offering', {
      url: 'marketplace-offering/:offering_uuid/',
      template: '<marketplace-offering></marketplace-offering>',
      parent: 'project',
      data: {
        pageTitle: gettext('Product details'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-offering-customer', {
      url: 'marketplace-offering/:offering_uuid/',
      template: '<marketplace-offering></marketplace-offering>',
      parent: 'organization',
      data: {
        pageTitle: gettext('Product details'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-category', {
      url: 'marketplace-category/:category_uuid/',
      template: '<marketplace-category></marketplace-category>',
      parent: 'project',
      data: {
        pageTitle: gettext('Marketplace offerings'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-category-customer', {
      url: 'marketplace-category/:category_uuid/',
      template: '<marketplace-category></marketplace-category>',
      parent: 'organization',
      data: {
        pageTitle: gettext('Marketplace offerings'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-order-list', {
      url: 'marketplace-order-list/',
      template: '<marketplace-orders-list></marketplace-orders-list>',
      parent: 'project',
      data: {
        pageTitle: gettext('Orders'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-provider-details', {
      url: 'marketplace-provider-details/:customer_uuid/',
      template: '<marketplace-provider-details></marketplace-provider-details>',
      parent: 'project',
      data: {
        pageTitle: gettext('Provider details'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-provider-details-customer', {
      url: 'marketplace-provider-details/:customer_uuid/',
      template: '<marketplace-provider-details></marketplace-provider-details>',
      parent: 'organization',
      data: {
        pageTitle: gettext('Provider details'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-services', {
      url: '',
      abstract: true,
      template: '<ui-view></ui-view>',
    })

    .state('marketplace-vendor-offerings', {
      url: 'marketplace-offerings/',
      template: '<marketplace-vendor-offerings></marketplace-vendor-offerings>',
      parent: 'organization',
      data: {
        pageTitle: gettext('Public offerings'),
        feature: 'marketplace',
        sidebarState: 'marketplace-services',
      }
    })

    .state('marketplace-my-offerings', {
      url: 'marketplace-my-offerings/',
      template: '<marketplace-my-offerings></marketplace-my-offerings>',
      parent: 'organization',
      data: {
        pageTitle: gettext('My offerings'),
        feature: 'marketplace',
        sidebarState: 'marketplace-services',
      }
    })

    .state('marketplace-offering-create', {
      url: 'marketplace-offering-create/',
      template: '<marketplace-offering-create></marketplace-offering-create>',
      parent: 'organization',
      data: {
        pageTitle: gettext('Add offering'),
        feature: 'marketplace',
        sidebarState: 'marketplace-services',
      }
    })

    .state('marketplace-offering-update', {
      url: 'marketplace-offering-update/:offering_uuid/',
      template: '<marketplace-offering-update></marketplace-offering-update>',
      parent: 'organization',
      data: {
        pageTitle: gettext('Update offering'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-order-details', {
      url: 'marketplace-order-details/:order_uuid/',
      template: '<marketplace-order-details></marketplace-order-details>',
      parent: 'project',
      data: {
        pageTitle: gettext('Order details'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-order-item-details', {
      url: 'marketplace-order-item-details/:order_item_uuid/',
      template: '<marketplace-order-item-details></marketplace-order-item-details>',
      parent: 'project',
      data: {
        pageTitle: gettext('Order item details'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-order-item-details-customer', {
      url: 'marketplace-order-item-details/:order_item_uuid/',
      template: '<marketplace-order-item-details></marketplace-order-item-details>',
      parent: 'organization',
      data: {
        pageTitle: gettext('Order item details'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-order-details-customer', {
      url: 'marketplace-order-details/:order_uuid/',
      template: '<marketplace-order-details></marketplace-order-details>',
      parent: 'organization',
      data: {
        pageTitle: gettext('Order details'),
        feature: 'marketplace',
      }
    })

    .state('marketplace-order-items', {
      url: 'marketplace-order-items/',
      template: '<marketplace-order-items-list></marketplace-order-items-list>',
      parent: 'organization',
      data: {
        pageTitle: gettext('Orders'),
        feature: 'marketplace',
        sidebarState: 'marketplace-services',
      }
    })

    .state('marketplace-my-order-items', {
      url: 'marketplace-my-order-items/',
      template: '<marketplace-my-order-items-list></marketplace-my-order-items-list>',
      parent: 'organization',
      data: {
        pageTitle: gettext('Orders'),
        feature: 'marketplace',
        sidebarState: 'marketplace-services',
      }
    })

    .state('marketplace-support-order-items', {
      url: 'order-items/',
      template: '<marketplace-support-order-items-list></marketplace-support-order-items-list>',
      parent: 'support',
      data: {
        feature: 'marketplace',
        pageTitle: gettext('Orders'),
      },
      resolve: {
        permission: checkPermission,
      }
    })

    .state('marketplace-resources', {
      url: '',
      abstract: true,
      template: '<ui-view></ui-view>',
    })

    .state('marketplace-project-resources', {
      url: 'marketplace-resources/:category_uuid/',
      template: '<marketplace-project-resources-list></marketplace-project-resources-list>',
      parent: 'project',
      data: {
        pageTitle: gettext('Resources'),
        feature: 'marketplace',
        sidebarState: 'marketplace-resources'
      }
    });
}
