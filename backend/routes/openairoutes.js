// In backend/openaiRoutes.js
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const { db, admin } = require('../firebase'); // Updated import
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const SYSTEM_PROMPT = `You are an educational assistant for a Wordle game designed for kids. Your answers should be kid-friendly, engaging, and educational. Always provide clear, concise responses.`;

const RECENT_WORDS_LIMIT = 50; // + Limit for recent words

router.post('/start', async (req, res) => {
  try {
    const blocklist = ['death', 'crime', 'blood', 'ghost', 'scary'];
    const wordLength = Math.random() < 0.5 ? 4 : 5;

    const recentWordsSnapshot = await db.collection('recentWords').orderBy('createdAt', 'desc').limit(RECENT_WORDS_LIMIT).get();
    const recentWords = recentWordsSnapshot.docs.map(doc => doc.data().word.toUpperCase());

    const wordPrompt = `Generate a ${wordLength}-letter English word suitable for kids aged 8-13, avoiding words in this blocklist: ${blocklist.join(', ')}. Ensure the word is different from these recently used words: ${recentWords.join(', ') || 'none'}. Return exactly in this format:\nWord: [WORD]\nDo not include extra text.`;
    const wordResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: wordPrompt }
      ],
      max_tokens: 100
    });

    const wordText = wordResponse.choices[0].message.content;
    const wordMatch = wordText.match(/Word: ["']?([A-Za-z]{4,5})["']?/i);
    if (!wordMatch) throw new Error('Failed to parse word from OpenAI');
    const word = wordMatch[1].toUpperCase();

    const explainPrompt = `Provide a kid-friendly definition and example sentence for the word "${word}". Return exactly in this format:\nDefinition: [DEFINITION]\nExample: [SENTENCE]\nDo not include extra text.`;
    const explainResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: explainPrompt }
      ],
      max_tokens: 100
    });

    const explanationText = explainResponse.choices[0].message.content;
    const definitionMatch = explanationText.match(/Definition: (.+)/);
    const exampleMatch = explanationText.match(/Example: (.+)/);
    if (!definitionMatch || !exampleMatch) throw new Error('Failed to parse explanation from OpenAI');
    const explanation = `${definitionMatch[1].trim()}\n${exampleMatch[1].trim()}`;

    const gameId = db.collection('games').doc().id;
    await db.collection('games').doc(gameId).set({
      gameId,
      word,
      guesses: [],
      hints: [],
      status: 'active',
      explanation, // + Store explanation
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await db.collection('recentWords').add({
      word,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    if (recentWordsSnapshot.size >= RECENT_WORDS_LIMIT) {
      const oldestWord = recentWordsSnapshot.docs[recentWordsSnapshot.size - 1];
      await db.collection('recentWords').doc(oldestWord.id).delete();
    }

    res.json({ gameId, wordLength, explanation, word }); // + Return explanation
  } catch (err) {
    console.error('❌ /start error:', err.code, err.message);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

router.post('/reset', async (req, res) => {
  const { gameId } = req.body;
  try {
    await db.collection('games').doc(gameId).set({
      gameId,
      word: '',
      guesses: [],
      hints: [],
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ gameId });
  } catch (err) {
    console.error('❌ /reset error:', err.message);
    res.status(500).json({ error: 'Failed to reset game' });
  }
});

// In /guess endpoint, update game document with guessCount
router.post('/guess', async (req, res) => {
  const { gameId, guess } = req.body;
  try {
    const gameDoc = await db.collection('games').doc(gameId).get();
    if (!gameDoc.exists) return res.status(404).json({ error: 'Game not found' });

    const { word, guesses } = gameDoc.data();
    if (guess.length !== word.length) return res.status(400).json({ error: 'Invalid guess length' });

    const feedback = evaluateGuess(guess, word);
    guesses.push({ guess, feedback });

    const status = guess === word ? 'won' : guesses.length >= 6 ? 'lost' : 'active';
    const guessCount = guesses.length; // + Track guess count

    await db.collection('games').doc(gameId).update({
      guesses,
      status,
      guessCount, // + Store guess count
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ feedback, status, guessCount }); // + Return guessCount
  } catch (err) {
    console.error('❌ /guess error:', err.message);
    res.status(500).json({ error: 'Failed to process guess' });
  }
});

router.post('/hint', async (req, res) => {
  const { gameId, hintLevel } = req.body;
  try {
    const gameDoc = await db.collection('games').doc(gameId).get();
    if (!gameDoc.exists) return res.status(404).json({ error: 'Game not found' });

    const { word, hints } = gameDoc.data();
    const prompt = `Provide a level-${hintLevel} hint for the ${word.length}-letter word "${word}" without revealing it. Level 1: broad context (e.g., "This word is a type of animal"). Level 2: more specific (e.g., "This word is an animal that lives in water"). Ensure hints are kid-friendly, random, and avoid repeating previous hints: ${hints.map(h => h.hint).join(', ')}. Return exactly in this format:\nHint: [HINT]`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      max_tokens: 50
    });

    const responseText = response.choices[0].message.content;
    const hintMatch = responseText.match(/Hint: (.+)/);
    if (!hintMatch) {
      console.error('Invalid OpenAI hint response:', responseText);
      throw new Error('Failed to parse hint from OpenAI');
    }
    const hint = hintMatch[1].trim();
    hints.push({ level: hintLevel, hint });

    await db.collection('games').doc(gameId).update({
      hints,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ hint });
  } catch (err) {
    console.error('❌ /hint error:', err.message);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
});


// Update /unscramble endpoint
router.post('/unscramble', async (req, res) => {
  const { gameId } = req.body;
  try {
    const gameDoc = await db.collection('games').doc(gameId).get();
    if (!gameDoc.exists) return res.status(404).json({ error: 'Game not found' });

    const { word, explanation } = gameDoc.data();
    const [, example] = explanation.split('\n');
    const sentencePrompt = `Generate a kid-friendly sentence (different from "${example}") using the word "${word}" for kids aged 8-13, with exactly 5 to 7 words. Return exactly in this format:\nSentence: [SENTENCE]\nDo not include extra text.`;
    const sentenceResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: sentencePrompt }
      ],
      max_tokens: 100
    });

    const sentenceText = sentenceResponse.choices[0].message.content;
    const sentenceMatch = sentenceText.match(/Sentence: (.+)/);
    if (!sentenceMatch) throw new Error('Failed to parse sentence from OpenAI');
    const sentence = sentenceMatch[1].trim();
    const words = sentence.split(' ');
    if (words.length < 5 || words.length > 7) throw new Error('Sentence must be 5-7 words');
    const scrambled = words.sort(() => Math.random() - 0.5).join(' ');

    res.json({ sentence, scrambled });
  } catch (err) {
    console.error('❌ /unscramble error:', err.message);
    res.status(500).json({ error: 'Failed to generate sentence' });
  }
});

const evaluateGuess = (guess, target) => {
  const feedback = Array(target.length).fill('incorrect');
  const targetLetters = target.split('');
  const guessLetters = guess.split('');

  guessLetters.forEach((letter, index) => {
    if (letter === targetLetters[index]) {
      feedback[index] = 'correct';
      targetLetters[index] = null;
    }
  });

  guessLetters.forEach((letter, index) => {
    if (feedback[index] === 'incorrect') {
      const targetIndex = targetLetters.indexOf(letter);
      if (targetIndex !== -1) {
        feedback[index] = 'present';
        targetLetters[targetIndex] = null;
      }
    }
  });

  return feedback;
};

module.exports = router;