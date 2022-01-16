import { NS } from "bitburner";
import { Port } from "lib/state/port";
import { Action } from "lib/state/state";
import { Host } from "lib/state/host";

export async function main(ns: NS) {
    ns.disableLog("ALL");

    const statePath = ns.args[0] as string;

    if (!ns.fileExists(statePath)) {
        await ns.write(statePath, [JSON.stringify({})], "w");
    }
    await ns.writePort(Port.STATE, ns.read(statePath));

    while (true) {
        while (ns.peek(Port.STATE_CHANGE) !== "NULL PORT DATA") {
            const rawAction = ns.readPort(Port.STATE_CHANGE);
            try {
                const action: Action = JSON.parse(rawAction);
                let { script, host, parameters } = action;
                host = host ?? Host.HOME;
                parameters = parameters ?? [];

                ns.exec(script, host, 1, statePath, ...parameters);
                while (ns.isRunning(script, host, ...parameters)) await ns.sleep(100);
            } catch (err) {
                ns.print(`Unable to parse action:\n${rawAction}`);
            }
        }
        await ns.sleep(100);

        if (ns.peek(Port.STATE) !== ns.read(statePath)) {
            await ns.writePort(Port.STATE, ns.read(statePath));
            let _ = ns.readPort(Port.STATE);
        }
    }
}