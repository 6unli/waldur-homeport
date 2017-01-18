import openstackSecurityGroupsService from './security-groups-service';
import openstackSecurityGroupsList from './security-groups-list';
import { securityGroupRulesList } from './security-group-rules-list';
import securityGroupsLink from './security-groups-link';
import securityGroupsDialog from './security-groups-dialog';
import filtersModule from './filters';
import { securityGroupRuleEditor } from './security-group-rule-editor';
import { securityGroupSummary } from './security-group-summary';
import breadcrumbsConfig from './breadcrumbs';

export default module => {
  module.service('openstackSecurityGroupsService', openstackSecurityGroupsService);
  module.component('openstackSecurityGroupsList', openstackSecurityGroupsList);
  module.component('securityGroupRulesList', securityGroupRulesList);
  module.component('securityGroupRuleEditor', securityGroupRuleEditor);
  module.component('securityGroupSummary', securityGroupSummary);
  module.directive('securityGroupsLink', securityGroupsLink);
  module.directive('securityGroupsDialog', securityGroupsDialog);
  filtersModule(module);
  module.config(tabsConfig);
  module.config(actionConfig);
  module.run(breadcrumbsConfig);
};

// @ngInject
function tabsConfig(ResourceTabsConfigurationProvider, DEFAULT_RESOURCE_TABS) {
  ResourceTabsConfigurationProvider.register('OpenStack.SecurityGroup', {
    order: [
      ...DEFAULT_RESOURCE_TABS.order,
      'rules',
    ],
    options: angular.merge({
      rules: {
        heading: 'Rules',
        component: 'securityGroupRulesList'
      }
    }, DEFAULT_RESOURCE_TABS.options)
  });
}

// @ngInject
function actionConfig(ActionConfigurationProvider, DEFAULT_EDIT_ACTION) {
  ActionConfigurationProvider.register('OpenStack.SecurityGroup', {
    order: [
      'edit',
      'pull',
      'set_rules',
      'destroy'
    ],
    options: {
      edit: angular.merge({}, DEFAULT_EDIT_ACTION, {
        successMessage: 'Security group has been updated'
      }),
      pull: {
        title: 'Synchronise'
      },
      set_rules: {
        title: 'Set rules',
        enabled: true,
        type: 'form',
        fields: {
          rules: {
            component: 'securityGroupRuleEditor',
            resource_default_value: true,
          }
        },
        dialogSize: 'lg',
        serializer: model => model.rules
      }
    }
  });
}
