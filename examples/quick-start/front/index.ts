import Factory, { MakeSimFrontOption } from '@src/bootfactory';
import { ConstructorType } from 'simple-boot-core/types/Types';
import {UserFrontService} from '@front/services/UserFrontService';

const using: ConstructorType<any>[] = [
    UserFrontService
];
Factory.create(MakeSimFrontOption(window), using).then(it => {
    it.run()
});
