export namespace UserService {
    export const scheme = 'UserService';
    export interface UserService {
        say: (prefix: string) => void;
    }
}
