// @ngInject
export default function baseResourceListController(
  baseControllerListClass,
  ENV,
  resourcesService,
  priceEstimationService,
  servicesService,
  currentStateService,
  projectsService,
  $uibModal,
  $rootScope,
  $state,
  $q,
  resourceUtils,
  ncUtils) {
  var ControllerListClass = baseControllerListClass.extend({
    init: function() {
      this.service = resourcesService;
      this.categories = {};
      this.categories[ENV.VirtualMachines] = 'vms';
      this.categories[ENV.Applications] = 'apps';
      this.categories[ENV.PrivateClouds] = 'private_clouds';
      this.categories[ENV.Storages] = 'storages';
      this.enableRefresh = true;

      this._super();
      this.hasCustomFilters = false;
    },
    getTableOptions: function() {
      var vm = this.controllerScope;
      return {
        searchFieldName: 'name',
        noDataText: 'You have no resources yet.',
        noMatchesText: 'No resources found matching filter.',
        columns: [
          {
            title: 'Name',
            className: 'all',
            render: function(row) {
              return vm.renderResourceName(row);
            }
          },
          {
            title: 'Provider',
            className: 'desktop',
            render: function(row) {
              return row.service_name;
            }
          },
          {
            title: 'State',
            className: 'min-tablet-l',
            render: function(row) {
              return vm.renderResourceState(row);
            }
          }
        ],
        tableActions: this.getTableActions(),
        rowActions: function(row) {
          var index = this.findIndexById(row);
          return '<action-button-resource button-controller="controller" button-model="controller.list[' + index + ']"/>';
        }
      };
    },
    renderResourceName: function(row) {
      var img = '<img src="{src}" title="{title}" class="img-xs m-r-xs">'
        .replace('{src}', resourceUtils.getIcon(row))
        .replace('{title}', row.resource_type);
      var href = $state.href('resources.details', {
        uuid: row.uuid,
        resource_type: row.resource_type
      });
      return ncUtils.renderLink(href, img + ' ' + (row.name || '&mdash;'));
    },
    renderResourceState: function(row) {
      var index = this.findIndexById(row);
      return '<resource-state resource="controller.list[{index}]"></resource-state>'
        .replace('{index}', index);
    },
    findIndexById: function(row) {
      var index;
      for (var i = 0; i < this.controllerScope.list.length; i++) {
        if (this.controllerScope.list[i].uuid === row.uuid) {
          index = i;
        }
      }
      return index;
    },
    getTableActions: function() {
      var actions = [];
      if (ENV.featuresVisible || ENV.toBeFeatures.indexOf('import') === -1) {
        actions.push(this.getImportAction());
      }
      if (this.category !== undefined) {
        actions.push(this.getCreateAction());
      }
      if (ENV.featuresVisible || ENV.toBeFeatures.indexOf('openMap') === -1) {
        actions.push(this.getMapAction());
      }
      return actions;
    },
    getImportAction: function() {
      var disabled, tooltip;
      if (ncUtils.isCustomerQuotaReached(this.currentCustomer, 'resource')) {
        disabled = true;
        tooltip = 'Quota has been reached';
      } else if (!this.projectHasNonSharedService(this.currentProject)) {
        disabled = true;
        tooltip = 'Import is not possible as there are no personal provider accounts registered.';
      } else {
        disabled = false;
        tooltip = 'Import resources from the registered provider accounts.';
      }
      return {
        name: '<i class="fa fa-plus"></i> ' + this.getImportTitle(),
        callback: function() {
          $state.go('import.import');
        },
        disabled: disabled,
        titleAttr: tooltip
      };
    },
    getImportTitle: function() {
      return 'Import';
    },
    getCreateAction: function() {
      var disabled, tooltip;
      if (ncUtils.isCustomerQuotaReached(this.currentCustomer, 'resource')) {
        disabled = true;
        tooltip = 'Quota has been reached';
      }
      return {
        name: '<i class="fa fa-plus"></i> ' + this.getCreateTitle(),
        callback: function() {
          this.gotoAppstore();
        }.bind(this),
        disabled: disabled,
        titleAttr: tooltip
      };
    },
    getCreateTitle: function() {
      return 'Create';
    },
    gotoAppstore: function() {
      $state.go(this.getCategoryState(), {
        uuid: this.currentProject.uuid
      });
    },
    getCategoryState: function() {
      if (this.category === ENV.VirtualMachines) {
        return 'appstore.vms';
      } else if (this.category === ENV.PrivateClouds) {
        return 'appstore.private_clouds';
      } else if (this.category === ENV.Applications) {
        return 'appstore.apps';
      } else if (this.category === ENV.Storages) {
        return 'appstore.storages';
      }
    },
    getMapAction: function() {
      return {
        name: '<i class="fa fa-map-marker"></i> Open map',
        callback: this.openMap.bind(this)
      };
    },
    rowFields: [
      'uuid', 'url', 'name', 'state', 'runtime_state', 'created', 'error_message',
      'resource_type', 'latitude', 'longitude',
      'service_name', 'service_uuid', 'customer', 'service_settings_state',
      'service_settings_error_message', 'service_settings_uuid', 'security_groups',
    ],
    getMarkers: function() {
      var items = this.controllerScope.list.filter(function hasCoordinates(item) {
        return item.latitude != null && item.longitude != null;
      });

      var points = {};
      items.forEach(function groupMarkersByCoordinates(item) {
        var key = [item.latitude, item.longitude];
        if (!points[key]) {
          points[key] = [];
        }
        points[key].push(item);
      });

      var markers = [];
      angular.forEach(points, function createMarker(items) {
        var item = items[0];
        var message = items.map(function(item) {
          return item.name;
        }).join('<br/>');
        markers.push({
          lat: item.latitude,
          lng: item.longitude,
          message: message
        });
      });
      return markers;
    },
    openMap: function() {
      var markers = this.getMarkers();

      if(!markers) {
        alert('No virtual machines with coordinates');
      } else {
        var scope = $rootScope.$new();
        scope.markers = markers;
        // eslint-disable-next-line no-undef
        scope.maxbounds = new L.LatLngBounds(markers);
        $uibModal.open({
          template: '<leaflet width="100%" markers="markers" maxbounds="maxbounds"></leaflet>',
          windowClass: 'map-dialog',
          scope: scope
        });
      }
    },
    projectHasNonSharedService: function(project) {
      for (var i = 0; i < project.services.length; i++) {
        var service = project.services[i];
        if (!service.shared) {
          return true;
        }
      }
      return false;
    },
    getList: function(filter) {
      var vm = this;
      var fn = this._super.bind(this);
      return $q.all([
        currentStateService.getCustomer().then(function(customer) {
          vm.currentCustomer = customer;
        }),
        currentStateService.getProject().then(function(project) {
          vm.currentProject = project;
        })
      ]).then(function() {
        vm.tableOptions = vm.getTableOptions();
        var query = angular.extend({}, filter, {
          field: vm.rowFields
        });
        if (angular.isDefined(vm.category) && !vm.getFilter().resource_type) {
          query.resource_category = vm.categories[vm.category];
          vm.updateFilters(filter);
        }
        return fn(query);
      });
    },
    updateFilters: function(filter) {
      var query = angular.extend({
        resource_category: this.categories[this.category],
        customer: currentStateService.getCustomerUuid()
      }, filter);
      angular.forEach(this.service.defaultFilter, function(val, key) {
        if (key != 'resource_type') {
          query[key] = val;
        }
      });
      return resourcesService.countByType(query).then(function(counts) {
        this.searchFilters = this.getFilterByCounts(counts);
      }.bind(this));
    },
    getFilterByCounts: function(counts) {
      var filters = [];
      angular.forEach(counts, function(count, resourceType) {
        if (count > 0) {
          filters.push({
            name: 'resource_type',
            title: resourceType.replace('.', ' ') + ' (' + count + ')',
            value: resourceType
          });
        }
      });
      return filters;
    },
    afterGetList: function() {
      angular.forEach(this.list, function(resource) {
        resourcesService.cleanOptionsCache(resource.url);
      });
      this._super();
    },
    afterInstanceRemove: function(resource) {
      this._super(resource);
      servicesService.clearAllCacheForCurrentEndpoint();
      projectsService.clearAllCacheForCurrentEndpoint();
      priceEstimationService.clearAllCacheForCurrentEndpoint();
    },
    reInitResource:function(resource) {
      var vm = this;
      return vm.service.$get(resource.resource_type, resource.uuid).then(function(response) {
        var index = vm.list.indexOf(resource);
        vm.list[index] = response;
        vm.afterGetList();
      });
    }
  });

  return ControllerListClass;
}
