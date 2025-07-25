import { Entity, ManyToOne, OneToMany, ManyToMany, Collection, Cascade, Property, Rel } from "@mikro-orm/mysql";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { ShowCategory } from "../show_category/show_category.entity.js";
import { Movie } from "../movie/movie.entity.js";
import { Ticket } from "../ticket/ticket.entity.js";
import { Movie_room } from "../movie_room/movie_room.entity.js";


@Entity()

export class Show extends BaseEntity{

  @Property()
  date!: string;

  @Property()
  state?:string;

  @ManyToOne({entity: () => ShowCategory})
  showCat!: Rel<ShowCategory>;

  @ManyToOne({entity: () => Movie})
  showMovie!: Rel<Movie>;

  @OneToMany({entity: () =>   Ticket, mappedBy: 'showTicket', cascade: [Cascade.ALL]})
  Tickets = new Collection<Ticket>(this)

  @ManyToOne({entity: () => Movie_room})
  showRoom!: Rel<Movie_room>
}