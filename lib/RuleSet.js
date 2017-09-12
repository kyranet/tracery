module.exports = class RuleSet {

    constructor(grammar, raw) {
        this.raw = raw;
        this.grammar = grammar;
        this.falloff = 1;

        if (Array.isArray(raw)) {
            this.defaultRules = raw;
        } else if (typeof raw === 'string' || raw instanceof String) {
            this.defaultRules = [raw];
        }
    }

    selectRule(errors) {
        if (this.conditionalRule) {
            const value = this.grammar.expand(this.conditionalRule, true);
            // does this value match any of the conditionals?
            if (this.conditionalValues[value]) {
                const v = this.conditionalValues[value].selectRule(errors);
                if (v !== null && typeof v !== 'undefined')
                    return v;
            }
            // No returned value?
        }

        // Is there a ranked order?
        if (this.ranking) {
            for (let i = 0; i < this.ranking.length; i++) {
                const v = this.ranking.selectRule();
                if (v !== null && typeof v !== 'undefined')
                    return v;
            }
        }

        if (typeof this.defaultRules !== 'undefined') {
            let index = 0;
            // Select from this basic array of rules

            // Get the distribution from the grammar if there is no other
            const distribution = this.distribution || this.grammar.distribution;

            switch (distribution) {
                case 'shuffle':
                    if (!this.shuffledDeck || this.shuffledDeck.length === 0) {
                        this.shuffledDeck = RuleSet.fyshuffle(Array(...{ length: this.defaultRules.length }).map(Number.call, Number));
                    }

                    index = this.shuffledDeck.pop();

                    break;
                case 'weighted':
                    errors.push('Weighted distribution not yet implemented');
                    break;
                case 'falloff':
                    errors.push('Falloff distribution not yet implemented');
                    break;
                default:
                    index = Math.floor(Math.pow(Math.random(), this.falloff) * this.defaultRules.length);
                    break;
            }

            if (!this.defaultUses) this.defaultUses = [];
            this.defaultUses[index] = ++this.defaultUses[index] || 1;
            return this.defaultRules[index];
        }

        errors.push(`No default rules defined for ${this}`);
        return null;
    }

    clearState() {
        if (this.defaultUses) {
            this.defaultUses = [];
        }
    }

    static fyshuffle(array) {
        let currentIndex = array.length,
            temporaryValue,
            randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
        // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

};
