import { NS } from "bitburner";
import { getHosts } from "util/get-hosts";

export async function main(ns: NS) {
    getHosts(ns).filter(host => host !== "home")
        .forEach(host =>
            ns.ls(host, ".js").forEach(file =>
                ns.rm(file, host)
            )
        );
}