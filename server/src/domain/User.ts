export class User {
  //email is unique
  readonly email: string;
  readonly name: string;
  readonly password: string;
  readonly registrationDate: Date;

  constructor(email: string, password: string, name: string = "unknown") {
    this.email = email;
    this.name = name;
    this.password = password;
    this.registrationDate = new Date();
  }
}
