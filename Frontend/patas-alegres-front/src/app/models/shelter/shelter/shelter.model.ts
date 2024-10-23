import { Rescue } from "../../rescue/rescue.model.js";
import { Zone } from "../../zone/zone.model.js";

export class Shelter {
  id?: number;
  name: string;
  address: string;
  max_capacity: number;
  zone: Zone;
  vet?: string | null;
  rescues: Rescue[] = [];
  createdAt: Date;
  updatedAt: Date;

  constructor(name: string, address: string, max_capacity: number, zone: Zone, createdAt: Date, updatedAt: Date, vet?: string | null, rescues: Rescue[] = [], id?: number){
    this.name = name;
    this.address = address;
    this.max_capacity = max_capacity;
    this.zone = zone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.vet = vet ?? null;
    this.rescues = rescues;
    this.id = id;
  }
}
