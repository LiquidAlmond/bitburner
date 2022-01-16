import { Action } from "app/state/action";
import { AppState } from "app/state/state";
import { NS } from "bitburner";
import { Host, PurchasedHosts } from "lib/state/host";
import { Store } from "lib/state/state";

export async function main(ns: NS) {
    const name = ns.args[1] as Host;

    const store = new Store<AppState>(ns);

    if (ns.serverExists(name) && PurchasedHosts.includes(name)) {
        ns.killall(name);
        ns.deleteServer(name);
        await store.dispatch({ script: Action.SET_SERVER, parameters: [name] });
    }
}