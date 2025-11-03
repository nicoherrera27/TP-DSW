import { Entity, ManyToOne, Property, Rel, OneToMany, Collection, Cascade } from "@mikro-orm/mysql";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Show } from "../show/show.entity.js";
import { Ticket } from "../ticket/ticket.entity.js"; 

@Entity()
export class Timetable extends BaseEntity {
    @Property({ type: 'time' })
    time!: string;

    @ManyToOne({ entity: () => Show })
    show!: Rel<Show>;

    @OneToMany({ entity: () => Ticket, mappedBy: 'timetable', cascade: [Cascade.ALL] })
    tickets = new Collection<Ticket>(this);

}