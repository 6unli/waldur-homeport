import template from './openstack-instance-summary.html';

export default function openstackInstanceSummary() {
  return {
    restrict: 'E',
    template: template,
    controller: SummaryController,
    controllerAs: '$ctrl',
    bindToController: true,
    scope: {
      model: '='
    }
  }
}

// @ngInject
class SummaryController {
  constructor(OpenStackSummaryService) {
    this.OpenStackSummaryService = OpenStackSummaryService;
    this.init();
  }

  init() {
    this.loading = true;
    this.components = {};
    this.OpenStackSummaryService.getServiceComponents(this.model.service)
      .then(components => {
        this.components = components
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getDailyPrice() {
    if (this.components && this.model.flavor) {
      return this.model.flavor.cores * this.components.cores +
             this.model.flavor.ram * this.components.ram +
             this.getTotalStorage() * this.components.storage;
    }
  }

  getMonthlyPrice() {
    return this.getDailyPrice() * 30;
  }

  getTotalStorage() {
    return this.model.system_volume_size + this.model.data_volume_size;
  }
}

