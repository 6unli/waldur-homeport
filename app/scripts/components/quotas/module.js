import { quotaName, quotaValue, quotaType } from './filters';
import quotasTable from './quotas-table';
import quotaUsageBarChart from './quota-usage-bar-chart';
import QuotaUtilsService from './quota-utils-service';

export default module => {
  module.filter('quotaName', quotaName);
  module.filter('quotaValue', quotaValue);
  module.filter('quotaType', quotaType);
  module.component('quotasTable', quotasTable);
  module.component('quotaUsageBarChart', quotaUsageBarChart);
  module.service('QuotaUtilsService', QuotaUtilsService);
};
