import { FormControl, FormGroup } from 'react-bootstrap';

import { translate } from '@waldur/i18n';

export const UserGroup = ({ editUser }) =>
  editUser ? (
    <FormGroup>
      <FormControl.Static>
        <strong>{translate('User')}</strong>:{' '}
        {editUser.full_name || editUser.username}
      </FormControl.Static>
    </FormGroup>
  ) : null;
