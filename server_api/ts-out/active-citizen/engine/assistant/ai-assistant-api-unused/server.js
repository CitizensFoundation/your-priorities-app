"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./models/index.js");
const app_js_1 = require("./app.js");
const analyticsController_js_1 = require("./controllers/analyticsController.js");
const projectsController_js_1 = require("./controllers/projectsController.js");
const app = new app_js_1.App([
    new projectsController_js_1.ProjectsController(),
    new analyticsController_js_1.AnalyticsController(),
], 8000);
app.listen();
