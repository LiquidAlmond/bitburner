import { NS } from "bitburner";

export function getHosts(ns: NS): string[] {
    let unprocessed = ns.scan("home");
    let hosts = ["home"];

    while (unprocessed.length > 0) {
        const host = unprocessed.pop();
        hosts.push(host);
        unprocessed.push(...ns.scan(host).filter(host => !hosts.includes(host) && !unprocessed.includes(host)));
    }

    return [...new Set(hosts)];
}