import { NS } from "bitburner";

export async function main(ns: NS) {
    for (let port = 1; port <= 20; port++) {
        let data = "";
        while(data !== "NULL PORT DATA") {
            data = ns.readPort(port);

            if (data !== "NULL PORT DATA") {
                ns.print(`Data on port ${port} of ${data}`);
            }
        }
    }
}