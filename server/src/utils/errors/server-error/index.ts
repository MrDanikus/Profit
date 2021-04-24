export default class ServerError extends Error {
  readonly code: string;
  readonly status: number;
  readonly message: string;
  readonly detail: string;

  /**
   * @param type type of the error
   */
  constructor(status: number, message: string, detail: string, code?: string) {
    super(message);

    this.code = code || '000';
    this.status = status;
    this.message = message;
    this.detail = detail;
  }
}
