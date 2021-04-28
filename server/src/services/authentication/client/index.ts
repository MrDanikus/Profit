import {
  Clients,
  ClientModel,
  ClientDocument,
} from '../../../models/users/client';

import {AuthenticationFactory} from '../base';

export class ClientAuthentication extends AuthenticationFactory<ClientDocument> {
  constructor(login: string, password: string) {
    super(login, password);
  }
  protected getModel(): ClientModel {
    return Clients;
  }
}
