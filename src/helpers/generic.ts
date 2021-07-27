import { OperatorFunction, scan } from "rxjs";

export const referenceEqualer = <T>(first: T, second: T): boolean => first === second;

export const referenceEqualerCurried = <T>(first: T) => (second: T): boolean => referenceEqualer(first, second);

export const non = <T extends ((...args: Array<unknown>) => boolean)>(fun: T) => (...params: Parameters<T>): boolean => !fun(...params);

export const mergeToObject = <T>(accumulator: T, increment: Partial<T>): T => ({ ...accumulator, ...increment });
 
/**
 * accumulate partial on state to full object
 * @param defaultValue DEFAULT VALUE to start with
 */
export const accumulate = <T>(defaultValue: T): OperatorFunction<Partial<T>, T> =>
    scan(mergeToObject, defaultValue);
