import { NS } from "bitburner";

export async function main(ns: NS) {
    const script = ns.args[0] as string;
    const host = ns.args[1] as string ?? "home";
    const threads = ns.args[2] as number ?? 1;

    ns.tprint(`Attempting to start ${script} on ${host} with ${threads} threads`)

    if (ns.scriptRunning(script, host)) {
        ns.scriptKill(script, host);
    }

    ns.exec(script, host, threads, ...ns.args.slice(3));
}