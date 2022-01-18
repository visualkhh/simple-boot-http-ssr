import { getSim } from 'simple-boot-core/decorators/SimDecorator';

export const SaveAroundAfter = (obj: any, propertyKey: string, args: any[], beforeReturn: any) => {
    // console.log('SaveAroundAfter', obj, args, beforeReturn);
    const simstanceManager = obj._SimpleBoot_simstanceManager;
    const simOption = obj._SimpleBoot_simOption;
    const config = getSim(obj);
    if (simstanceManager && simOption && config?.scheme) {
        if (!simOption.window.aroundStorage) {
            simOption.window.aroundStorage = {};
        }
        if (beforeReturn instanceof Promise) {
            beforeReturn.then((it) => {
                // console.log('SaveAroundAfter', obj, args, beforeReturn); 
                simOption.window.aroundStorage[config.scheme+'_'+propertyKey] = JSON.stringify(it);
                return it;
            });
        } else {
            simOption.window.aroundStorage[config.scheme+'_'+propertyKey] = JSON.stringify(beforeReturn);
        }
    }
    return beforeReturn;
}


export const getStorage = (window: Window) => {
    return (window as any).aroundStorage;
}