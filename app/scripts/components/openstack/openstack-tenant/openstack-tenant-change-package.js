import template from './openstack-tenant-change-package.html';
import { openstackTemplateColumns, templateFormatter } from './openstack-template';

export default function openstackTenantChangePackageDialog() {
  return {
    restrict: 'E',
    template: template,
    controller: DialogController,
    controllerAs: '$ctrl',
    bindToController: true
  };
}

// @ngInject
class DialogController {
  constructor($scope, $filter, ncUtilsFlash, openstackTenantChangePackageService) {
    this.$filter = $filter;
    this.ncUtilsFlash = ncUtilsFlash;
    this.service = openstackTenantChangePackageService;

    this.tenant = $scope.resource;
    this.dismiss = $scope.$dismiss;
    this.close = $scope.$close;
    this.init();
  }

  init() {
    this.newTemplate = null;
    this.columns = openstackTemplateColumns;
    this.templates = [];
    this.loading = true;
    this.service.loadData(this.tenant).then(context => {
      this.package = context.package;
      this.template = context.template;
      this.templates = context.templates;
      this.templateDisplay = templateFormatter(this.$filter, this.template);
    }).catch(response => {
      if (response) {
        this.errors = response.data;
      }
    }).finally(() => {
      this.loading = false;
    });
  }

  selectTemplate(template) {
    this.newTemplate = template;
  }

  submitForm() {
    return this.service.saveData({
      tenant: this.tenant,
      package: this.package,
      template: this.template,
      newTemplate: this.newTemplate
    }).then(() => {
      this.ncUtilsFlash.success('Request to change tenant package has been created.');
      this.close();
    }).catch(response => {
      if (response) {
        this.errors = response.data;
      }
      this.ncUtilsFlash.error('Unable to create request to change tenant package.');
    });
  }
}
