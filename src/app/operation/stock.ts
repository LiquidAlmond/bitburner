import { AppState } from 'app/state/state';
import { NS } from 'bitburner';
import { Operation } from 'lib/operation/operation';
import { Store } from 'lib/state/state';

const settings = {
    balancePercent: [0.1, 0.2],
    commission: 100000,
    cycles: 2,
}

class Stock {
    ns: NS;
    sym: string;

    constructor(ns: NS, sym: string) {
        this.ns = ns;
        this.sym = sym;
    }

    sharesCanAfford(cash: number): number {
        return Math.floor(cash / this.getPrice());
    }

    getPrice(): number {
        return this.ns.stock.getPrice(this.sym);
    }

    getVolatility(): number {
        return this.ns.stock.getVolatility(this.sym);
    }

    getForecate(): number {
        return 2 * ( this.ns.stock.getForecast(this.sym) - 0.5 );
    }

    getExpectedReturn(): number {
        return this.ns.stock.getVolatility(this.sym) - this.ns.stock.getForecast(this.sym) + 0.5
    }
}

interface Position {
    sym: string;
    price: number;
    shares: number;
}

class Portfolio {
    ns: NS;
    market: Record<string, Stock>;
    positions: Record<string, Position>;
    
    constructor(ns: NS) {
        this.ns = ns;
        this.market = this.ns.stock.getSymbols().reduce((map, sym) => {
            map[sym] = new Stock(this.ns, sym);
            return map;
        }, {} as Record<string, Stock>);
    }

    /**
     * Gives symbol of stock with best expected return.
     * @returns {String}
     */
    getBestBuys(): string[] {
        return Object.values(this.market).sort((a,b) => a.getExpectedReturn() - b.getExpectedReturn())
            .slice(0, 3)
            .map(stock => stock.sym);
    }

    /**
     * Refresh position cache.
     */
    refreshPositions(): void {
        this.positions = Object.values(this.market).map(stock => ({
                sym: stock.sym,
                price: this.ns.stock.getPosition(stock.sym)[1],
                shares: this.ns.stock.getPosition(stock.sym)[0],
            }))
            .reduce((map, position) => {
                map[position.sym] = position;
                return map;
            }, {} as Record<string, Position>);
    }

    /**
     * Calculates the total value of the portfolio.
     * @returns {Number}
     */
    getValue(): number {
        return Object.values(this.positions).reduce((value, stock) => value + stock.price * stock.shares, 0);
    }

    /**
     * Calculates the player's total net worth, which is the value of the stock portfolio plus cash on hand.
     * @returns {Number}
     */
    getNetWorth(): number {
        return this.getValue() + this.ns.getServerMoneyAvailable("home");
    }

    /**
     * Refresh cache of and return a single position.
     * @param {String} sym 
     * @returns {Position}
     */
    refreshPosition(sym: string): Position {
        const position = {
            sym,
            price: this.ns.stock.getPosition(sym)[1],
            shares: this.ns.stock.getPosition(sym)[0],
        };
        this.positions[sym] = position;
        return position;
    }

    /**
     * Lists the symbols of all owned stocks.
     * @returns {String[]}
     */
    getOwnedStocks(): string[] {
        return Object.keys(this.market).filter(sym => this.positions[sym].shares > 0);
    }

    /**
     * Buys up to {maxShares} of {sym} stock. A smaller position is taken if the requested shares are not available on {sym}.
     * @param {String} sym 
     * @param {Number} maxShares 
     */
    buy(sym: string, maxShares: number): void {
        const shares = Math.min(this.ns.stock.getMaxShares(sym) - this.positions[sym]?.shares ?? 0, maxShares);

        if (shares <= 0) {
            return;
        }

        const price = this.ns.stock.buy(sym, shares);
        
        this.refreshPosition(sym);

        if (price > 0) {
            const message = `Bought ${shares} shares of ${sym} for ${format(shares * price)}`;
            this.ns.print(message);
            this.ns.toast(message);
        }
    }

    /**
     * Sells up to {maxShares} of {sym} stock. This will not short a stock.
     * @param {String} sym 
     * @param {Number} maxShares 
     */
    sell(sym: string, maxShares: number): void {
        const shares = Math.min(maxShares, this.positions[sym]?.shares ?? 0);
        const price = this.ns.stock.sell(sym, shares);
        const profit = shares * (price - this.positions[sym]?.price ?? 0) - 2 * settings.commission;

        this.refreshPosition(sym);

        const message = `Sold ${shares} shares of ${sym} for a profit of ${format(profit)}`;
        this.ns.print(message);
        this.ns.toast(message);
    }
}

/**
 * Formats number in standard fashion.
 * @param {Number} num 
 * @returns {String}
 */
function format(num: number): string {
    let symbols = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
    let i = 0;
    for (; (num >= 1000) && (i < symbols.length); i++)
        num /= 1000;
    return ((Math.sign(num) < 0) ? "-$" : "$") + num.toFixed(3) + symbols[i];
}

/**
 * @param {NS} ns 
 */
export async function main(ns: NS) {
    //Initialise
    ns.disableLog("ALL");
    const store = new Store<AppState>(ns);
    const portfolio = new Portfolio(ns);

    let state = store.state;

    while(state.enabled.includes(Operation.STOCK)) {
        portfolio.refreshPositions();

        const bestBuys = portfolio.getBestBuys()
            .map(sym => portfolio.market[sym]);

        ns.print(`Targeted stocks: ${bestBuys.map(stock => stock.sym).join(',')}`);
        
        const positions: Position[] = Object.values(portfolio.positions);
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i];

            if (position.shares == 0) {
                continue;
            }

            if (!bestBuys.find(stock => stock.sym === position.sym)) {
                portfolio.sell(position.sym, position.shares);
            }
        }
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i];

            if (position.shares == 0) {
                continue;
            }

            if (ns.getServerMoneyAvailable("home") < settings.balancePercent[0] * portfolio.getNetWorth()) {
                const neededFunds = portfolio.getValue() * settings.balancePercent[1] + settings.commission;
                const shares = Math.floor( neededFunds / portfolio.market[position.sym].getPrice() );
                portfolio.sell(position.sym, shares);
            }
        }
        
        //Buy shares with cash remaining in hand
        for (let i = 0; i < bestBuys.length; i++) {
            const stock = bestBuys[i];
            const pendingFunds = ns.getServerMoneyAvailable("home") - settings.balancePercent[1] * portfolio.getNetWorth();
            const shares = Math.floor((pendingFunds - settings.commission)/stock.getPrice());
            
            if (-1 * shares * settings.cycles * stock.getPrice() * stock.getExpectedReturn() > settings.commission) {
                portfolio.buy(stock.sym, shares);
            }
        }
        
        await ns.sleep(5 * 1000 * settings.cycles + 200);
        state = store.state;
    }
}