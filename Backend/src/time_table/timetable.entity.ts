import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/mysql";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Show } from "../show/show.entity.js";

@Entity()
export class Timetable extends BaseEntity {
    @Property({ type: 'time' }) // Usamos el tipo 'time' de la base de datos
    time!: string;

    @ManyToOne({ entity: () => Show })
    show!: Rel<Show>;
}