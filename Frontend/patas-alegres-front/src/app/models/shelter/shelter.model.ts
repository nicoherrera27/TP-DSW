import { Rescue } from "../rescue/rescue.model.js";
import { Zone } from "../zone/zone.model.js";

export class Shelter {
  id?: number;
  name: string;
  address: string;
  max_capacity: number;
  zone: Zone;
  vet?: string | null;
  rescues: Rescue[] = [];

  constructor(name: string, address: string, max_capacity: number, zone: Zone, vet?: string | null, rescues: Rescue[] = [], id?: number){
    this.name = name;
    this.address = address;
    this.max_capacity = max_capacity;
    this.zone = zone;
    this.vet = vet ?? null;
    this.rescues = rescues;
    this.id = id;
  }
}
