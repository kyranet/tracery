module.exports = class NodeAction {

    constructor(node, raw) {
        this.node = node;

        const sections = raw.split(':');
        this.target = sections[0];

        if (sections.length === 1) this.type = 2;
        else {
            this.rule = sections[1];
            if (this.rule === 'POP') {
                this.type = 1;
            } else {
                this.type = 0;
            }
        }
    }

    createUndo() {
        return this.type === 0 ? new NodeAction(this.node, `${this.target}:POP`) : null;
    }

    activate() {
        const grammar = this.node.grammar;
        switch (this.type) {
            case 0:
                // split into sections (the way to denote an array of rules)
                this.ruleSections = this.rule.split(',');
                this.finishedRules = [];
                this.ruleNodes = [];
                for (let i = 0; i < this.ruleSections.length; i++) {
                    const node = new TraceryNode(grammar, 0, {
                        type: -1,
                        raw: this.ruleSections[i]
                    });

                    node.expand();

                    this.finishedRules.push(node.finishedText);
                }

                grammar.pushRules(this.target, this.finishedRules, this);
                break;
            case 1:
                grammar.popRules(this.target);
                break;
            case 2:
                grammar.flatten(this.target, true);
                break;
        }
    }

    toText() {
        switch (this.type) {
            case 0:
                return `${this.target}:${this.rule}`;
            case 1:
                return `${this.target}:POP`;
            case 2:
                return '((some function))';
            default:
                return '((Unknown Action))';
        }
    }

};

const TraceryNode = require('./TraceryNode');
