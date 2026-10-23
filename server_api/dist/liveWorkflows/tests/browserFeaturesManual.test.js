import test from "node:test";
import assert from "node:assert/strict";
import { resolveManualConfig } from "./manual/environment.js";
import { verifyBrowserFeatureActions } from "./manual/interactiveBrowserFeatures.js";
test("browser comparison has independent priced models and rejects missing or duplicate alternatives", () => {
    const config = resolveManualConfig({
        comparisonProcessingModel: "gpt-6-sol",
        processingServiceTier: "fast",
    });
    assert.equal(config.codexModel, "gpt-6-luna");
    assert.equal(config.processingModel.id, "gpt-6-luna");
    assert.equal(config.comparisonProcessingModel?.id, "gpt-6-sol");
    assert.equal(config.comparisonProcessingModel?.inferenceType, "priority");
    assert.ok(config.comparisonProcessingModel.outputMicrosPerMillion >
        config.processingModel.outputMicrosPerMillion);
    assert.equal(config.comparisonProcessingModel?.keyEnv, config.processingModel.keyEnv);
    assert.throws(() => resolveManualConfig({ comparisonProcessingModel: "gpt-6-luna" }), /different/);
    assert.throws(() => resolveManualConfig({ comparisonProcessingModel: "missing" }), /backend model catalog/);
    assert.equal(resolveManualConfig({}).comparisonProcessingModel, undefined);
});
test("feature browser evidence requires a saved edit, refresh, comparison, filters and delivered files", () => {
    const actions = [
        ["POST", "account/api-key"],
        ["POST", "chat"],
        ["GET", "codex-models"],
        ["PUT", "assistant-settings"],
        ["GET", "/"],
        ["PUT", "assistant-settings"],
        ["POST", "assets"],
        ["GET", "assets/source/preview"],
        ["GET", "assets/source"],
        ["POST", "chat"],
        ["GET", "runs/first/results"],
        ["PUT", "graph"],
        ["GET", "/"],
        ["POST", "runs"],
        ["POST", "runs/second/start"],
        ["GET", "runs/second/results"],
        ["GET", "usage"],
        ["GET", "revisions"],
        ["GET", "storage"],
        ["GET", "assets/first-result"],
        ["GET", "assets/second-result"],
    ];
    const observed = actions.map(([method, route], index) => ({
        method,
        route: route === "/" ? "/" : `/api/live-workflows/groups/1/${route}`,
        order: index + 1,
        status: 200,
        searched: route === "runs/second/results",
        compared: route === "runs/second/results",
        filtered: route === "runs/second/results",
    }));
    const verify = (items) => verifyBrowserFeatureActions(items, "first", "second", [
        "source",
        "first-result",
        "second-result",
    ]);
    verify(observed);
    for (const suffix of [
        "/graph",
        "/runs",
        "/usage",
        "/storage",
        "/revisions",
        "/preview",
        "/second-result",
        "/first/results",
        "/start",
        "/assistant-settings",
        "/codex-models",
    ])
        assert.throws(() => verify(observed.filter((item) => !item.route.endsWith(suffix))), `Missing ${suffix} must fail`);
    assert.throws(() => verify(observed.filter((item) => item.route !== "/")), /Refresh/);
    for (const field of ["searched", "filtered", "compared"])
        assert.throws(() => verify(observed.map((item) => ({ ...item, [field]: false }))));
    assert.throws(() => verify(observed.map((item) => item.route.endsWith("/graph") ? { ...item, status: 409 } : item)), /Save one/);
    assert.throws(() => verify([
        ...observed,
        {
            ...observed.find((item) => item.route.endsWith("/graph")),
            order: 30,
        },
    ]), /cancelling/);
    assert.throws(() => verify(observed.map((item) => item.route === "/" ? { ...item, order: 99 } : item)), /Refresh/);
});
