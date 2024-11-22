export class User {
  id?: number
  username: string
  password: string
  //person: number


  constructor(username: string, password: string ,person: number, id?: number) {
    this.username = username;
    //this.person = person;
    this.password = password;
    this.id = id;
  }
}