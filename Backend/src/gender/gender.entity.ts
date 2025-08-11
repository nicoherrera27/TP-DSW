import { Entity, Property, OneToMany, ManyToMany, Collection, ManyToOne, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Movie } from "../movie/movie.entity.js";
@Entity()
export class Gender extends BaseEntity {
    
    @Property({nullable: false})
    id!: number

    @Property({ nullable: false})
    name!: string
      
     @OneToMany({entity: () => Movie, mappedBy: 'genderMovie', cascade: [Cascade.ALL]})
      movies = new Collection<Movie>(this)
}
