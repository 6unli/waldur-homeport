import template from './choices-table.html';

export default function choicesTable() {
  return {
    restrict: 'E',
    template: template,
    scope: {},
    controller: TableController,
    controllerAs: '$ctrl',
    bindToController: {
      choices: '=',
      columns: '=',
      value: '=',
      filterOptions: '=',
      selectItem: '&'
    }
  };
}

// @ngInject
class TableController {
  constructor($filter, $scope) {
    this.$filter = $filter;
    if (this.filterOptions) {
      $scope.$watch(
        () => this.filterValue,
        filterValue => this.filter = {
          [this.filterOptions.name]: filterValue
        }
      );
    }
    this.style = {
      height: '300px',
      'overflow-y': 'auto'
    };
  }

  formatValue(column, choice) {
    const value = choice[column.name];
    if (!column.filter) {
      return value;
    }
    return this.$filter(column.filter)(value);
  }
}
