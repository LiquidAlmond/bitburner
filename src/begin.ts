import { NS } from "bitburner";

export async function main(ns: NS) {
    ns.run("/automation/nuke.js");
    ns.run("/automation/scp.js");
    ns.run("/automation/hack-loop.js");
    ns.run("/automation/gang.js");
}