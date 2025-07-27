export interface Repository2<T> {
    findAll2(): T[] | undefined;  
    findOne2(item: { id: string; }): T | undefined;
    create2(item: T): T | undefined;
    update2(item: T): T | undefined;
    delete2(item: { id: string; }): T | undefined;
}