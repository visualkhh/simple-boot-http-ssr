import {ConstructorType} from 'simple-boot-core/types/Types';

export abstract class Fetch {
    abstract text(path: string, trigger: ConstructorType<any>, dirname?: string): Promise<string | void>;
    // eslint-disable-next-line no-unused-vars
    abstract actionText<T = any>(request?: any): Promise<T | void>;
    abstract actionJson<T = any>(request?: any): Promise<T | void>;
}
