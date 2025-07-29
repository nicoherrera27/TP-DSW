import { Repository2 } from "../shared/repository2.js";
import { Gender } from "./gender.entity.js";
import {pool} from "../shared/db/conn.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";


const genders =  [
  new Gender (
  1,
  'Comedia'
  )
]

export class GenderRepository2 implements Repository2 <Gender>{

public async findAll2(): Promise< Gender[] | undefined> {
const [genders] = await pool.query ('SELECT * from gender')
for (const gender of genders as Gender[]){
    const [items] = await pool.query ('SELECT * FROM genderItems where genderId = ?', 
      [gender.id])
      gender.items = (items as {itemName: string}[]).map((item)=> item.itemName);
    }
return genders as Gender[]
}

public async findOne2(item: { id: string; }): Promise<Gender | undefined> {
  const id = Number.parseInt(item.id)
  const [gender] = await pool.query<RowDataPacket[]> ('SELECT * from genders where id = ?', [id])
if (gender.length === 0) {
return undefined;
}
const genders = gender[0] as Gender
    const [items] = await pool.query ('SELECT * FROM genderItems where genderId = ?',
      [gender.id])
      gender.items=(items as {itemName: string}[]).map((item)=> item.itemName);
  
return genders
}

public async create2(genderInput: Gender): Promise <Gender | undefined> {
const {id, items, ...genderRow} = genderInput
const result = await pool.query<ResultSetHeader>('insert into gender set ?', [genderRow])
genderInput.id = resourceLimits.insertId

for (const item of items) {
  await pool.query('insert into genderItems set ?', {gender.Id : genderInput.id, itemName: item} )
}
return genderInput;
}
public async update2(id: string, genderInput: Gender) : Promise<Gender | undefined> {
const {item, ...}= genderInput
  await pool.query ('update genders set ? where id = ?', [genderInput, Number.parseInt(id)])

  await pool.query('delete from genderItems where genderId = ?', [genderRow, Number.parseInt(id)])
  if (item?.length > 0) {
    for (const itemName of items) {
      await pool.query('insert into genderItems set ?', {genderId, itemName} )
    }
  }
  return await this.findOne2 ({ id })
}
public delete2(item: { id: string; }): Promise<Gender | undefined>{
  try{
const genderToDelete = await this.findOne2(item);
const genderid = Number.parseInt(item.id)
await pool.query('delete from genderItems where genderId = ?', genderId)
await pool.query('delete from genders where id = ?', genderId)
return genderToDelete;
}
catch (error:any){
throw new Error ('unable to delete gender')
}

}
}