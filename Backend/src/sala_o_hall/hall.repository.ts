import { Repository } from "../shared/repository.js";
import { Hall } from "./hall.entity.js";
import { pool } from "../shared/db/conn.mysql.js";
import { ResultSetHeader, RowDataPacket } from "mysql2"

export class HallRepository implements Repository<Hall> {
   
    public async findAll(): Promise<Hall[] | undefined>{
        const [halls] = await pool.query<RowDataPacket[]>('select * from halls')
        if (halls.length === 0) {
            return undefined
        }
        return halls as Hall[]
    }
        
    public async findOne(item: { id: string; }): Promise <Hall | undefined> {
        const id = Number.parseInt(item.id)
        const[halls] = await pool.query<RowDataPacket[]>('select * from halls = ?',[id])
        if(halls.length == 0){
            return undefined
        }
        return halls[0] as Hall 
    }

    public async create(hallInput: Hall): Promise <Hall | undefined> {
        const{id, capacity, number} = hallInput
        const [result] = await pool.query<ResultSetHeader>('insert into halls set ?', [hallInput])
        return hallInput
    }

    public async update(id: string, hallInput: Hall): Promise <Hall | undefined> {
        const hallId = Number.parseInt(id)
        const{capacity, number} = hallInput
        await pool.query('update halls set ? where id = ?', [hallInput, hallId])
        return await this.findOne({id})
    }

    public async delete(item: { id: string; }): Promise <Hall | undefined> {
        try{
        const hallToDelete = await this.findOne(item);
        const hallId = Number.parseInt(item.id)
        await pool.query('delete from halls where id = ?', hallId)
        return hallToDelete
        } catch (error: any){
            throw new Error('unable to delete hall')
        }
    }
}