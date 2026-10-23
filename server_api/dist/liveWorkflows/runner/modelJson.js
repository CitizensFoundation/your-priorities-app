import { jsonrepair } from "jsonrepair";
/** Local syntax repair only: never repeats a paid provider request. */
export function modelJson(content) {
    const text = content
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "");
    try {
        return JSON.parse(text);
    }
    catch {
        try {
            return JSON.parse(jsonrepair(text));
        }
        catch {
            throw Object.assign(new Error("Model returned invalid JSON after local repair"), { code: "record_invalid" });
        }
    }
}
