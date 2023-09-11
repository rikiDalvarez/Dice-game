export class User {
  readonly email: string;
  readonly name: string | null;
  readonly password: string;
  private _registrationDate: Date;

  constructor(email: string, password: string, name: string | null = null) {
    this.email = email;
    this.name = name;
    this.password = password;
    this._registrationDate = new Date();
  }

  public set registrationDate(date) {
    this._registrationDate = date
  }

  public get registrationDate(): Date {
    return this._registrationDate
  }

}
