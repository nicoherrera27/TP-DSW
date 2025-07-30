import { Repository2 } from "../shared/repository2.js";
import { Gender } from "./gender.entity.local.js";
import { pool } from "../shared/db/conn.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class GenderRepository implements Repository2<Gender>{

  public async findAll2(): Promise<Gender[] | undefined> {
    const [genders] = await pool.query <RowDataPacket[]>('SELECT * from genders')
    if (genders.length === 0) {
      return undefined;
    }
    return genders as Gender[]
  }

  public async findOne2(item: { id: string; }): Promise<Gender | undefined> {

    const [genders] = await pool.query<RowDataPacket[]> ('SELECT * from genders where id = ?', [parseInt(item.id)])
    if (genders.length === 0) {
      return undefined;
    } 
    return genders[0] as Gender
  }

  public async create2(genderInput: Gender): Promise <Gender | undefined> {
    const {id, name} = genderInput
    const result = await pool.query<ResultSetHeader>('INSERT INTO genders set ?', [genderInput])
    return genderInput
  }

  public async update2(id: string, item: Gender) : Promise<Gender | undefined> {
    
    throw new Error("not implemented.")

  }

  public delete2(item: { id: string; }): Promise<Gender | undefined>{
    
    throw new Error("not implemented.")

  }


}