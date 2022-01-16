import { AppState } from "app/state/state";
import { NS } from "bitburner";
import { Operation } from "lib/operation/operation";
import { Store } from "lib/state/state";

export async function main(ns: NS) {
    const id = ns.args[0] as number;

    const store = new Store<AppState>(ns);
    let state = store.state;

    while (state.enabled.includes(Operation.HACKING) && !state.hacking.processes.find(proc => proc.id === id)) {
        await ns.sleep(1000);
        state = store.state;
    }

    while (state.enabled.includes(Operation.HACKING)) {
        const target = state.hacking.processes.find(proc => proc.id === id).target;
        await ns.grow(target);
        state = store.state;
    }
}