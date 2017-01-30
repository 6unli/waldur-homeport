import userSelector from './user-selector';
import addProjectMember from './add-project-member';
import addTeamMember from './add-team-member';
import customerUsersList from './customer-users-list';
import { projectUsers } from './project-users-list';
import customerPermissionsLogService from './customer-permissions-log-service';
import projectPermissionsLogService from './project-permissions-log-service';
import customerPermissionsLogList from './customer-permissions-log-list';
import projectPermissionsLogList from './project-permissions-log-list';

export default module => {
  module.service('customerPermissionsLogService', customerPermissionsLogService);
  module.service('projectPermissionsLogService', projectPermissionsLogService);
  module.directive('userSelector', userSelector);
  module.directive('addProjectMember', addProjectMember);
  module.directive('addTeamMember', addTeamMember);
  module.directive('customerUsersList', customerUsersList);
  module.component('projectUsers', projectUsers);
  module.component('customerPermissionsLogList', customerPermissionsLogList);
  module.component('projectPermissionsLogList', projectPermissionsLogList);
};
