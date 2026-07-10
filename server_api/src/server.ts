import { runLocalMigrations } from './migration.js';

try {
	await runLocalMigrations();

	const { YourPrioritiesApi } = await import('./app.js');

	const app = new YourPrioritiesApi(8000);
	await app.initialize();
	await app.listen();
} catch (err) {
	console.error('Failed to start server_api', err);
	process.exit(1);
}
