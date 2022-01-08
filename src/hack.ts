import { NS } from 'bitburner';

/**
 * @param {NS} ns
 */
export async function main(ns: NS) {
    const target = ns.args[0] as string;

    while (true) {
        if (ns.getServerSecurityLevel(target) / ns.getServerMinSecurityLevel(target) > 1.2) {
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target) < 0.9) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
        await ns.sleep(Math.floor(Math.random() * 100));
    }
}