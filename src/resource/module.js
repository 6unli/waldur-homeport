import actionsModule from './actions/module';
import resourceBreadcrumbsModule from './breadcrumbs/module';
import filtersModule from './filters';
import resourcesListModule from './list/module';
import monitoringModule from './monitoring/module';
import resourceDetails from './resource-details';
import resourceHeader from './resource-header';
import resourceUtils from './resource-utils-service';
import resourceName from './ResourceName';
import resourceRefreshButton from './ResourceRefreshButton';
import resourcesService from './resources-service';
import resourceRoutes from './routes';
import resourceStateModule from './state/module';
import resourceSummaryModule from './summary/module';
import supportModule from './support/module';
import resourceTabsModule from './tabs/module';
import './events';

export default module => {
  module.service('resourceUtils', resourceUtils);
  module.component('resourceDetails', resourceDetails);
  module.component('resourceHeader', resourceHeader);
  module.component('resourceName', resourceName);
  module.component('resourceRefreshButton', resourceRefreshButton);
  module.config(resourceRoutes);
  module.service('resourcesService', resourcesService);
  resourceSummaryModule(module);
  resourceBreadcrumbsModule(module);
  resourceStateModule(module);
  resourceTabsModule(module);
  resourcesListModule(module);
  monitoringModule(module);
  actionsModule(module);
  filtersModule(module);
  supportModule(module);
};
