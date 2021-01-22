import { isEqual, pick } from "lodash-es";
import { BehaviorSubject, Observable, OperatorFunction, timer, Subject, merge, of, pipe } from "rxjs";
import { scan, filter, delay, shareReplay, tap, takeUntil, exhaustMap, map, distinctUntilChanged } from "rxjs/operators"
import { ExtractionResult, ExtractionSelector, FULL_STATE } from "./statemanager.interface";

export interface IUserState{
    user: string,
    theme: string,
    mode: number
}

const DEFAULT_USER_STATE: IUserState = {
    user: 'John Do',
    theme: 'light',
    mode: 1
}

const DEFAULT_STATE_DELAY = 2000;

const persistanceObservable = of({user: 'Bart Simpson'} as IUserState).pipe(delay(4000));

export const referenceEqualer = <T>(first: T, second: T): boolean => first === second;

//todo: make auto-transformer to curried function
//can be inspired by https://www.freecodecamp.org/news/typescript-curry-ramda-types-f747e99744ab/
export const referenceEqualerCurried = <T>(first: T) => (second: T): boolean => referenceEqualer(first, second);

export const non = <T extends ((...args: Array<unknown>) => boolean)>(fun: T) => (...params: Parameters<T>): boolean => !fun(...params);

/**
 * Extract from input object full\partial\only one prop
 * @param request Can be ALL, Array of properties, one property name, Works only with flat objects
 */
export const partialExtractor = <T, K extends ExtractionSelector<T>>(request: K) =>
    (state: T) : ExtractionResult<T, K> =>
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

export class StateService {

    private dispose$ = new Subject<boolean>();

    private stateObs: Subject<Partial<IUserState>> = new Subject<Partial<IUserState>>();

    private resultState: Observable<IUserState>;

    changeState(partialState: Partial<IUserState>): void {
        this.stateObs.next((partialState));
    }

    stateObservable() {

        if (Boolean(this.resultState))
            return this.resultState;
        else
            return this.resultState = this.stateObservableFabric();

    }

    statePartialObservable<R>(mapOperator: OperatorFunction<IUserState, R>) {
        return this.resultState.pipe(mapOperator);
    }

    private stateObservableFabric = (): Observable<IUserState> => {

        return merge(
            of(DEFAULT_USER_STATE).pipe(delay(DEFAULT_STATE_DELAY)),
            persistanceObservable
        ).pipe(exhaustMap(initState => this.stateObs.pipe(
            takeUntil(this.dispose$),
            scan((acc, curr) => ({ ...acc, ...curr } as IUserState), initState),
            tap(this.handleState),
            shareReplay(1)
        )));
    }

    private handleState(saveState: IUserState) {
        //this.persistanceSrv.Save(state)
        console.log(`Final state is ${JSON.stringify(saveState)}`)
    }

    stop(): void{
        this.dispose$.next(true);

        this.resultState = null;
    }
}
