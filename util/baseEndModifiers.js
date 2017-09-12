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
                return `${s}es`;
            case 'h':
                return `${s}es`;
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
            case 's':
                return `${s}ed`;
            case 'e':
                return `${s}d`;
            case 'h':
                return `${s}ed`;
            case 'x':
                return `${s}ed`;
            case 'y':
                return !isVowel(s.charAt(s.length - 2)) ? `${s.substring(0, s.length - 1)}ied` : `${s}d`;
            default:
                return `${s}ed`;
        }
    }
};

const { escapeRegExp, isAlphaNum, isVowel } = require('./util');
