import { Action } from "app/state/action";
import { AppState } from "app/state/state";
import { NS } from "bitburner";
import { Operation } from "lib/operation/operation";
import { Store } from "lib/state/state";

export async function main(ns: NS) {
    ns.disableLog("ALL");

    await ns.sleep(1000);
    const store = new Store<AppState>(ns);

    // Kill all scripts.
    await store.dispatch({ script: Action.ENABLE_OPERATION, parameters: [Operation.KILLALL, "boot.js,/lib/state/state-manager.js"] });
    await store.dispatch({ script: Action.ENABLE_OPERATION, parameters: [Operation.CLEAN] });

    await ns.sleep(1000);

    // Reset state.
    await store.dispatch({ script: Action.CLEAR });
    await store.dispatch({ script: Action.REFRESH_SERVERS });
    await store.dispatch({ script: Action.REFRESH_UTILITIES });
    
    await ns.sleep(1000);

    // Run operations.
    await store.dispatch({ script: Action.ENABLE_OPERATION, parameters: [Operation.NUKE] });
    await store.dispatch({ script: Action.ENABLE_OPERATION, parameters: [Operation.SCP] });
    await store.dispatch({ script: Action.ENABLE_OPERATION, parameters: [Operation.HACKING] });
    //await store.dispatch({ script: Action.ENABLE_OPERATION, parameters: [Operation.HACKNET] });
    await store.dispatch({ script: Action.ENABLE_OPERATION, parameters: [Operation.SERVERS] });
    //await store.dispatch({ script: Action.ENABLE_OPERATION, parameters: [Operation.STOCK] });
    //await store.dispatch({ script: Action.ENABLE_OPERATION, parameters: [Operation.GANG] });
}
