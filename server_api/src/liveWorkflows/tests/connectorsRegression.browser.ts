import { regressionCase } from "./regression/suite.js";
import { connectorFixtures } from "./regression/connectorFixtures.js";
import { connectorsScenario } from "./regression/connectors.js";
const fixtures = connectorFixtures();
regressionCase(
  "connectors",
  (harness, output, signal) =>
    connectorsScenario(harness, output, signal, fixtures),
  {
    connectors: fixtures,
  },
);
