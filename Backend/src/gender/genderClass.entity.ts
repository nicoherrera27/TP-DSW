import { 
    Entity,
    OneToMany,
    PrimaryKey,
    Property,
    Cascade,
    Collection,
    BaseEntity
    } from "@mikro-orm/core";
import {Gender} from "./gender.entity.js";
import { Movie } from "../movie/movie.entity.js";


@Entity()
export class GenderClass extends BaseEntity{
   
     @Property({nullable: false})
    id!: number

    @Property({nullable:false, unique: true}) //elemento obligatorio
    name!: string;

    @OneToMany({entity: () => Movie, mappedBy: 'id', cascade: [Cascade.ALL]} )
    movies = new Collection<Movie>(this);
}
