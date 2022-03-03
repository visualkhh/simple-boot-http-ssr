import { SimpleBootFront } from 'simple-boot-front/SimpleBootFront';
import { ConstructorType } from 'simple-boot-core/types/Types';
import { SimFrontOption } from 'simple-boot-front/option/SimFrontOption';
export abstract class SimpleBootHttpSSRFactory {
    public abstract factory(simFrontOption: SimFrontOption, using: ConstructorType<any>[], domExcludes: ConstructorType<any>[]): Promise<SimpleBootFront> ;

    public async create(simFrontOption: SimFrontOption, using: ConstructorType<any>[] = [], domExcludes: ConstructorType<any>[] = []): Promise<SimpleBootFront> {
        const front = await this.factory(simFrontOption, using, domExcludes);
        return front;
    }
}
