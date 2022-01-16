import { NS } from 'bitburner';

const maxVariance = 0.05;

function epsilon(): number {
    return 1 + maxVariance * ( 2 * Math.random() - 1 );
}

/**
 * @param {NS} ns
 */
export async function main(ns: NS) {
    const target = ns.args[0] as string;
    const goal = ns.args[1] as "XP" | "Money";

    while (true) {
        if (goal === "Money") {
            if (ns.getServerSecurityLevel(target) / ns.getServerMinSecurityLevel(target) > 1.2 * epsilon()) {
                await ns.weaken(target);
            } else if (ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target) < 0.9 * epsilon()) {
                await ns.grow(target);
            } else {
                await ns.hack(target);
            }
        } else if (goal === "XP") {
            if (ns.getServerSecurityLevel(target) === ns.getServerMinSecurityLevel(target)) {
                await ns.grow(target);
            } else {
                await ns.weaken(target);
            }
        }
        await ns.sleep(Math.floor(Math.random() * 10));
    }
}