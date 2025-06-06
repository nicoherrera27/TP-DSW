import { Repository2 } from "../shared/repository2.js";
import { Hall } from "./hall.entity.js";

const halls = [
  new Hall(
    3,
    60,
    "H01"
  ),
]

export class HallRepository implements Repository2<Hall>{
    
    public findAll2(): Hall[] | undefined {
        return halls
    }
        
    public findOne2(item: { id: string; }): Hall | undefined {
        return halls.find((hall) => hall.id == item.id)   
    }

    public create2(item: Hall): Hall | undefined {
        halls.push(item)
        return item
    }

    public update2(item: Hall): Hall | undefined {
       const hallIdx = halls.findIndex((hall) => hall.id == item.id)

        if(hallIdx != -1){
            halls[hallIdx] = {...halls[hallIdx], ...item}
        }
        return halls[hallIdx]
    }

    public delete2(item: { id: string; }): Hall | undefined {
        const hallIdx = halls.findIndex((hall) => hall.id == item.id)

        if(hallIdx != -1) {
            const deletedHalls = halls[hallIdx] 
            halls.splice(hallIdx, 1)  
            return deletedHalls
        }
    }
}