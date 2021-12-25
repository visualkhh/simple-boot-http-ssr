import { SimpleBootFront } from 'simple-boot-front/SimpleBootFront';
import { ConstructorType } from 'simple-boot-core/types/Types';
import { FirstCheckMaker } from 'simple-boot-core/simstance/SimstanceManager';
import { SaveInjectConfig } from 'simple-boot-core/decorators/inject/Inject';
import { getSim } from 'simple-boot-core/decorators/SimDecorator';
import { StorageUtils } from 'simple-boot-front/utils/storage/StorageUtils';
import { InjectSSRSituationType } from './decorators/inject/InjectSSRSituationType';

//
export abstract class SimpleBootHttpSSRFactory {
    abstract factory(window: Window, using: ConstructorType<any>[], domExcludes: ConstructorType<any>[]): Promise<SimpleBootFront> ;

    public async create(window: Window, using: ConstructorType<any>[] = [], domExcludes: ConstructorType<any>[] = []): Promise<SimpleBootFront> {
        const front = await this.factory(window, using, domExcludes);
        const firstCheckMaker: FirstCheckMaker = (obj: { target: Object, targetKey?: string | symbol }, type: ConstructorType<any>, idx: number, saveInjectionConfig?: SaveInjectConfig) => {
            const sim = getSim(obj.target);
            if (saveInjectionConfig && sim?.scheme && InjectSSRSituationType.RELOAD_INIT_DATA === saveInjectionConfig?.config?.situationType) {
                console.log('[SimpleBootHttpSSRFactory]', 'firstCheckMaker', 'saveInjectionConfig', saveInjectionConfig);
                const data = StorageUtils.cutLocalStorageJsonItem<any>(InjectSSRSituationType.RELOAD_INIT_DATA + '_' + sim.scheme, front.option.window)
                if (data) {
                    return data;
                } else {
                    return null;
                }
            }
        }
        front.elementAndComponentOnInitFirstCheckMakers.push(firstCheckMaker);
        return front;
    }
}
