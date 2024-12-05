export class User {
  id?: number
  username: string
  password: string


  constructor(username: string, password: string ,person: number, id?: number) {
    this.username = username;
    this.password = password;
    this.id = id;
  }
}