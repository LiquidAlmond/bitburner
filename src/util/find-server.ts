import { NS } from "bitburner";
import { Host } from "lib/state/host";

interface Node {
    name: string;
    neighbors: string[];
    parent?: Node;
}

const rootNode: Node = {
    name: "Root",
    neighbors: [Host.HOME],
}

export async function main(ns:NS) {
    const target = ns.args[0] as string;

    const connected: Node[] = [rootNode].concat(Object.values(Host)
        .filter(host => ns.serverExists(host))
        .map(host => ({
            name: host,
            neighbors: ns.scan(host),
        })));
    
    while (connected.some(node => !node.parent)) {
        for (let node of connected) {
            if (!node.parent) continue;
            connected.filter(child => node.neighbors.includes(child.name) && !child.parent)
                .forEach(child => child.parent = node);
        }
    }

    ns.tprint(rootNode);
}