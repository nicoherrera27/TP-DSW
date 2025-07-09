import { Entity, PrimaryKey, Property, OneToMany, Cascade, Collection } from "@mikro-orm/mysql";
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Seat extends BaseEntity{
    
    @Property({nullable: false})
    row!: number

    @Property({nullable: false})
    number!: number


    //ManyToMany con movie room
}