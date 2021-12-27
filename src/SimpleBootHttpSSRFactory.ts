import { SimpleBootFront } from 'simple-boot-front/SimpleBootFront';
import { ConstructorType } from 'simple-boot-core/types/Types';
export abstract class SimpleBootHttpSSRFactory {
    abstract factory(window: Window, using: ConstructorType<any>[], domExcludes: ConstructorType<any>[]): Promise<SimpleBootFront> ;

    public async create(window: Window, using: ConstructorType<any>[] = [], domExcludes: ConstructorType<any>[] = []): Promise<SimpleBootFront> {
        const front = await this.factory(window, using, domExcludes);
        return front;
    }
}
