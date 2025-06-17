import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/mysql";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { ShowCategory } from "../show_category/show_category.entity.js";
import { Movie } from "../movie/movie.entity.js";


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

}