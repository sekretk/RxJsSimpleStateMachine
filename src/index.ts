import { StateService } from "./statemanager";
import { of } from "rxjs";
import { delay, map } from "rxjs/operators";

const stateMachine = new StateService();

const startTime = Date.now();

const consoleHandler = (prefix: any) => (value: any) => console.log(`At ${Date.now() - startTime}: ${prefix} ${JSON.stringify(value)}`);

stateMachine.stateObservable().subscribe(consoleHandler('Consumer, result state: '))

stateMachine.statePartialObservable(map(state => state.user)).subscribe(consoleHandler('User consumer, result state: '))

of(true).pipe(delay(5000)).subscribe(() => stateMachine.changeState({mode: 2}))