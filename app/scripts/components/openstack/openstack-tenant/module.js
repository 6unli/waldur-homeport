import OpenStackTenantConfig from './openstack-tenant-config';
import openstackTenantCheckoutSummary from './openstack-tenant-checkout-summary';
import openstackTenantChangePackageDialog from './openstack-tenant-change-package';
import { openstackTenantSummary } from './openstack-tenant-summary';
import packageTemplatesService from './package-templates-service';
import openstackPackagesService from './openstack-packages-service';
import openstackTenantChangePackageService from './openstack-tenant-change-package-service';

export default module => {
  module.config(fieldsConfig);
  module.config(actionConfig);
  module.config(tabsConfig);
  module.directive('openstackTenantCheckoutSummary', openstackTenantCheckoutSummary);
  module.directive('openstackTenantChangePackageDialog', openstackTenantChangePackageDialog);
  module.component('openstackTenantSummary', openstackTenantSummary);
  module.service('packageTemplatesService', packageTemplatesService);
  module.service('openstackPackagesService', openstackPackagesService);
  module.service('openstackTenantChangePackageService', openstackTenantChangePackageService);
};

// @ngInject
function fieldsConfig(AppstoreFieldConfigurationProvider) {
  AppstoreFieldConfigurationProvider.register('OpenStack.Tenant', OpenStackTenantConfig);
}

// @ngInject
function actionConfig(ActionConfigurationProvider, DEFAULT_EDIT_ACTION) {
  ActionConfigurationProvider.register('OpenStack.Tenant', {
    order: [
      'edit',
      'pull',
      'change_package',
      'create_network',
      'create_security_group',
      'pull_floating_ips',
      'create_floating_ip',
      'destroy'
    ],
    options: {
      edit: angular.merge({}, DEFAULT_EDIT_ACTION, {
        successMessage: 'Tenant has been updated'
      }),
      pull: {
        title: 'Synchronise'
      },
      create_network: {
        title: 'Create network',
        fields: {
          description: {
            type: 'text'
          }
        }
      },
      change_package: {
        title: 'Change VPC package',
        enabled: true,
        type: 'form',
        component: 'openstackTenantChangePackageDialog',
        dialogSize: 'lg'
      },
      create_security_group: {
        title: 'Create security group',
        fields: {
          rules: {
            component: 'securityGroupRuleEditor'
          }
        },
        dialogSize: 'lg'
      },
      pull_floating_ips: {
        title: 'Pull floating IPs'
      },
      create_floating_ip: {
        title: 'Create floating IP'
      },
    },
    delete_message: 'All tenant resources will be deleted.'
  });
}

// @ngInject
function tabsConfig(ResourceTabsConfigurationProvider, DEFAULT_RESOURCE_TABS) {
  ResourceTabsConfigurationProvider.register('OpenStack.Tenant', {
    order: [
      ...DEFAULT_RESOURCE_TABS.order,
      'networks',
      'security_groups',
      'floating_ips',
    ],
    options: angular.merge({}, DEFAULT_RESOURCE_TABS.options, {
      networks: {
        heading: 'Networks',
        component: 'openstackTenantNetworks'
      },
      security_groups: {
        heading: 'Security groups',
        component: 'openstackSecurityGroupsList'
      },
      floating_ips: {
        heading: 'Floating IPs',
        component: 'openstackFloatingIpsList'
      },
    })
  });
}
