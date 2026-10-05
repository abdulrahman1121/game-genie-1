// Static word packages used when OpenAI generation fails (quota exhausted, outage, bad parse, etc.)
// Each entry carries everything the word -> hints -> definition/example -> bonus pipeline needs
// so a fallback game never has to call OpenAI at all.
module.exports = [
  {
    word: 'FROG',
    wordLength: 4,
    definition: 'A small animal that hops, lives near water, and is great at swimming and jumping.',
    example: 'The frog jumped from the lily pad into the pond.',
    hints: [
      { level: 1, hint: 'This word is a type of animal.' },
      { level: 2, hint: 'This animal is usually green, hops around, and loves living near ponds.' },
    ],
    bonusSentence: 'A frog hopped across the muddy path.',
  },
  {
    word: 'LAMP',
    wordLength: 4,
    definition: 'A device that gives off light to help you see, often placed on a desk or table.',
    example: 'She turned on the lamp to read her book.',
    hints: [
      { level: 1, hint: 'This word is a type of household object.' },
      { level: 2, hint: 'This object gives off light and often sits on a desk or nightstand.' },
    ],
    bonusSentence: 'The lamp glowed softly in the room.',
  },
  {
    word: 'STAR',
    wordLength: 4,
    definition: 'A giant ball of burning gas far out in space that shines brightly at night.',
    example: 'We counted every star in the dark sky.',
    hints: [
      { level: 1, hint: 'This word is something you see in the sky.' },
      { level: 2, hint: 'This shiny object twinkles high above us at night.' },
    ],
    bonusSentence: 'A bright star twinkled above the hill.',
  },
  {
    word: 'HAPPY',
    wordLength: 5,
    definition: 'Feeling good, cheerful, and full of joy.',
    example: 'The puppy felt happy when it saw its owner.',
    hints: [
      { level: 1, hint: 'This word describes a feeling.' },
      { level: 2, hint: 'This feeling means you are smiling and full of joy.' },
    ],
    bonusSentence: 'The whole class felt happy after recess.',
  },
  {
    word: 'OCEAN',
    wordLength: 5,
    definition: 'A huge body of salty water that covers much of the Earth.',
    example: 'The ship sailed across the wide ocean.',
    hints: [
      { level: 1, hint: 'This word is a type of place.' },
      { level: 2, hint: 'This place is a huge body of salty water full of fish.' },
    ],
    bonusSentence: 'Waves crashed loudly along the ocean shore.',
  },
];
