module.exports = class Util {

    static createGrammar(raw) {
        return new Grammar(raw);
    }

    static parseTag(tagContents) {
        const parsed = {
            symbol: undefined,
            preactions: [],
            postactions: [],
            modifiers: []
        };
        const sections = Util.parse(tagContents);
        let symbolSection;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].type === 0) {
                if (symbolSection === undefined) {
                    symbolSection = sections[i].raw;
                } else {
                    throw `multiple main sections in ${tagContents}`;
                }
            } else {
                parsed.preactions.push(sections[i]);
            }
        }

        if (symbolSection === undefined) {
            //   throw ("no main section in " + tagContents);
        } else {
            const components = symbolSection.split('.');
            parsed.symbol = components[0];
            parsed.modifiers = components.slice(1);
        }
        return parsed;
    }

    static isVowel(c) {
        const c2 = c.toLowerCase();
        return (c2 === 'a') || (c2 === 'e') || (c2 === 'i') || (c2 === 'o') || (c2 === 'u');
    }

    static isAlphaNum(c) {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
    }

    static escapeRegExp(str) {
        return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    static parse(rule) {
        let depth = 0;
        let inTag = false;
        let sections = [];
        let escaped = false;

        const errors = [];

        let escapedSubstring = '';
        let lastEscapedChar;

        if (rule === null) {
            sections = [];
            sections.errors = errors;

            return sections;
        }

        function createSection(start, end, type) {
            if (end - start < 1) {
                if (type === 1)
                    errors.push(`${start}: empty tag`);
                if (type === 2)
                    errors.push(`${start}: empty action`);
            }
            let rawSubstring;
            if (lastEscapedChar !== undefined) {
                rawSubstring = `${escapedSubstring}\\${rule.substring(lastEscapedChar + 1, end)}`;
            } else {
                rawSubstring = rule.substring(start, end);
            }
            sections.push({
                type: type,
                raw: rawSubstring
            });
            lastEscapedChar = undefined;
            escapedSubstring = '';
        }

        let start = 0;

        for (let i = 0; i < rule.length; i++) {
            if (!escaped) {
                const c = rule.charAt(i);

                switch (c) {
                    // Enter a deeper bracketed section
                    case '[':
                        if (depth === 0 && !inTag) {
                            if (start < i)
                                createSection(start, i, 0);
                            start = i + 1;
                        }
                        depth++;
                        break;

                    case ']':
                        depth--;

                        // End a bracketed section
                        if (depth === 0 && !inTag) {
                            createSection(start, i, 2);
                            start = i + 1;
                        }
                        break;

                        // Hashtag
                        //   ignore if not at depth 0, that means we are in a bracket
                    case '#':
                        if (depth === 0) {
                            if (inTag) {
                                createSection(start, i, 1);
                                start = i + 1;
                            } else {
                                if (start < i)
                                    createSection(start, i, 0);
                                start = i + 1;
                            }
                            inTag = !inTag;
                        }
                        break;

                    case '\\':
                        escaped = true;
                        escapedSubstring += rule.substring(start, i);
                        start = i + 1;
                        lastEscapedChar = i;
                        break;
                }
            } else {
                escaped = false;
            }
        }
        if (start < rule.length)
            createSection(start, rule.length, 0);

        if (inTag) {
            errors.push('Unclosed tag');
        }
        if (depth > 0) {
            errors.push('Too many [');
        }
        if (depth < 0) {
            errors.push('Too many ]');
        }

        // Strip out empty plaintext sections

        sections = sections.filter((section) => {
            if (section.type === 0 && section.raw.length === 0)
                return false;
            return true;
        });
        sections.errors = errors;
        return sections;
    }

    static countSyllables(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        return word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
            .replace(/^y/, '')
            .match(/[aeiouy]{1,2}/g).length;
    }

};

const Grammar = require('../lib/Grammar');
