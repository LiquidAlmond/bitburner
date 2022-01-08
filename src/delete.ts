import { NS } from 'bitburner';

/**
 * @param  {NS} ns
 */
export async function main(ns: NS) {
    ns.disableLog("ALL");

	const path = ns.args[0] as string ?? '';
    const files = ns.ls("home", ".js").concat(ns.ls("home", ".txt")).filter(file => file.startsWith(path));
    
    if (!confirm(`Would you like the delete the following files?\n${files.join('\n')}`)) {
        ns.print(`Canceling delete.`)
        return;
    }

    for (let i = 0; i < files.length; i++) {
        ns.print(`Removing file ${files[i]}`);
        ns.rm(files[i], "home");
    }
}