import { Observable, of, Subject } from "rxjs";
import { StateService } from "./statemanager";

export interface IUserState {
    user: string,
    theme: string,
    mode: number
}

const DEFAULT_USER_STATE: IUserState = {
    user: 'John Do',
    theme: 'light',
    mode: 1
}

export class UserStateService extends StateService<IUserState> {

    private _destroyObs = new Subject<boolean>();

    initialStateObs: () => Observable<IUserState> = 
        () => of(DEFAULT_USER_STATE);
    destroyObs: () => Observable<boolean> = 
        () => this._destroyObs.asObservable();
    sideEffect: (state: IUserState) => void = 
        (state) => console.log('[UserStateService#sideEffect]', state);

    stop = () => this._destroyObs.next(true);
}