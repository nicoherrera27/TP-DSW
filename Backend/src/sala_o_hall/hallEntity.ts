import crypto from 'node:crypto'

export class hall{
  constructor(
    public num_hall: number,
    public capacity: number, 
    public id_hall= crypto.randomUUID(),
  ){}
}