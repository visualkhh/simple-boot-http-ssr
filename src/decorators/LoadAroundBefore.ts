import { getSim } from 'simple-boot-core/decorators/SimDecorator';
import { AroundForceReturn } from 'simple-boot-core/decorators/aop/AOPDecorator';
import { StorageUtils } from 'simple-boot-front/utils/storage/StorageUtils';
import { ReflectUtils } from 'simple-boot-core/utils/reflect/ReflectUtils';

export const LoadAroundBefore = (obj: any, propertyKey: string, args: any[]) => {
    const simstanceManager = obj._SimpleBoot_simstanceManager;
    const simOption = obj._SimpleBoot_simOption;
    const config = getSim(obj);
    if (simstanceManager && simOption && config?.scheme) {
        const type = ReflectUtils.getReturnType(obj, propertyKey);
        const data = StorageUtils.cutLocalStorageJsonItem<any>(config.scheme + '_' + propertyKey, simOption.window);
        if (data) {
            let rdata = undefined;
            if (type === Promise) {
                rdata = Promise.resolve(data);
            } else {
                rdata = data;
            }
            throw new AroundForceReturn(rdata);
        } else {
            return args;
        }
    }
    return args;
    // if (simstanceManager && simOption && config?.scheme) {
    //     if (beforeReturn instanceof Promise) {
    //         beforeReturn.then((it) => {
    //             console.log('SaveAroundAfter', obj, args, beforeReturn);
    //             simOption.window.aroundStorage[config.scheme+'_'+propertyKey] = it;
    //             return it;
    //         });
    //     } else {
    //         simOption.window.aroundStorage[config.scheme+'_'+propertyKey] = beforeReturn;
    //     }
    // }
    // return beforeReturn;
}
