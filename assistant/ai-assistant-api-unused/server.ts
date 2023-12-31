import './models/index.js';
import { App } from './app.js';
import { AnalyticsController } from './controllers/analyticsController.js';
import { ProjectsController } from './controllers/projectsController.js';

const app = new App(
  [
    new ProjectsController(),
    new AnalyticsController(),
  ],
  8000,
);

app.listen();