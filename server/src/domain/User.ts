export class User {
  readonly email: string;
  readonly name?: string;
  readonly password: string;
  readonly registrationDate: Date;

  constructor(
    name: string = "unknown",
    email: string,
    password: string,
  ) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.registrationDate = new Date();
  }
}