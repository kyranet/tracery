module.exports = class TraceryNode {

    constructor(parent, childIndex, settings) {
        this.errors = [];

        // No input? Add an error, but continue anyways
        if (settings.raw === undefined) {
            this.errors.push('Empty input for node');
            settings.raw = '';
        }

        // If the root node of an expansion, it will have the grammar passed as the 'parent'
        //  set the grammar from the 'parent', and set all other values for a root node
        if (parent instanceof Grammar) {
            this.grammar = parent;
            this.parent = null;
            this.depth = 0;
            this.childIndex = 0;
        } else {
            this.grammar = parent.grammar;
            this.parent = parent;
            this.depth = parent.depth + 1;
            this.childIndex = childIndex;
        }

        this.raw = settings.raw;
        this.type = settings.type;
        this.isExpanded = false;

        if (!this.grammar) {
            console.warn('No grammar specified for this node', this);
        }
    }

    toString() {
        return `Node('${this.raw}' ${this.type} d:${this.depth})`;
    }

    expandChildren(childRule, preventRecursion) {
        this.children = [];
        this.finishedText = '';

        // Set the rule for making children,
        // and expand it into section
        this.childRule = childRule;
        if (this.childRule !== undefined) {
            const sections = util.parse(childRule);

            // Add errors to this
            if (sections.errors.length > 0) {
                this.errors = this.errors.concat(sections.errors);
            }

            for (let i = 0; i < sections.length; i++) {
                this.children[i] = new TraceryNode(this, i, sections[i]);
                if (!preventRecursion)
                    this.children[i].expand(preventRecursion);

                // Add in the finished text
                this.finishedText += this.children[i].finishedText;
            }
        } else {
            // In normal operation, this shouldn't ever happen
            this.errors.push("No child rule provided, can't expand children");
            console.warn("No child rule provided, can't expand children");
        }
    }

    expand(preventRecursion) {
        if (this.isExpanded) return;
        this.isExpanded = true;

        this.expansionErrors = [];

        // Types of nodes
        // -1: raw, needs parsing
        //  0: Plaintext
        //  1: Tag ("#symbol.mod.mod2.mod3#" or "#[pushTarget:pushRule]symbol.mod")
        //  2: Action ("[pushTarget:pushRule], [pushTarget:POP]", more in the future)

        switch (this.type) {
            case -1:
                this.expandChildren(this.raw, preventRecursion);
                break;
            case 0:
                this.finishedText = this.raw;
                break;
            case 1: {
                this.preactions = [];
                this.postactions = [];

                const parsed = util.parseTag(this.raw);

                // Break into symbol actions and modifiers
                this.symbol = parsed.symbol;
                this.modifiers = parsed.modifiers;

                // Create all the preactions from the raw syntax
                for (let i = 0; i < parsed.preactions.length; i++) {
                    this.preactions[i] = new NodeAction(this, parsed.preactions[i].raw);
                }
                for (let i = 0; i < parsed.postactions.length; i++) {
                    this.postactions[i] = new NodeAction(this, parsed.postactions[i].raw);
                }

                // Make undo actions for all preactions (pops for each push)
                for (let i = 0; i < this.preactions.length; i++) {
                    if (this.preactions[i].type === 0)
                        this.postactions.push(this.preactions[i].createUndo());
                }

                // Activate all the preactions
                for (let i = 0; i < this.preactions.length; i++) {
                    this.preactions[i].activate();
                }

                this.finishedText = this.raw;

                const selectedRule = this.grammar.selectRule(this.symbol, this, this.errors);

                this.expandChildren(selectedRule, preventRecursion);

                for (let i = 0; i < this.modifiers.length; i++) {
                    let modName = this.modifiers[i];
                    let modParams = [];
                    if (modName.indexOf('(') > 0) {
                        const regExp = /\(([^)]+)\)/;

                        const results = regExp.exec(this.modifiers[i]);
                        if (results && results.length > 2) {
                            modParams = results[1].split(',');
                            modName = this.modifiers[i].substring(0, modName.indexOf('('));
                        }
                    }

                    const mod = this.grammar.modifiers[modName];

                    if (!mod) {
                        this.errors.push(`Missing modifier ${modName}`);
                        this.finishedText += `((.${modName}))`;
                    } else {
                        this.finishedText = mod(this.finishedText, modParams);
                    }
                }

                for (let i = 0; i < this.postactions.length; i++) {
                    this.postactions[i].activate();
                }
                break;
            }
            case 2:
                this.action = new NodeAction(this, this.raw);
                this.action.activate();

                this.finishedText = '';
                break;
        }
    }

    clearEscapeChars() {
        this.finishedText = this.finishedText.replace(/\\{2,}/g, '\\');
    }

};

const util = require('../util/util');
const NodeAction = require('./NodeAction');
const Grammar = require('./Grammar');
