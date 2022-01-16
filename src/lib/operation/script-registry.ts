import { Script } from "lib/operation/script";
import { Operation } from "lib/operation/operation";
import { AppState } from "app/state/state";

export class ScriptRegistry {
    private static scripts: Script<AppState>[] = [
        {
            id: Operation.NUKE,
            path: "/operation/nuke.js",
            executeCondition: (ns, store) => store.state.enabled.includes(Operation.NUKE),
        },
        {
            id: Operation.SCP,
            path: "/operation/scp.js",
            executeCondition: (ns, store) => store.state.enabled.includes(Operation.SCP),
        },
        {
            id: Operation.HACKING,
            path: "/operation/hack-loop.js",
            executeCondition: (ns, store) => store.state.enabled.includes(Operation.HACKING),
        },
        {
            id: Operation.HACKNET,
            path: "/operation/hacknet.js",
            executeCondition: (ns, store) => store.state.enabled.includes(Operation.HACKNET),
        },
        {
            id: Operation.GANG,
            path: "/operation/gang.js",
            executeCondition: (ns, store) => store.state.enabled.includes(Operation.GANG) && ns.gang.inGang(),
        },
        {
            id: Operation.STOCK,
            path: "/operation/stock.js",
            executeCondition: (ns, store) => store.state.enabled.includes(Operation.STOCK),
        },
        {
            id: Operation.KILLALL,
            path: "/util/killall.js",
            executeCondition: (ns, store) => store.state.enabled.includes(Operation.KILLALL),
        },
        {
            id: Operation.CLEAN,
            path: "/util/clean-all-hosts.js",
            executeCondition: (ns, store) => store.state.enabled.includes(Operation.CLEAN),
        },
        {
            id: Operation.SERVERS,
            path: "/operation/servers.js",
            executeCondition: (ns, store) => store.state.enabled.includes(Operation.SERVERS),
        },
        {
            id: Operation.STATE_MANAGER,
            path: "/state/state-manager.js",
            executeCondition: (ns, store) => store.state.enabled.includes(Operation.STATE_MANAGER),
        }
    ];

    static allScripts(): Script<AppState>[] {
        return [...ScriptRegistry.scripts];
    }
}