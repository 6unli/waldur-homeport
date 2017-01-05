import {
  openstackTemplateColumns,
  templateParser,
  templateFormatter
} from './openstack-template';

import { SUBNET_OPTIONS } from '../openstack-network/constants';

export default {
  order: [
    'name',
    'template',
    'description',
    'access',
    'user_username',
    'user_password',
    'subnet_cidr',
    'subnet_allocation_pool',
  ],
  options: angular.merge({}, SUBNET_OPTIONS, {
    name: {
      type: 'string',
      required: true,
      label: 'Tenant name'
    },
    template: {
      type: 'list',
      required: true,
      label: 'VPC package',
      dialogTitle: 'Select Virtual Private Cloud package',
      dialogSize: 'lg',
      resource: 'package-templates',
      parser: templateParser,
      formatter: templateFormatter,
      columns: openstackTemplateColumns
    },
    description: {
      type: 'text',
      label: 'Description'
    },
    access: {
      type: 'label',
      label: 'Access'
    },
    user_username: {
      type: 'string',
      label: 'Initial admin username',
      placeholder: 'generate automatically',
      help_text: 'Leave blank if you want admin username to be auto-generated'
    },
    user_password: {
      type: 'password',
      label: 'Initial admin password',
      placeholder: 'generate automatically',
      help_text: 'Leave blank if you want admin password to be auto-generated'
    }
  }),
  summaryComponent: 'openstackTenantSummary'
};
