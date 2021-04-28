import {Admins, AdminModel, AdminDocument} from '../../../models/users/admin';
import {AuthenticationFactory} from '../base';

export class AdminAuthentication extends AuthenticationFactory<AdminDocument> {
  constructor(login: string, password: string) {
    super(login, password);
  }
  protected getModel(): AdminModel {
    return Admins;
  }
}
