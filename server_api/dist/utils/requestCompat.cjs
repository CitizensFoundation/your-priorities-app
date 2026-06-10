"use strict";
const axios = require("axios");
const FormData = require("form-data");
const { PassThrough } = require("stream");
const mergeOptions = (defaults, overrides) => {
    return {
        ...defaults,
        ...overrides,
        headers: {
            ...(defaults.headers || {}),
            ...(overrides.headers || {}),
        },
    };
};
const normalizeInput = (input, methodOverride) => {
    const options = typeof input === "string"
        ? { url: input }
        : input && typeof input === "object"
            ? { ...input }
            : {};
    options.method = (methodOverride || options.method || "GET").toUpperCase();
    return options;
};
const appendFormValue = (form, key, value) => {
    if (Array.isArray(value)) {
        value.forEach((entry) => appendFormValue(form, key, entry));
        return;
    }
    if (value &&
        typeof value === "object" &&
        Object.prototype.hasOwnProperty.call(value, "value")) {
        form.append(key, value.value, value.options || undefined);
    }
    else {
        form.append(key, value == null ? "" : value);
    }
};
const buildFormData = (formDataInput) => {
    const form = new FormData();
    Object.entries(formDataInput || {}).forEach(([key, value]) => {
        appendFormValue(form, key, value);
    });
    return form;
};
const shouldUseJson = (options) => {
    return options.json !== undefined && options.json !== false;
};
const buildAxiosConfig = (options, streamResponse = false) => {
    const headers = { ...(options.headers || {}) };
    const config = {
        url: options.url,
        method: (options.method || "GET").toLowerCase(),
        headers,
        params: options.qs,
        responseType: streamResponse
            ? "stream"
            : options.encoding === null
                ? "arraybuffer"
                : "text",
        responseEncoding: !streamResponse && options.encoding !== null
            ? options.encoding || "utf8"
            : undefined,
        timeout: options.timeout,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        validateStatus: () => true,
    };
    if (options.followRedirect === false) {
        config.maxRedirects = 0;
    }
    if (options.formData) {
        const form = buildFormData(options.formData);
        config.data = form;
        Object.assign(headers, form.getHeaders());
    }
    else if (shouldUseJson(options)) {
        if (options.json !== true) {
            config.data = options.json;
        }
        else if (options.body !== undefined) {
            config.data = options.body;
        }
        if (!headers["Content-Type"] && !headers["content-type"]) {
            headers["Content-Type"] = "application/json";
        }
    }
    else if (options.body !== undefined) {
        config.data = options.body;
    }
    return config;
};
const normalizeBody = (response, options) => {
    let body = response.data;
    if (options.encoding === null) {
        return Buffer.isBuffer(body) ? body : Buffer.from(body);
    }
    if (Buffer.isBuffer(body)) {
        body = body.toString(options.encoding || "utf8");
    }
    else if (body == null) {
        body = "";
    }
    else if (typeof body !== "string") {
        if (shouldUseJson(options)) {
            return body;
        }
        body = String(body);
    }
    if (shouldUseJson(options) && body !== "") {
        try {
            return JSON.parse(body);
        }
        catch (error) {
            return body;
        }
    }
    return body;
};
const buildResponse = (response, body) => {
    return {
        statusCode: response.status,
        statusMessage: response.statusText,
        headers: response.headers,
        body,
    };
};
const normalizeTransportError = (error) => {
    if (!error || typeof error !== "object") {
        return error;
    }
    if (!error.errno) {
        error.errno = error.code || error.cause?.code;
    }
    return error;
};
const createRequestStream = async (options, output) => {
    try {
        const response = await axios(buildAxiosConfig(options, true));
        const responseMeta = buildResponse(response, response.data);
        output.emit("response", responseMeta);
        response.data.on("error", (error) => output.emit("error", normalizeTransportError(error)));
        response.data.pipe(output);
    }
    catch (error) {
        output.emit("error", normalizeTransportError(error));
    }
};
const executeRequest = async (options, callback) => {
    try {
        const response = await axios(buildAxiosConfig(options));
        const body = normalizeBody(response, options);
        const requestResponse = buildResponse(response, body);
        callback(null, requestResponse, body);
    }
    catch (error) {
        callback(normalizeTransportError(error), null, undefined);
    }
};
const createRequestClient = (defaultOptions = {}) => {
    const requestClient = (input, callback) => {
        const options = mergeOptions(defaultOptions, normalizeInput(input));
        if (typeof callback === "function") {
            void executeRequest(options, callback);
            return null;
        }
        const output = new PassThrough();
        void createRequestStream(options, output);
        return output;
    };
    requestClient.defaults = (overrides = {}) => {
        return createRequestClient(mergeOptions(defaultOptions, overrides));
    };
    ["get", "post", "put", "head", "delete"].forEach((method) => {
        requestClient[method] = (input, callback) => {
            return requestClient(normalizeInput(input, method.toUpperCase()), callback);
        };
    });
    return requestClient;
};
module.exports = createRequestClient();
