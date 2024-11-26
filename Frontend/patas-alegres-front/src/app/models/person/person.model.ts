import { User } from "../user/user.model.js";

export class Person {
  id?: number;
  name: string; // no
  surname: string; // no
  doc_type: string; // no
  doc_nro: string; // no
  email: string; // nullable
  phone: string; // nullable
  birthdate: Date; // no
  address: string; // no 
  nroCuit: number; // nullable
  createdAt: Date; // no
  updatedAt: Date; // no
  user: User;

  constructor(name: string, surname: string, doc_type: string, doc_nro: string, email: string, phone: string, birthdate: Date, address: string, nroCuit: number, createdAt: Date, updatedAt: Date, user: User) {
    this.name = name;
    this.surname = surname;
    this.doc_type = doc_type;
    this.doc_nro = doc_nro;
    this.email = email;
    this.phone = phone;
    this.birthdate = birthdate;
    this.address = address;
    this.nroCuit = nroCuit;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.user = user;
  }
}
