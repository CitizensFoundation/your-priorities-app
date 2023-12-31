"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./models/index.js");
const app_js_1 = require("./app.js");
const projectsController_js_1 = require("./controllers/projectsController.js");
const app = new app_js_1.App([
    new projectsController_js_1.ProjectsController(),
], 8000);
app.listen();
