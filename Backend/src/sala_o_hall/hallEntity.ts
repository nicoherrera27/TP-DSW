import crypto from 'node:crypto'

export class Hall{
  constructor(
    public num_hall: number,
    public capacity: number, 
    public id_hall: string,
  ){}
}