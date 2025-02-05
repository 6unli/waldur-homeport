import { lazyComponent } from '@waldur/core/lazyComponent';
import { translate } from '@waldur/i18n';
import { registerOfferingType } from '@waldur/marketplace/common/registry';
import { OfferingConfigurationFormProps } from '@waldur/marketplace/types';

const OpenstackVolumeDetails = lazyComponent(
  () =>
    import(
      /* webpackChunkName: "OpenstackVolumeDetails" */ '@waldur/openstack/openstack-volume/OpenstackVolumeDetails'
    ),
  'OpenstackVolumeDetails',
);
const OpenstackVolumeCheckoutSummary = lazyComponent(
  () =>
    import(
      /* webpackChunkName: "OpenstackVolumeCheckoutSummary" */ '@waldur/openstack/openstack-volume/OpenstackVolumeCheckoutSummary'
    ),
  'OpenstackVolumeCheckoutSummary',
);
const OpenstackVolumeCreateForm = lazyComponent<OfferingConfigurationFormProps>(
  () =>
    import(
      /* webpackChunkName: "OpenstackVolumeCreateForm" */ './OpenstackVolumeCreateForm'
    ),
  'OpenstackVolumeCreateForm',
);

const serializer = (attrs) => ({
  ...attrs,
  type: attrs.type && attrs.type.value,
});

registerOfferingType({
  type: 'OpenStackTenant.Volume',
  get label() {
    return translate('OpenStack volume');
  },
  component: OpenstackVolumeCreateForm,
  detailsComponent: OpenstackVolumeDetails,
  checkoutSummaryComponent: OpenstackVolumeCheckoutSummary,
  serializer,
  disableOfferingCreation: true,
  allowToUpdateService: true,
});
