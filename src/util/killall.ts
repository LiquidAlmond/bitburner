import { AppState } from "app/state/state";
import { NS } from "bitburner";
import { Store } from "lib/state/state";

export async function main(ns: NS) {
    const exceptionArg = ns.args[1] as string;
    const exceptions = exceptionArg === undefined ? [] : exceptionArg.split(',');

    const store = new Store<AppState>(ns);

    store.state.usableHosts
        .filter(host => ns.serverExists(host.name))
        .forEach(host => {
            ns.print(`Killing scripts on ${host.name}`);
            ns.ps(host.name)
                .filter(process => !process.filename.endsWith('killall.js') && !exceptions.includes(process.filename))
                .forEach(process => ns.kill(process.filename, host.name, ...process.args));
        });
}