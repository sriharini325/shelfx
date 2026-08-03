// Populates the Digital Library with 100+ real, legally-hosted public-domain
// titles by pulling live metadata from Gutendex (a free, no-auth JSON API
// that mirrors Project Gutenberg's catalog: https://gutendex.com). This
// guarantees every "Read online" link points at a real, correct book —
// nothing here is guessed or hand-typed.
//
// Run separately from the main seed script since it needs internet access:
//   npm run seed:digital
require('dotenv').config();
const { sequelize, DigitalBook } = require('../models');

const GUTENDEX_BASE = 'https://gutendex.com/books';
const TARGET_COUNT = 120;

async function fetchPage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gutendex request failed: ${res.status} ${res.statusText}`);
  return res.json();
}

async function run() {
  await sequelize.authenticate();
  console.log('Fetching public-domain titles from Project Gutenberg (via Gutendex)...');

  const collected = [];
  // languages=en keeps titles in English; mime_type filter ensures the book
  // has a readable web format so the online link actually opens something.
  let url = `${GUTENDEX_BASE}?languages=en&mime_type=text%2Fhtml`;

  while (url && collected.length < TARGET_COUNT) {
    const page = await fetchPage(url);
    for (const book of page.results) {
      if (collected.length >= TARGET_COUNT) break;
      if (!book.title || !book.authors?.length) continue;

      collected.push({
        title: book.title.replace(/\s+/g, ' ').trim().slice(0, 490),
        author: book.authors.map((a) => a.name).join(', ').slice(0, 250),
        genre: book.subjects?.[0] ? book.subjects[0].split(' -- ')[0].slice(0, 100) : null,
        source: 'Project Gutenberg',
        license: 'Public Domain',
        readOnlineUrl: `https://www.gutenberg.org/ebooks/${book.id}`,
      });
    }
    url = page.next;
  }

  console.log(`Fetched ${collected.length} titles. Replacing the digital library catalog...`);

  await DigitalBook.destroy({ where: {}, truncate: true });
  await DigitalBook.bulkCreate(collected);

  console.log(`Done — digital library now has ${collected.length} titles.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Failed to seed digital books:', err.message);
  console.error('Check your internet connection — this script needs to reach gutendex.com.');
  process.exit(1);
});
