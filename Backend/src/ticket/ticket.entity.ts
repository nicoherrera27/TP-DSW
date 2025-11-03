import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/mysql";
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Sale } from "../sale/sale.entity.js";
import { Show } from "../show/show.entity.js";
import { TicketType } from "../ticket_type/ticketType.entity.js";
import { Timetable } from "../time_table/timetable.entity.js";

@Entity()
export class Ticket extends BaseEntity{
    
    @Property({nullable: false}) 
    type!: string

    @Property({nullable: true}) 
    row?: number

    @Property({nullable: true}) 
    column?: number

    @ManyToOne({entity: () => Sale})
    ticketSale!: Rel<Sale>

    @ManyToOne({entity: () => Show})
    showTicket!: Rel<Show>

    @ManyToOne({ entity: () => Timetable, nullable: false })
    timetable!: Rel<Timetable>;

    @ManyToOne({ entity: () => TicketType, nullable: true })
    ticketType?: Rel<TicketType>;

}