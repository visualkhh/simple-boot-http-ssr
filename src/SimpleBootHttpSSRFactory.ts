import {SimpleBootFront} from 'simple-boot-front/SimpleBootFront';
//
export class SimpleBootHttpSSRFactory {
    createFront(window: Window, using: any[] = [], domExcludes: any[] = []): Promise<SimpleBootFront> {
       throw Error('overwrite me');
    }
}