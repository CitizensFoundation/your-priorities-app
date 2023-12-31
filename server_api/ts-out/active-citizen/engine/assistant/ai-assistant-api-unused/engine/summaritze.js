"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai = __importStar(require("openai"));
const string = __importStar(require("string"));
const openai_async = __importStar(require("openai_async"));
const os = __importStar(require("os"));
const langchain_js_1 = require("./langchain.js");
const TEMP_LANGUAGE_LOCALE = "is";
const random = __importStar(require("random"));
const asyncio = __importStar(require("asyncio"));
async function retry_with_exponential_backoff(func, initial_delay = 1, exponential_base = 2, jitter = true, max_retries = 10000, errors = [openai.error.RateLimitError], kwargs) {
    let num_retries = 0;
    let delay = initial_delay;
    while (true) {
        try {
            return await func(kwargs);
        }
        catch (e) {
            console.log(`Exception: ${e.constructor.name}: ${e}`);
            num_retries += 1;
            if (num_retries > max_retries) {
                throw new Error(`Maximum number of retries (${max_retries}) exceeded.`);
            }
            delay *= exponential_base * (1 + (jitter ? random.random() : 0));
            console.log(`Sleeping for ${delay} seconds num retries ${num_retries}`);
            await asyncio.sleep(delay);
        }
    }
}
async function completions_with_backoff(kwargs) {
    const response = await openai_async.chat_complete(os.getenv("OPENAI_API_KEY"), 120, kwargs);
    console.log(response.json());
    console.log();
    return response.json().choices[0].message.content;
}
async function summarize_text(prompt, text, custom_system_message = null, skip_icelandic = false) {
    const final_is_postfix = !skip_icelandic ? "" : "";
    console.log(`Prompt length: ${prompt.length}`);
    console.log(`Text length: ${text.length}`);
    return await retry_with_exponential_backoff(completions_with_backoff, {
        initial_delay: 1,
        exponential_base: 2,
        max_retries: 3,
        errors: [openai.error.RateLimitError],
        model: "gpt-4",
        temperature: 0.2,
        messages: [
            {
                role: "system",
                content: (custom_system_message || "") + final_is_postfix,
            },
            {
                role: "user",
                content: prompt + text,
            },
        ],
    });
}
const system_message = `You are an effective text summarization and shortening system.
If you can't shorten or summarize the text just output the original text.`;
const emoji_system_message = `You are a helpful Emoji generator. You must always output 2 Emojis, not 1 and not 3.`;
const one_word_system_message = `You are a helpful and advanced summary tool. You can take the text and create a one-word emotional summary. `;
const emoji_prompt_prefix = `Please read the text here carefully and then create two Emojis to represent the concept. Only output two emojis and no text. Let's think step by step:

`;
const one_word_prompt_prefix = `Please read the text here carefully and then output one word that best describes the idea in the most emotional way. Do not use the most obvious word, like Dog, for dog-related ideas. Dive deeper. Only output one word. Let's think step by step:

`;
const short_name_prompt_prefix = `Please shorten the idea name as much as possible without using abbreviations.

`;
const short_summary_prefix = `Please summarize the text below as much as possible without using abbreviations in one short paragraph. Please keep it as short as possible.

`;
const full_summary_prefix = `Please summarize the text below in detail and leave no part of the concept out.

`;
const full_points_for_summary_prefix = `Please summarize the points for the idea below in full detail, in one to three paragraphs, and leave nothing out. All opinions in the points below must be included in this summary.

`;
const short_points_for_summary_prefix = `Please summarize the points for below as much as possible without using abbreviations in one short paragraph. Please keep it very short, only a few sentences.

`;
const full_points_against_summary_prefix = `Please summarize the points against the idea below in full detail, in one to three paragraphs, and leave nothing out. All opinions in the points below must be included in this summary.

`;
const short_points_against_summary_prefix = `Please summarize the points against below as much as possible without using abbreviations in one short paragraph. Please keep it very short, only a few sentences.


`;
const is_prefix_postfix = `Always return Icelandic summarizations

`;
const en_prefix_postfix = `Always return English summarizations

`;
const es_prefix_postfix = `Always return Estonian summarizations

`;
const emojiSummaryTemplate = `{emojis}`;
const oneWordSummaryTemplate = `{one_word}`;
const shortPostNameTemplate = `{name} [{source}]

  Neighborhood: {group_name}


`;
const summaryTemplate = `{summary} [{source}]

  Neighborhood: {group_name}

`;
const summaryWithPointsTemplate = `{summary} [{source}]

  Neighborhood: {group_name}

  Points for: {points_for}

  Points against: {points_against}

  <likes={counter_endorsements_up}>
  <dislikes={counter_endorsements_down}>


`;
const summaryWithPointsAndImageTemplate = `{summary} [{source}]

  Neighborhood: {group_name}

  Points for: {points_for}

  Points against: {points_against}

  <likes={counter_endorsements_up}>
  <dislikes={counter_endorsements_down}>


`;
function get_final_prefix(prefix) {
    if (TEMP_LANGUAGE_LOCALE === "is") {
        return prefix + is_prefix_postfix;
    }
    else {
        return prefix;
    }
}
async function summarize_emoji(text) {
    console.log(`

Summarizing emoji`);
    return await summarize_text(get_final_prefix(emoji_prompt_prefix), text, emoji_system_message, true);
}
async function summarize_one_word(text) {
    console.log(`

Summarizing one word`);
    return await summarize_text(get_final_prefix(one_word_prompt_prefix), text, one_word_system_message);
}
async function summarize_short_name(text) {
    console.log(`

Summarizing short name`);
    return await summarize_text(get_final_prefix(short_name_prompt_prefix), text);
}
async function summarize_short_summary(text) {
    console.log(`

Summarizing short summary`);
    return await summarize_text(get_final_prefix(short_summary_prefix), text);
}
async function summarize_full_summary(text) {
    console.log(`

Summarizing full summary`);
    return await summarize_text(get_final_prefix(full_summary_prefix), text);
}
async function summarize_full_points_for_summary(text) {
    console.log(`

Summarizing full points for summary`);
    return await summarize_text(get_final_prefix(full_points_for_summary_prefix), text);
}
async function summarize_short_points_for_summary(text) {
    console.log(`

Summarizing short points for summary`);
    return await summarize_text(get_final_prefix(short_points_for_summary_prefix), text);
}
async function summarize_full_points_against_summary(text) {
    console.log(`

Summarizing full points against summary`);
    return await summarize_text(get_final_prefix(full_points_against_summary_prefix), text);
}
async function summarize_short_points_against_summary(text) {
    console.log(`

Summarizing short points against summary`);
    return await summarize_text(get_final_prefix(short_points_against_summary_prefix), text);
}
async function get_emoji_summary(post) {
    const prompt = new langchain_js_1.PromptTemplate(["emojis"], emojiSummaryTemplate);
    const emoji_summary = await summarize_emoji(`${post.name}
${post.description}`);
    console.log(emoji_summary);
    return prompt.format({ emojis: emoji_summary });
}
async function get_one_word_summary(post) {
    const prompt = new langchain_js_1.PromptTemplate(["one_word"], oneWordSummaryTemplate);
    const one_word_summary = await summarize_one_word(`${post.name}
${post.description}`);
    console.log(one_word_summary);
    const one_word_summary_without_punctuation = one_word_summary.translate(string.maketrans("", "", string.punctuation));
    return prompt.format({ one_word: one_word_summary_without_punctuation });
}
async function get_short_post_name(post) {
    const prompt = new langchain_js_1.PromptTemplate(["name", "group_name", "source"], shortPostNameTemplate);
    const short_name = await summarize_short_name(post.name);
    console.log(short_name);
    return prompt.format({
        name: short_name,
        group_name: post.group_name,
        source: post.post_id,
    });
}
async function get_short_post_summary(post) {
    const prompt = new langchain_js_1.PromptTemplate(["group_name", "source", "summary"], summaryTemplate);
    const short_summary = await summarize_short_summary(`${post.name}
${post.description}`);
    console.log(short_summary);
    return prompt.format({
        summary: short_summary,
        group_name: post.group_name,
        source: post.post_id,
    });
}
async function get_full_post_summary(post) {
    const prompt = new langchain_js_1.PromptTemplate(["group_name", "source", "summary"], summaryTemplate);
    const full_summary = await summarize_full_summary(`${post.name}
${post.description}`);
    console.log(full_summary);
    return prompt.format({
        summary: full_summary,
        group_name: post.group_name,
        source: post.post_id,
    });
}
async function get_short_post_summary_with_points(post) {
    const prompt = new langchain_js_1.PromptTemplate([
        "group_name",
        "counter_endorsements_up",
        "counter_endorsements_down",
        "source",
        "points_for",
        "points_against",
        "summary",
    ], summaryWithPointsTemplate);
    const short_summary = await summarize_short_summary(`${post.name}
${post.description}`);
    let points_for_short_summary = "";
    let points_against_short_summary = "";
    if (post.points_for !== "") {
        points_for_short_summary = await summarize_short_points_for_summary(`${post.name}
${post.points_for}`);
    }
    if (post.points_against !== "") {
        points_against_short_summary = await summarize_short_points_against_summary(`${post.name}
${post.points_against}`);
    }
    console.log(short_summary);
    console.log(points_for_short_summary);
    console.log(points_against_short_summary);
    return prompt.format({
        summary: short_summary,
        group_name: post.group_name,
        source: post.post_id,
        counter_endorsements_up: post.counter_endorsements_up,
        counter_endorsements_down: post.counter_endorsements_down,
        points_for: points_for_short_summary,
        points_against: points_against_short_summary,
    });
}
async function get_full_post_summary_with_points(post) {
    const prompt = new langchain_js_1.PromptTemplate([
        "group_name",
        "counter_endorsements_up",
        "counter_endorsements_down",
        "source",
        "points_for",
        "points_against",
        "summary",
    ], summaryWithPointsAndImageTemplate);
    const short_summary = await summarize_full_summary(`${post.name}
${post.description}`);
    let points_for_short_summary = "";
    let points_against_short_summary = "";
    if (post.points_for !== "") {
        points_for_short_summary = await summarize_full_points_for_summary(`${post.name}
${post.points_for}`);
    }
    if (post.points_against !== "") {
        points_against_short_summary = await summarize_full_points_against_summary(`${post.name}
${post.points_against}`);
    }
    return prompt.format({
        summary: short_summary,
        group_name: post.group_name,
        source: post.post_id,
        counter_endorsements_up: post.counter_endorsements_up,
        counter_endorsements_down: post.counter_endorsements_down,
        points_for: points_for_short_summary,
        points_against: points_against_short_summary,
    });
}
