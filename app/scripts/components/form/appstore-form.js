import template from './appstore-form.html';

export default function appstoreForm() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      fields: '=',
      model: '=',
      errors: '='
    },
    controller: AppstoreFormController,
    controllerAs: '$ctrl',
    bindToController: true
  };
}

class AppstoreFormController {
  constructor($scope) {
    const options = this.fields.options;
    const watchers = this.fields.watchers;
    const order = this.fields.order;
    const model = this.model;

    this.fieldsList = order.map(name => options[name]);
    angular.forEach(watchers, (watcher, field) => {
      $scope.$watch(() => model[field], watcher.bind(null, model, options));
    });

    angular.forEach(this.fieldsList, field => {
      if (field.default_value) {
        model[field.name] = field.default_value;
      }
      if (field.init) {
        field.init(field, model);
      }
    });
  }

  renderLabel(field) {
    return field.type != 'boolean' && field.type != 'label';
  }
}
