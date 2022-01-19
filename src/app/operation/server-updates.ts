import { Action } from "app/state/action";
import { AppState } from "app/state/state";
import { NS } from "bitburner";
import { Operation } from "lib/operation/operation";
import { Store } from "lib/state/state";

export async function main(ns: NS) {
    const store = new Store<AppState>(ns);
    let state = store.state;

    while (state.enabled.includes(Operation.SERVER_UPDATES)) {
        await store.dispatch({ script: Action.REFRESH_SERVERS });
        await store.dispatch({ script: Action.REFRESH_UTILITIES });

        await ns.sleep(60000);
        state = store.state;
    }
}