import Factory, { MakeSimFrontOption } from '@src/bootfactory';
import { ConstructorType } from 'simple-boot-core/types/Types';

const using: ConstructorType<any>[] = [
];
Factory.create(MakeSimFrontOption(window), using).then(it => {
    it.run()
});
