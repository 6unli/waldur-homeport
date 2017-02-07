// @ngInject
export default function openStackBackupSchedulesService(baseServiceClass) {
  var ServiceClass = baseServiceClass.extend({
    init: function() {
      this._super();
      this.endpoint = '/openstacktenant-backup-schedules/';
    }
  });
  return new ServiceClass();
}
