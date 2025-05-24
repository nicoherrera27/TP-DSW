import { Repository } from "../shared/repository.js"
import { User } from "./userEntity.js"
import { pool } from "../shared/db/conn.js"
import { ResultSetHeader, RowDataPacket } from "mysql2"



export class UserRepository implements Repository<User> {

  public async findAll(): Promise<User[] | undefined>{
    const [users] = await pool.query<RowDataPacket[]>('select * from users')
    if (users.length === 0) {
      return undefined
    }
    return users as User[]
  }

  public async findOne(item: {id: string}): Promise<User | undefined> {

  const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE id_user = ?', [parseInt(item.id)])
  if (users.length === 0) {
    return undefined
  }
  return users[0] as User

  }

  public async create(userInput: User): Promise<User | undefined> {
    const{username, password, name, surname, email, birthdate} = userInput
    const [result]= await pool.query<ResultSetHeader>('INSERT INTO users set ?', [userInput])
    return userInput

  }

  public async update(id:string, item: User): Promise<User | undefined> {
    throw new Error("not implemented.")
  }

  public async delete(item: {id: string}): Promise<User | undefined> {
    throw new Error("not implemented.")
  }

}
