require('dotenv').config();
const { sequelize, User, Library, Book, DigitalBook } = require('../models');

const daysFromNow = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

async function seed() {
  await sequelize.sync({ force: true });

  /* ------------------------------- Users ------------------------------- */
  await User.create({
    name: 'ShelfX Admin',
    username: 'admin',
    phone: '9999999999',
    email: 'admin@shelfx.app',
    passwordHash: 'admin123',
    role: 'admin',
  });

  await User.create({
    name: 'Asha Rao',
    username: 'asha',
    phone: '9876543210',
    email: 'asha@example.com',
    passwordHash: 'password123',
    role: 'user',
  });

  /* ----------------------------- Libraries ------------------------------ */
  const [central, annaNagar, tnagar, bangalore, mumbai] = await Library.bulkCreate([
    {
      name: 'Chennai Central Library', address: 'Anna Salai', city: 'Chennai',
      latitude: 13.0604, longitude: 80.2496, contactPhone: '044-12345678',
      openingHours: '9:00 AM - 8:00 PM', hasApiIntegration: false,
    },
    {
      name: 'Anna Nagar Community Library', address: '2nd Avenue, Anna Nagar', city: 'Chennai',
      latitude: 13.0850, longitude: 80.2101, contactPhone: '044-87654321',
      openingHours: '10:00 AM - 6:00 PM', hasApiIntegration: false,
    },
    {
      name: 'T. Nagar Public Library', address: 'Usman Road, T. Nagar', city: 'Chennai',
      latitude: 13.0418, longitude: 80.2341, contactPhone: '044-22334455',
      openingHours: '9:30 AM - 7:00 PM', hasApiIntegration: false,
    },
    {
      name: 'Bangalore City Central Library', address: 'Cubbon Park', city: 'Bengaluru',
      latitude: 12.9763, longitude: 77.5929, contactPhone: '080-11223344',
      openingHours: '8:00 AM - 8:00 PM', hasApiIntegration: true,
    },
    {
      name: 'Mumbai Central Library', address: 'Fort Area', city: 'Mumbai',
      latitude: 18.9322, longitude: 72.8311, contactPhone: '022-99887766',
      openingHours: '9:00 AM - 9:00 PM', hasApiIntegration: true,
    },
  ], { returning: true });

  /* -------------------------------- Books -------------------------------- */
  await Book.bulkCreate([
    // Chennai Central
    { title: 'The Midnight Library', author: 'Matt Haig', genre: 'Fiction', rackNumber: 'A-12', bookNumber: 'CCL-00231', libraryId: central.id, isAvailable: true },
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', genre: 'Non-fiction', rackNumber: 'B-04', bookNumber: 'CCL-00987', libraryId: central.id, isAvailable: false, expectedAvailableDate: daysFromNow(6) },
    { title: 'Educated', author: 'Tara Westover', genre: 'Memoir', rackNumber: 'B-07', bookNumber: 'CCL-00988', libraryId: central.id, isAvailable: true },
    { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', rackNumber: 'D-02', bookNumber: 'CCL-01102', libraryId: central.id, isAvailable: false, expectedAvailableDate: daysFromNow(3) },
    { title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Science Fiction', rackNumber: 'E-15', bookNumber: 'CCL-01230', libraryId: central.id, isAvailable: true },
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Psychology', rackNumber: 'B-11', bookNumber: 'CCL-01055', libraryId: central.id, isAvailable: true },
    { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', rackNumber: 'A-03', bookNumber: 'CCL-00042', libraryId: central.id, isAvailable: false, expectedAvailableDate: daysFromNow(1) },
    { title: 'Ikigai', author: 'Hector Garcia', genre: 'Self-help', rackNumber: 'C-19', bookNumber: 'CCL-00760', libraryId: central.id, isAvailable: true },

    // Anna Nagar
    { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-help', rackNumber: 'C-09', bookNumber: 'ANL-00112', libraryId: annaNagar.id, isAvailable: true },
    { title: 'The Psychology of Money', author: 'Morgan Housel', genre: 'Finance', rackNumber: 'C-14', bookNumber: 'ANL-00201', libraryId: annaNagar.id, isAvailable: true },
    { title: 'Where the Crawdads Sing', author: 'Delia Owens', genre: 'Fiction', rackNumber: 'A-08', bookNumber: 'ANL-00305', libraryId: annaNagar.id, isAvailable: false, expectedAvailableDate: daysFromNow(8) },
    { title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', rackNumber: 'E-02', bookNumber: 'ANL-00410', libraryId: annaNagar.id, isAvailable: true },
    { title: 'Becoming', author: 'Michelle Obama', genre: 'Memoir', rackNumber: 'B-06', bookNumber: 'ANL-00512', libraryId: annaNagar.id, isAvailable: true },
    { title: 'The Book Thief', author: 'Markus Zusak', genre: 'Historical Fiction', rackNumber: 'A-15', bookNumber: 'ANL-00620', libraryId: annaNagar.id, isAvailable: false, expectedAvailableDate: daysFromNow(4) },

    // T. Nagar
    { title: "Man's Search for Meaning", author: 'Viktor E. Frankl', genre: 'Philosophy', rackNumber: 'P-01', bookNumber: 'TNL-00101', libraryId: tnagar.id, isAvailable: true },
    { title: 'Norwegian Wood', author: 'Haruki Murakami', genre: 'Fiction', rackNumber: 'A-22', bookNumber: 'TNL-00220', libraryId: tnagar.id, isAvailable: true },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', rackNumber: 'F-05', bookNumber: 'TNL-00340', libraryId: tnagar.id, isAvailable: false, expectedAvailableDate: daysFromNow(2) },
    { title: 'Sherlock Holmes: The Complete Novels', author: 'Arthur Conan Doyle', genre: 'Mystery', rackNumber: 'M-08', bookNumber: 'TNL-00450', libraryId: tnagar.id, isAvailable: true },
    { title: 'Circe', author: 'Madeline Miller', genre: 'Fantasy', rackNumber: 'F-11', bookNumber: 'TNL-00460', libraryId: tnagar.id, isAvailable: true },
    { title: 'Anna Karenina', author: 'Leo Tolstoy', genre: 'Classic', rackNumber: 'K-02', bookNumber: 'TNL-00512', libraryId: tnagar.id, isAvailable: false, expectedAvailableDate: daysFromNow(9) },

    // Bangalore City Central
    { title: 'The Song of Achilles', author: 'Madeline Miller', genre: 'Fantasy', rackNumber: 'F-01', bookNumber: 'BCL-01001', libraryId: bangalore.id, isAvailable: true },
    { title: 'Homo Deus', author: 'Yuval Noah Harari', genre: 'Non-fiction', rackNumber: 'B-02', bookNumber: 'BCL-01050', libraryId: bangalore.id, isAvailable: true },
    { title: 'The Kite Runner', author: 'Khaled Hosseini', genre: 'Fiction', rackNumber: 'A-19', bookNumber: 'BCL-01102', libraryId: bangalore.id, isAvailable: false, expectedAvailableDate: daysFromNow(5) },
    { title: 'Deep Work', author: 'Cal Newport', genre: 'Productivity', rackNumber: 'C-30', bookNumber: 'BCL-01203', libraryId: bangalore.id, isAvailable: true },
    { title: 'The Martian', author: 'Andy Weir', genre: 'Science Fiction', rackNumber: 'E-20', bookNumber: 'BCL-01301', libraryId: bangalore.id, isAvailable: true },
    { title: 'A Brief History of Time', author: 'Stephen Hawking', genre: 'Science', rackNumber: 'S-01', bookNumber: 'BCL-01410', libraryId: bangalore.id, isAvailable: false, expectedAvailableDate: daysFromNow(7) },
    { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', genre: 'Science Fiction', rackNumber: 'E-25', bookNumber: 'BCL-01455', libraryId: bangalore.id, isAvailable: true },

    // Mumbai Central
    { title: 'The White Tiger', author: 'Aravind Adiga', genre: 'Fiction', rackNumber: 'A-05', bookNumber: 'MCL-02001', libraryId: mumbai.id, isAvailable: true },
    { title: 'Shantaram', author: 'Gregory David Roberts', genre: 'Fiction', rackNumber: 'A-40', bookNumber: 'MCL-02110', libraryId: mumbai.id, isAvailable: false, expectedAvailableDate: daysFromNow(10) },
    { title: 'Freakonomics', author: 'Steven D. Levitt', genre: 'Economics', rackNumber: 'C-05', bookNumber: 'MCL-02205', libraryId: mumbai.id, isAvailable: true },
    { title: 'The Immortals of Meluha', author: 'Amish Tripathi', genre: 'Mythology', rackNumber: 'G-01', bookNumber: 'MCL-02300', libraryId: mumbai.id, isAvailable: true },
    { title: "Midnight's Children", author: 'Salman Rushdie', genre: 'Classic', rackNumber: 'K-10', bookNumber: 'MCL-02410', libraryId: mumbai.id, isAvailable: false, expectedAvailableDate: daysFromNow(3) },
    { title: '1984', author: 'George Orwell', genre: 'Classic', rackNumber: 'K-15', bookNumber: 'MCL-02455', libraryId: mumbai.id, isAvailable: true },
    { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Classic', rackNumber: 'K-16', bookNumber: 'MCL-02460', libraryId: mumbai.id, isAvailable: true },
  ]);

  /* ---------------------------- Digital books ---------------------------- */
  // All titles below are genuinely public domain and hosted by Project Gutenberg.
  await DigitalBook.bulkCreate([
    { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Classic', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/1342' },
    { title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle', genre: 'Mystery', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/1661' },
    { title: "Alice's Adventures in Wonderland", author: 'Lewis Carroll', genre: 'Fantasy', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/11' },
    { title: 'Frankenstein', author: 'Mary Shelley', genre: 'Horror', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/84' },
    { title: 'Moby-Dick', author: 'Herman Melville', genre: 'Classic', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/2701' },
    { title: 'Dracula', author: 'Bram Stoker', genre: 'Horror', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/345' },
    { title: 'Great Expectations', author: 'Charles Dickens', genre: 'Classic', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/1400' },
    { title: 'A Tale of Two Cities', author: 'Charles Dickens', genre: 'Historical Fiction', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/98' },
    { title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', genre: 'Classic', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/174' },
    { title: 'Little Women', author: 'Louisa May Alcott', genre: 'Fiction', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/514' },
    { title: 'The Wonderful Wizard of Oz', author: 'L. Frank Baum', genre: 'Fantasy', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/55' },
    { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', genre: 'Classic', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/2554' },
    { title: 'The Odyssey', author: 'Homer', genre: 'Epic Poetry', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/1727' },
    { title: 'War and Peace', author: 'Leo Tolstoy', genre: 'Classic', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/2600' },
    { title: 'Jane Eyre', author: 'Charlotte Bronte', genre: 'Classic', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/1260' },
    { title: 'Wuthering Heights', author: 'Emily Bronte', genre: 'Classic', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/768' },
    { title: 'The Strange Case of Dr Jekyll and Mr Hyde', author: 'Robert Louis Stevenson', genre: 'Horror', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/43' },
    { title: 'The Time Machine', author: 'H. G. Wells', genre: 'Science Fiction', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/35' },
    { title: 'Meditations', author: 'Marcus Aurelius', genre: 'Philosophy', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/2680' },
    { title: 'The Art of War', author: 'Sun Tzu', genre: 'Philosophy', source: 'Project Gutenberg', license: 'Public Domain', readOnlineUrl: 'https://www.gutenberg.org/ebooks/132' },
  ]);

  console.log('Seed complete.');
  console.log('  Libraries: 5   Books: 35   Digital titles: 20');
  console.log('  Admin login: admin / admin123');
  console.log('  Demo user:  asha / password123');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
