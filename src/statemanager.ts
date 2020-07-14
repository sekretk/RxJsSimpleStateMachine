import { BehaviorSubject, Observable, OperatorFunction, timer, Subject, merge, of } from "rxjs";
import { scan, filter, delay, shareReplay, tap, takeUntil, exhaustMap } from "rxjs/operators"

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
