import { NS } from "bitburner";
import { Operation } from "lib/operation/operation";
import { Store } from "lib/state/state";

export interface Script<T> {
    id: Operation;
    path: string;
    executeCondition: (ns: NS, store: Store<T>) => boolean;
}
