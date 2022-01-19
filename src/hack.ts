import { AppState } from 'app/state/state';
import { NS } from 'bitburner';
import { Operation } from 'lib/operation/operation';
import { Store } from 'lib/state/state';

const maxVariance = 0.05;

function epsilon(): number {
    return 1 + maxVariance * ( 2 * Math.random() - 1 );
}

/**
 * @param {NS} ns
 */
export async function main(ns: NS) {
    const store = new Store<AppState>(ns);
    let state = store.state;

    while (state.enabled.includes(Operation.HACKING)) {
        ns.print(`Attempting to hack ${state.hacking.target} for ${state.hacking.goal}`);
        if (state.hacking.goal === "Money") {
            if (ns.getServerSecurityLevel(state.hacking.target) / ns.getServerMinSecurityLevel(state.hacking.target) > 1.2 * epsilon()) {
                await ns.weaken(state.hacking.target);
            } else if (ns.getServerMoneyAvailable(state.hacking.target) / ns.getServerMaxMoney(state.hacking.target) < 0.9 * epsilon()) {
                await ns.grow(state.hacking.target);
            } else {
                await ns.hack(state.hacking.target);
            }
        } else if (state.hacking.goal === "XP") {
            if (ns.getServerSecurityLevel(state.hacking.target) === ns.getServerMinSecurityLevel(state.hacking.target)) {
                await ns.grow(state.hacking.target);
            } else {
                await ns.weaken(state.hacking.target);
            }
        }
        await ns.sleep(Math.floor(Math.random() * 10));
        state = store.state;
    }
}