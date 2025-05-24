import { Repository2 } from "../shared/repository2.js";
import { Hall } from "./hallEntity.js";

const halls = [
  new Hall(
    3,
    60,
    '9f3a8c7e-2b9d-4c6b-b2d1-ec4e9a57d4f3'
  ),
]

export class HallRepository implements Repository2<Hall>{
    
    public findAll2(): Hall[] | undefined {
        return halls
    }
        
    public findOne2(item: { id: string; }): Hall | undefined {
        return halls.find((hall) => hall.id_hall == item.id)   
    }

    public create2(item: Hall): Hall | undefined {
        halls.push(item)
        return item
    }
    
    public update2(item: Hall): Hall | undefined {
        const hallIdx = halls.findIndex((hall) => hall.id_hall == item.id_hall)

        if(hallIdx != -1){
            halls[hallIdx] = {...halls[hallIdx], ...item} //1er forma de reasignar algo (forma mas fea segun meca)
        }
        return halls[hallIdx]
    }

    public delete2(item: { id: string; }): Hall | undefined {
        const hallIdx = halls.findIndex((hall) => hall.id_hall == item.id)

        if(hallIdx != -1) {
            const deletedHalls = halls[hallIdx] 
            halls.splice(hallIdx, 1)  
            return deletedHalls
        }
    }
}