import { Action } from "app/state/action";
import { AppState } from "app/state/state";
import { NS } from "bitburner";
import { Operation } from "lib/operation/operation";
import { Host, PurchasedHosts } from "lib/state/host";
import { Store } from "lib/state/state";

function selectSmallestServer(state: AppState): { name: Host; ram: number; } {
    for (let host of PurchasedHosts) {
        if (!state.usableHosts.some(h => h.name === host)) {
            return { name: host as Host, ram: 1 };
        }
    }
    return state.usableHosts
        .filter(h => PurchasedHosts.includes(h.name))
        .sort((a,b) => a.ram - b.ram)
        .find(h => true);
}

export async function main(ns: NS) {
    ns.disableLog("ALL");

    const store = new Store<AppState>(ns);
    let state = store.state;

    let server = selectSmallestServer(state);

    while (state.enabled.includes(Operation.SERVERS)) {
        const newSize = Math.min(ns.getPurchasedServerMaxRam(), server.ram * 8);

        while (ns.getPurchasedServerCost(newSize) > ns.getServerMoneyAvailable("home")) {
            ns.print(`Waiting for player money to be ${ns.getPurchasedServerCost(newSize)} to buy server with ${newSize}GB ram.`)
            await ns.sleep(30000);
        }

        await store.dispatch({ script: Action.SET_SERVER_RAM, parameters: [server.name, 0] });
        await ns.sleep(200);

        await store.dispatch({ script: Action.DELETE_SERVER, parameters: [server.name] });
        await ns.sleep(1000);

        await store.dispatch({ script: Action.PURCHASE_SERVER, parameters: [server.name, newSize] });
        await ns.sleep(1000);

        state = store.state;
        server = selectSmallestServer(state);
    }
}