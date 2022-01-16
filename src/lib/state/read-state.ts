import { NS } from "bitburner";
import { Port } from "lib/state/port";

export async function main(ns: NS) {
    ns.tprint(ns.peek(Port.STATE));
}