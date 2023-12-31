import './models/index.js';
import { App } from './app.js';
import { ProjectsController } from './controllers/projectsController.js';

const app = new App(
  [
    new ProjectsController(),
  ],
  8000,
);

app.listen();