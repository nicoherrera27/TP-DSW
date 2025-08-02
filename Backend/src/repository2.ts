export interface repository2<T> {
    findAll2(): Promise <T[] | undefined>;  
    findOne2(item: { id: string; }): Promise <T | undefined>
    create2(item: T):Promise <T | undefined>
    update2(item: T):Promise <T | undefined>
    delete2(item: { id: string; }):Promise <T | undefined>
}