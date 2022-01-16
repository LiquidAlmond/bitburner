import { Host } from "lib/state/host";
import { NS } from "bitburner";
import { Port } from "lib/state/port";

export type State = any;
export type Action = { host?: Host; script: string; parameters?: any[]; };
export type Reducer = (state: State, action: Action) => State;
export type Dispatch = (action: Action) => any;
export type ActionCreator = (...args: any[]) => Action;

export function combineReducers(reducers: { [key: string]: Reducer}): Reducer {
    return (state: State, action: Action) => {
        Object.values(reducers)
            .reduce((newState, reducer) => reducer(newState, action), state);
    }
}

export class Store<T extends State> {
    constructor(private ns: NS) {}

    get state(): T {
        this.ns.print(this.ns.peek(Port.STATE));
        return JSON.parse(this.ns.peek(Port.STATE));
    }

    async dispatch<T extends Action>(action: T) {
        await this.ns.writePort(Port.STATE_CHANGE, JSON.stringify(action));
    }
}