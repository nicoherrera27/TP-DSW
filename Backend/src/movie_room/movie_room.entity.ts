import { Entity, PrimaryKey, Property, OneToMany, Cascade, Collection, ManyToMany } from "@mikro-orm/mysql";
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Show } from "../show/show.entity.js";

@Entity()
export class Movie_room extends BaseEntity{
    
    @Property({nullable: false, unique: true})
    name?: string

    @Property({nullable: false})
    capacity!: number

    @OneToMany(({entity: () =>   Show, mappedBy: 'showRoom', cascade: [Cascade.ALL]}))
    Shows = new Collection<Show>(this)
}