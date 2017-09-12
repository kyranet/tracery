const tracery = require('../tracery');

const easy = tracery.createGrammar({
    animal: ['panda', 'fox', 'capybara', 'iguana'],
    emotion: ['sad', 'happy', 'angry', 'jealous'],
    origin: ['I am #emotion.a# #animal#.']
});

const medium = tracery.createGrammar({
    name: ['Arjun', 'Yuuma', 'Darcy', 'Mia', 'Chiaki', 'Izzi', 'Azra', 'Lina'],
    animal: ['unicorn', 'raven', 'sparrow', 'scorpion', 'coyote', 'eagle', 'owl', 'lizard', 'zebra', 'duck', 'kitten'],
    mood: ['vexed', 'indignant', 'impassioned', 'wistful', 'astute', 'courteous'],
    story: ['#hero# traveled with her pet #heroPet#. #hero# was never #mood#, for the #heroPet# was always too #mood#.'],
    origin: ['#[hero:#name#][heroPet:#animal#]story#']
});

const hard = tracery.createGrammar({
    color: ['orange', 'blue', 'white', 'black', 'grey', 'purple', 'indigo'],
    animal: ['spider', 'scorpion', 'coyote', 'eagle', 'owl', 'lizard', 'deer'],
    sense: ['feel', 'hear', 'see', 'know'],
    react: ['shake', 'moan', 'cry', 'scream', 'wail', 'rejoice', 'dance', 'cower', 'howl'],
    instrument: ['ukelele', 'vocals', 'guitar', 'clarinet', 'piano', 'harmonica', 'violin', 'accordion'],
    nature: ['ocean', 'mountain', 'river', 'tree', 'sky', 'earth'],
    musicGenre: ['metal', 'jazz', 'salsa', 'flamenco', 'pop', 'rap'],
    musicPlays: ['echoes out', 'reverberates', 'rises', 'plays'],
    musicAdv: ['too quietly to hear', 'into dissonance', 'into a minor chord', 'changing tempo', 'to a major chord', 'into harmony'],
    themeAdj: ['lost', 'desired', 'redeemed', 'awakened', 'forgotten', 'promised', 'broken', 'forgiven', 'remembered', 'betrayed'],
    themeNoun: ['the future', 'love', 'drinking', 'space travel', 'the railroad', 'childhood', 'summertime', 'the ocean'],

    charAdj: ['old', 'young', 'hooded', 'dead-eyed', 'faceless'],
    person: ['angel', 'woman', 'man', 'figure'],
    character: ['#charAdj# #person#'],
    natureNoun: ['ocean', 'mountain', 'river', 'tree', 'sky', 'earth', 'void', 'desert'],
    charDescription: ['#react.s# when they #sense# the #natureNoun#'],

    beingWith: ['talking to', 'walking with', 'listening to'],
    distance: ['next to', 'near', 'far', 'close'],

    youKnow: ['I mean', 'well', 'I guess', 'you know', '#maybe#'],
    introduction: ['[mc:#character#][mcDesc:#charDescription#]This is a story about #mc.a#. You know, the #mc# who #mcDesc#. Well, I was #beingWith# the #mc#, when we both saw this #color# #animal# #distance# #nature#... well, more of #color.a#-ish #color#.'],

    later: ['later, that night', 'then'],
    body: ['#later.capitalize#, we were #sense.ing# #musicAdv.a# #musicGenre# song #distance# the #animal#, we saw there was #person.a# who #musicPlays# said music with #instrument.a#, it sounded #themeAdj# about #themeNoun#.'],

    origin: ['#introduction#\n#body#']
});

easy.addModifiers(tracery.baseEngModifiers);
medium.addModifiers(tracery.baseEngModifiers);
hard.addModifiers(tracery.baseEngModifiers);

console.log(easy.flatten('#origin#'));
console.log(medium.flatten('#origin#'));
console.log(hard.flatten('#origin#'));
