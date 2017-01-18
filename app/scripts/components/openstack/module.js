import OpenStackSummaryService from './openstack-summary-service';
import openstackTenantModule from './openstack-tenant/module';
import openstackInstanceModule from './openstack-instance/module';
import openstackVolumeModule from './openstack-volume/module';
import openstackBackupModule from './openstack-backup/module';
import openstackNetworkModule from './openstack-network/module';
import openstackSubnetModule from './openstack-subnet/module';
import openstackSecurityGroupsModule from './openstack-security-groups/module';
import openstackFloatingIpsModule from './openstack-floating-ips/module';
import openstackSnapshotModule from './openstack-snapshot/module';

export default module => {
  module.service('OpenStackSummaryService', OpenStackSummaryService);
  openstackTenantModule(module);
  openstackInstanceModule(module);
  openstackVolumeModule(module);
  openstackBackupModule(module);
  openstackNetworkModule(module);
  openstackSubnetModule(module);
  openstackSecurityGroupsModule(module);
  openstackFloatingIpsModule(module);
  openstackSnapshotModule(module);
};
