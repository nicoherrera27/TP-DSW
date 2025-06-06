import { Repository2 } from "../shared/repository2.js";
import { Gender } from "./gender.entity.js";

const genders =  [
  new Gender (
  1,
  'Comedia'
  )
]

export class GenderRepository2 implements Repository2 <Gender>{

public findAll2(): Gender[] | undefined {
    return genders;
}
public findOne2(item: { id: string; }): Gender | undefined {
   return genders.find((gender) => gender.id === parseInt(item.id))
}

public create2(item: Gender): Gender | undefined {
genders.push(item)
return item;
}

public update2(item: Gender) : Gender | undefined {
const genderIdx = genders.findIndex((gender) => gender.id === (item.id))

if(genderIdx !== -1) {
genders[genderIdx] = {... genders[genderIdx], ...item}
}
return genders[genderIdx];
}

public delete2(item: { id: string; }): Gender | undefined {
    const genderIdx = genders.findIndex((gender) => gender.id === parseInt(item.id))

if(genderIdx !== -1) {
 const deletedgenders = genders[genderIdx]
 genders.splice(genderIdx, 1)
  return deletedgenders
}
}
}