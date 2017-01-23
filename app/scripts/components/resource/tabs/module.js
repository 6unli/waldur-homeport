import resourceTab from './resource-tab';
import resourceTabs from './resource-tabs';
import ResourceTabsConfiguration from './resource-tabs-configuration';
import { DEFAULT_RESOURCE_TABS } from './constants';
import resourceEvents from './resource-events';
import resourceAlerts from './resource-alerts';
import resourceIssues from './resource-issues';

export default module => {
  module.directive('resourceTab', resourceTab);
  module.component('resourceTabs', resourceTabs);
  module.provider('ResourceTabsConfiguration', ResourceTabsConfiguration);
  module.constant('DEFAULT_RESOURCE_TABS', DEFAULT_RESOURCE_TABS);
  module.component('resourceEvents', resourceEvents);
  module.component('resourceAlerts', resourceAlerts);
  module.component('resourceIssues', resourceIssues);
};
