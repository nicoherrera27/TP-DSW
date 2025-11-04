import { Entity, ManyToOne, OneToMany, Collection, Cascade, Property, Rel } from "@mikro-orm/mysql";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { ShowCategory } from "../show_category/show_category.entity.js";
import { Movie } from "../movie/movie.entity.js";
import { Timetable } from "../time_table/timetable.entity.js";
import { Movie_room } from "../movie_room/movie_room.entity.js";


@Entity()
export class Show extends BaseEntity{

  @Property()
  date!: string;

  @Property()
  state?:string;

  @Property({type: 'boolean', default: false})
  isSpecial: boolean = false;
  
  @Property({ nullable: true })
  variant?: string; 

  @Property({ nullable: true})
  recharge?: number;
  
  @ManyToOne({entity: () => ShowCategory})
  showCat!: Rel<ShowCategory>;

  @ManyToOne({entity: () => Movie})
  showMovie!: Rel<Movie>;

  @OneToMany({entity: () => Timetable, mappedBy: 'show', cascade: [Cascade.ALL]})
  timetables = new Collection<Timetable>(this)

  @ManyToOne({entity: () => Movie_room})
  showRoom!: Rel<Movie_room>
}