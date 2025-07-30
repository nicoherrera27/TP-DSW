import { Entity, PrimaryKey, Property, OneToMany, Cascade, Collection, ManyToMany } from "@mikro-orm/mysql";
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Seat } from "../seat/seat.entity.js";
import { Show } from "../show/show.entity.js";

@Entity()
export class Movie_room extends BaseEntity{
    
    @Property({nullable: false, unique: true})
    name?: string

    @Property({nullable: false})
    capacity!: number

    @OneToMany(({entity: () =>   Show, mappedBy: 'showRoom', cascade: [Cascade.ALL]}))
    shows = new Collection<Show>(this)

    @OneToMany(({entity: () => Seat, mappedBy: 'seatRoom', cascade: [Cascade.ALL]}))
    seats = new Collection<Seat>(this)
}