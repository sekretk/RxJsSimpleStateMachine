import { Observable, of, ReplaySubject, Subscription, concat, NEVER } from "rxjs";
import { delay, shareReplay, tap, takeUntil, first, finalize } from "rxjs/operators"
import { accumulate, observableSelector } from "./helpers";
import { ExtractionResult, ExtractionSelector, IStateManagerService } from "./interfaces";

export abstract class StateService<TState> implements IStateManagerService<TState> {

    abstract initialStateObs: () => Observable<TState>;
    abstract destroyObs: () => Observable<boolean>;
    abstract sideEffect: (state: TState) => void;
 
    private stateChangesObs = new ReplaySubject<Partial<TState>>();
 
    private _fullStateObs?: Observable<TState>;
 
    private stateSubscription?: Subscription;
 
    private getFullStateObs = (): Observable<TState> =>
        this._fullStateObs ?? (this._fullStateObs =
            concat(
                this.initialStateObs().pipe(first()),
                this.stateChangesObs,
            ).pipe(
                takeUntil(this.destroyObs()),
                finalize(() => delete this._fullStateObs),
                accumulate({} as TState),
                tap(this.sideEffect),
                shareReplay(1),
            )
        );
 
    private innerSubscribe = (): Subscription =>
        this.stateSubscription ?? (
            this.stateSubscription = this.getFullStateObs().pipe(
                takeUntil(this.destroyObs()),
                finalize(() => delete this.stateSubscription)
            ).subscribe());
 
    stateObservable = <S extends ExtractionSelector<TState>>(request: S):Observable<ExtractionResult<TState, S>> =>
        this.getFullStateObs().pipe(
            observableSelector(request),
        );
 
    save = <K extends keyof TState>(key: K, value: TState[K]): void =>
        this.innerSubscribe() && this.stateChangesObs.next({ [key]: value } as unknown as Partial<TState>); 
}