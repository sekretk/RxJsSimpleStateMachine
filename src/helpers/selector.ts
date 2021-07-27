import { distinctUntilChanged, map, OperatorFunction, pipe } from "rxjs";
import { referenceEqualer } from ".";
import { ExtractionResult, ExtractionSelector, FULL_STATE } from "../interfaces";
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

/**
 * Extract from input object full\partial\only one prop
 * @param request Can be ALL, Array of properties, one property name, Works only with flat objects
 */
 export const partialExtractor = <T, K extends ExtractionSelector<T>>(request: K) =>
 (state: T): ExtractionResult<T, K> =>
     (request === FULL_STATE
         ? state
         : Array.isArray(request)
             ? pick(state, request)
             : state[request as keyof T]) as ExtractionResult<T, K>;

/**
* provide only changed partial original state
* @param request Can be ALL, Array of properties, one property name
*/
export const observableSelector = <T, K extends ExtractionSelector<T>>(request: K): OperatorFunction<T, ExtractionResult<T, K>> =>
 pipe(
     map(partialExtractor(request)),
     distinctUntilChanged(Array.isArray(request) ? isEqual : referenceEqualer),
 );