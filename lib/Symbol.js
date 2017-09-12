module.exports = class Symbol {

    constructor(grammar, key, rawRules) {
        this.key = key;
        this.grammar = grammar;
        this.rawRules = rawRules;

        this.baseRules = new RuleSet(this.grammar, rawRules);
        this.clearState();
    }

    clearState() {
        this.stack = [this.baseRules];

        this.uses = [];
        this.baseRules.clearState();
    }

    pushRules(rawRules) {
        const rules = new RuleSet(this.grammar, rawRules);
        this.stack.push(rules);
    }

    popRules() {
        this.stack.pop();
    }

    selectRule(node, errors) {
        this.uses.push({ node: node });

        if (this.stack.length === 0) {
            errors.push(`The rule stack for '${this.key}' is empty, too many pops?`);
            return `((${this.key}))`;
        }

        return this.stack[this.stack.length - 1].selectRule();
    }

    getActiveRules() {
        if (this.stack.length === 0) {
            return null;
        }
        return this.stack[this.stack.length - 1].selectRule();
    }

    rulesToJSON() {
        return JSON.stringify(this.rawRules);
    }

};

const RuleSet = require('./RuleSet');
