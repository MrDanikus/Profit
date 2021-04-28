import {
  Vendors,
  VendorModel,
  VendorDocument,
} from '../../../models/users/vendor';

import {AuthenticationFactory} from '../base';

export class VendorAuthentication extends AuthenticationFactory<VendorDocument> {
  constructor(login: string, password: string) {
    super(login, password);
  }
  protected getModel(): VendorModel {
    return Vendors;
  }
}
