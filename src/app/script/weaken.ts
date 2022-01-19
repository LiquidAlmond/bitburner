import { AppState } from "app/state/state";
import { NS } from "bitburner";
import { Operation } from "lib/operation/operation";
import { Store } from "lib/state/state";

export async function main(ns: NS) {
    const id = ns.args[0] as number;

    const store = new Store<AppState>(ns);
    let state = store.state;

    while (state.enabled.includes(Operation.HACKING)) {
        await ns.weaken(state.hacking.target);
        state = store.state;
    }
}