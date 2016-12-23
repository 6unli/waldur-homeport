export default function premiumSupportContracts() {
  return {
    restrict: 'E',
    templateUrl: 'views/partials/list.html',
    controller: ContractsListController,
    controllerAs: 'Ctrl',
    scope: {},
  };
}

// @ngInject
function ContractsListController(
  baseControllerListClass,
  premiumSupportContractsService,
  premiumSupportPlansService,
  currentStateService,
  ENTITYLISTFIELDTYPES,
  ENV,
  $filter,
  $stateParams,
  ncUtils
) {
  var controllerScope = this;
  var ResourceController = baseControllerListClass.extend({
    init: function() {
      this.controllerScope = controllerScope;
      this.service = premiumSupportContractsService;
      this._super();

      this.entityOptions = {
        entityData: {
          noDataText: 'You have no SLAs yet.',
          createLink: 'appstore.premiumSupport',
          createLinkText: 'Add SLA',
          expandable: true,
          hideActionButtons: true
        },
        list: [
          {
            name: 'Name',
            propertyName: 'plan_name',
            type: ENTITYLISTFIELDTYPES.none,
            showForMobile: ENTITYLISTFIELDTYPES.showForMobile
          },
          {
            name: 'State',
            propertyName: 'state',
            type: ENTITYLISTFIELDTYPES.none,
            showForMobile: ENTITYLISTFIELDTYPES.showForMobile
          }
        ]
      };
      this.expandableOptions = [
        {
          isList: false,
          addItemBlock: false,
          viewType: 'description',
          items: [
            {
              key: 'plan_description',
              label: 'Description'
            },
            {
              key: 'plan_base_rate',
              label: 'Base rate'
            },
            {
              key: 'plan_hour_rate',
              label: 'Hour rate'
            },
            {
              key: 'plan_terms',
              label: 'Terms'
            }
          ]
        }
      ];
    },
    getList: function(filter) {
      var vm = this;
      var fn = this._super.bind(vm);
      if ($stateParams.uuid) {
        this.service.defaultFilter.project_uuid = $stateParams.uuid;
        return fn(filter);
      }
      return currentStateService.getProject().then(function(project) {
        vm.service.defaultFilter.project_uuid = project.uuid;
        return fn(filter);
      });
    },
    showMore: function(contract) {
      var promise = premiumSupportPlansService.$get(null, contract.plan).then(function(response) {
        contract.plan_description = response.description;
        contract.plan_terms = response.terms;
        contract.plan_base_rate = $filter('currency')(response.base_rate, ENV.currency);
        contract.plan_hour_rate = $filter('currency')(response.hour_rate, ENV.currency);
      });
      ncUtils.blockElement('block_'+contract.uuid, promise);
    }
  });

  controllerScope.__proto__ = new ResourceController();
}
