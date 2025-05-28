export class User{
  constructor(
    public id_user: number,
    public username: string, 
    public name: string,
    public surname: string, 
    public email: string,
    public birthdate: string,
    public password: string,
  ){}
}