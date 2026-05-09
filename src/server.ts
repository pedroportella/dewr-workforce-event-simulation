import 'dotenv/config';
import { app } from './app.js';
import { initializeSimulation } from './modules/simulation/simulation.service.js';

const port = Number(process.env.PORT || 4100);

async function start() {
  try {
    await initializeSimulation();

    app.listen(port, () => {
      console.log(`DEWR workforce event simulation running on http://localhost:${port}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
}

void start();
