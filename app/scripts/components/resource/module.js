import resourceUtils from './resource-utils-service';
import resourceDetails from './resource-details';
import resourceRoutes from './routes';
import resourceHeader from './resource-header';
import resourcesService from './resources-service';
import resourceSummaryModule from './summary/module';
import resourceBreadcrumbsModule from './breadcrumbs/module';
import resourceStateModule from './state/module';
import resourceTabsModule from './tabs/module';
import resourcesListModule from './list/module';
import monitoringModule from './monitoring/module';
import actionsModule from './actions/module';

export default module => {
  module.service('resourceUtils', resourceUtils);
  module.component('resourceDetails', resourceDetails);
  module.directive('resourceHeader', resourceHeader);
  module.config(resourceRoutes);
  module.service('resourcesService', resourcesService);
  resourceSummaryModule(module);
  resourceBreadcrumbsModule(module);
  resourceStateModule(module);
  resourceTabsModule(module);
  resourcesListModule(module);
  monitoringModule(module);
  actionsModule(module);
};
