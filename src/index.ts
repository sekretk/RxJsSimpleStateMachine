import { StateService } from "./statemanager";
import { of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { UserStateService } from "./userstatemanager";
import { FULL_STATE } from "./interfaces";

const userStateObserver = new UserStateService();

const startTime = Date.now();

const consoleHandler = (prefix: any) => (value: any) => console.log(`At ${Date.now() - startTime}: ${prefix} ${JSON.stringify(value)}`);

//FULL STATE subscriber
userStateObserver
    .stateObservable(FULL_STATE)
    .subscribe(consoleHandler('Consumer, result FULL state: '))

//single prop state subscriber
userStateObserver
    .stateObservable('mode')
    .subscribe(consoleHandler('Consumer, result ONE PROP state: '))    

//multiple props state subscriber
userStateObserver
    .stateObservable(['user', 'mode'])
    .subscribe(consoleHandler('Consumer, result MULTIPLE PROP state: '))    


userStateObserver.save('mode', 1);
userStateObserver.save('mode', 1);
userStateObserver.save('mode', 3);

of(true).pipe(delay(5000)).subscribe(() => userStateObserver.save('mode', 2))