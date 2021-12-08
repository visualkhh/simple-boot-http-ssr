import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
import {ConstructorType} from 'simple-boot-core/types/Types';
//
export class SimpleBootHttpSSRFactory {
    createFront(window: Window, using: ConstructorType<any>[] = [], domExcludes: ConstructorType<any>[] = []): Promise<SimpleBootFront> {
       throw Error('overwrite me');
    }
}