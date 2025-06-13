import { Entity, PrimaryKey, Property, OneToMany, Cascade, Collection } from "@mikro-orm/mysql";
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Hall extends BaseEntity{
    
    @Property({nullable: false, unique: true})
    name!: string

    @Property({nullable: false})
    capacity!: number
}