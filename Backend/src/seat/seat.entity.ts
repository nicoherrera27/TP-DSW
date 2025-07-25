import { Entity, PrimaryKey, Property, OneToMany, ManyToMany, Cascade, Collection, ManyToOne, Rel } from "@mikro-orm/mysql";
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Movie_room } from "../movie_room/movie_room.entity.js";

@Entity()
export class Seat extends BaseEntity{
    
    @Property({nullable: false})
    row!: number

    @Property({nullable: false})
    number!: number

    @ManyToOne({entity: () => Movie_room})
    seatRoom!: Rel<Movie_room>
}