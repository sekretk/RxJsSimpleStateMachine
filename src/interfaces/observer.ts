import { Observable } from "rxjs";

/**
 * type to get type of property type of argument
 */
export type ObjectPropertyType<T, P extends keyof T> = T[P];

/**
 * to use fro referece full object
 */
export type FullObjectLiteral = 'ALL';

/**
 * Describe subset of props on argumet type
 */
export type ExtractionSelector<T> = keyof T | Array<keyof T> | FullObjectLiteral;

export const FULL_STATE: FullObjectLiteral = 'ALL';

/**
 * extract from array of string union type
 */
type LiteralType<T extends Array<unknown>> = T extends Array<infer R> ? R : never;

/**
 * from property selector return agrument actual selection
 * from type {A: string, B: number} with selector 'A' return 'string'
 * from type {A: string, B: number, C: boolean} with selector ['A', 'C'] return {A: string, C: boolean}
 */
export type ExtractionResult<T, K extends ExtractionSelector<T>> =
    K extends FullObjectLiteral ? T :
        K extends Array<keyof T> ? Pick<T, Extract<keyof T, LiteralType<K>>> :
            ObjectPropertyType<T, Exclude<K, FullObjectLiteral | Array<keyof T>>>;

export interface IStateService<T> {
    changeState: (partialState: Partial<T> ) => void,
    stateObservable: <K extends ExtractionSelector<T>>(selector: K) => Observable<ExtractionResult<T, K>>;
    stop: () => void;
}

export interface IStateObserver<T> {
    stateObservable<S extends ExtractionSelector<T>>(prop: S): Observable<ExtractionResult<T, S>>;
}
 
export interface IStateManager<T> extends IStateObserver<T> {
    save<K extends keyof T>(key: K, value: T[K]): void;
}
 
export type IStateManagerService<T> = IStateManager<T>;