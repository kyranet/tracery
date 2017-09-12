module.exports = class Grammar {

    constructor(raw) {
        this.modifiers = {};
        this.loadFromRawObj(raw);
        this.errors = [];
    }

    clearState() {
        const keys = Object.keys(this.symbols);
        for (let i = 0; i < keys.length; i++) {
            this.symbols[keys[i]].clearState();
        }
    }

    addModifiers(mods) {
        for (const key of Object.keys(mods)) this.modifiers[key] = mods[key];
    }

    loadFromRawObj(raw) {
        this.raw = raw;
        this.symbols = {};
        this.subgrammars = [];

        if (this.raw) {
            // Add all rules to the grammar
            for (const key in this.raw) {
                if (this.raw.hasOwnProperty(key)) {
                    this.symbols[key] = new Symbol(this, key, this.raw[key]);
                }
            }
        }
    }

    createRoot(rule) {
        const root = new TraceryNode(this, 0, {
            type: -1,
            raw: rule
        });

        return root;
    }

    expand(rule, allowEscapeChars) {
        const root = this.createRoot(rule);
        root.expand();
        if (!allowEscapeChars) root.clearEscapeChars();

        return root;
    }

    flatten(rule, allowEscapeChars) {
        return this.expand(rule, allowEscapeChars).finishedText;
    }

    toJSON() {
        const keys = Object.keys(this.symbols);
        const symbolJSON = [];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            symbolJSON.push(` "${key}" : ${this.symbols[key].rulesToJSON()}`);
        }
        return `{\n${symbolJSON.join(',\n')}\n}`;
    }

    pushRules(key, rawRules, sourceAction) {
        if (this.symbols[key] === undefined) {
            this.symbols[key] = new Symbol(this, key, rawRules);
            if (sourceAction)
                this.symbols[key].isDynamic = true;
        } else {
            this.symbols[key].pushRules(rawRules);
        }
    }

    popRules(key) {
        if (!this.symbols[key]) this.errors.push(`Can't pop: no symbol for key ${key}`);
        this.symbols[key].popRules();
    }

    selectRule(key, node, errors) {
        if (this.symbols[key]) {
            const rule = this.symbols[key].selectRule(node, errors);
            return rule;
        }

        // Failover to alternative subgrammars
        for (let i = 0; i < this.subgrammars.length; i++) {
            if (this.subgrammars[i].symbols[key])
                return this.subgrammars[i].symbols[key].selectRule();
        }

        // No symbol?
        errors.push(`No symbol for '${key}'`);
        return `((${key}))`;
    }

};

const TraceryNode = require('./TraceryNode');
const Symbol = require('./Symbol');
