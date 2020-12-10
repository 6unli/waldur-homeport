import moment from 'moment-timezone';
import { ControlLabel, FormGroup } from 'react-bootstrap';
import { Field } from 'redux-form';

import { DateField } from '@waldur/form/DateField';
import { translate } from '@waldur/i18n';

export const OwnerExpirationTimeGroup = ({ disabled }) => (
  <FormGroup>
    <ControlLabel>
      {translate('Organization owner role expires on')}
    </ControlLabel>
    <Field
      name="expiration_time"
      component={DateField}
      disabled={disabled}
      minDate={moment().add(1, 'days').toISOString()}
      weekStartsOn={1}
    />
  </FormGroup>
);
