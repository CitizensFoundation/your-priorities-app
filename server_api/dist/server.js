import { runLocalMigrations } from './migration.js';
import { YourPrioritiesApi } from './app.js';
await runLocalMigrations();
const app = new YourPrioritiesApi(8000);
app.listen();
