import ActionConfiguration from './action-configuration';
import ActionResourceLoader from './action-resource-loader';
import actionUtilsService from './action-utils-service';
import { defaultFieldOptions, defaultEditAction } from './constants';
import dialogModule from './dialog/module';
import HttpUtils from './http-utils';

export default module => {
  module.service('HttpUtils', HttpUtils);
  module.service('ActionResourceLoader', ActionResourceLoader);
  module.service('actionUtilsService', actionUtilsService);
  module.provider('ActionConfiguration', ActionConfiguration);
  module.constant('DEFAULT_FIELD_OPTIONS', defaultFieldOptions);
  module.constant('DEFAULT_EDIT_ACTION', defaultEditAction);
  dialogModule(module);
};
