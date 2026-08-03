const app = require('./app');
const { sequelize } = require('./models');
const { startScheduler } = require('./jobs/scheduler');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('[db] Connection established.');

    // In production, prefer running schema.sql + real migrations.
    // sync({ alter: true }) is convenient for local development.
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('[db] Models synced.');

    startScheduler();

    app.listen(PORT, () => console.log(`[server] ShelfX API listening on port ${PORT}`));
  } catch (err) {
    console.error('[server] Failed to start:', err);
    process.exit(1);
  }
}

start();
