module.exports = {
    replace: (s, params) => s.replace(new RegExp(escapeRegExp(params[0]), 'g'), params[1]),
    capitalize: (s) => s.charAt(0).toUpperCase() + s.substring(1),
    capitalizeAll: (s) => {
        let s2 = '';
        let capNext = true;
        for (let i = 0; i < s.length; i++) {
            if (!isAlphaNum(s.charAt(i))) {
                capNext = true;
                s2 += s.charAt(i);
            } else if (!capNext) {
                s2 += s.charAt(i);
            } else {
                s2 += s.charAt(i).toUpperCase();
                capNext = false;
            }
        }
        return s2;
    },
    a: (s) => {
        if (s.length > 0) {
            if (s.charAt(0).toLowerCase() === 'u' && s.length > 2 && s.charAt(2).toLowerCase() === 'i') {
                return `a ${s}`;
            }

            if (isVowel(s.charAt(0))) {
                return `an ${s}`;
            }
        }

        return `a ${s}`;
    },
    s: (s) => {
        switch (s.charAt(s.length - 1)) {
            case 's':
            case 'h':
            case 'x':
                return `${s}es`;
            case 'y':
                return !isVowel(s.charAt(s.length - 2)) ? `${s.substring(0, s.length - 1)}ies` : `${s}s`;
            default:
                return `${s}s`;
        }
    },
    firstS: (s) => {
        const s2 = s.split(' ');
        return `${s(s2[0])} ${s2.slice(1).join(' ')}`;
    },
    ed: (s) => {
        switch (s.charAt(s.length - 1)) {
            case 'e':
                return `${s}d`;
            case 'y':
                return !isVowel(s.charAt(s.length - 2)) ? `${s.substring(0, s.length - 1)}ied` : `${s}d`;
            default:
                return `${s}ed`;
        }
    },
    ing: (s) => {
        const lastChar = s.charAt(s.length - 1).toLowerCase();
        const secondChar = s.charAt(s.length - 2).toLowerCase();
        const thirdChar = s.charAt(s.length - 3).toLowerCase();

        if (lastChar === 'e') {
            if (secondChar === 'i') return `${s.substring(0, s.length - 2)}ying`;
            return `${s.substring(0, s.length - 1)}ing`;
        }
        if (!isVowel(lastChar) && isVowel(secondChar) && !isVowel(thirdChar)) {
            return countSyllables(s) === 2 ? `${s}ing` : `${s}${lastChar}ing`;
        }
        if (lastChar === 'w' || lastChar === 'x' || lastChar === 'y') return `${s}ing`;

        // TODO: If the verb ends in an unstressed vowel + R, we do not double the final R and add ING.
        return `${s}ing`;
    }
};

const { escapeRegExp, isAlphaNum, isVowel, countSyllables } = require('./util');
