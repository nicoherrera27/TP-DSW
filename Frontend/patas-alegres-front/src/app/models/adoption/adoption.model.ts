export class Adoption {
  id?: number
  animal: number
  person: number
  adoption_date: Date
  comments?: String

  constructor(animal: number, person: number, adoption_date: Date, comments?: String, id?: number) {
    this.comments = comments;
    this.animal = animal;
    this.person = person;
    this.adoption_date = adoption_date;
    this.id = id;
  }
}