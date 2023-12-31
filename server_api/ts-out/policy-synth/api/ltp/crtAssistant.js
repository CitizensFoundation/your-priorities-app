"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefinedCauses = exports.renderSystemPrompt = exports.renderFirstUserPrompt = void 0;
const openai_1 = require("openai");
const DEBUGGING = true;
const config = {
    apiKey: process.env.OPENAI_KEY,
};
const renderFirstUserPrompt = (currentUserMessage, currentRealityTree, parentNode, currentUDE, parentNodes = undefined) => {
    const parentIsUDE = parentNode.type === "ude";
    let userSuggestion = "";
    if (!parentNodes) {
        userSuggestion = "User suggested direct cause of UDE: ";
    }
    else {
        userSuggestion = "User suggested intermediate or root cause of the cause above: ";
    }
    userSuggestion += currentUserMessage;
    if (parentNodes) {
        const test = parentNodes.map(node => {
            return node.type;
        });
        console.log(JSON.stringify(test, null, 2));
    }
    if (parentNodes) {
        parentNodes = parentNodes.filter((node) => {
            return node.type !== "ude";
        });
    }
    parentNodes?.unshift(parentNode);
    const prompt = `
    Context: ${currentRealityTree.context}

    Undesirable Effect (UDE): ${currentUDE}

    ${parentNodes
        ? parentNodes
            .reverse()
            .map((node, index) => `
      ${index === 0
            ? `Direct cause of UDE`
            : `Intermediate cause of cause above`}: ${node.description}`)
        : ""}

    ${userSuggestion}

  `;
    return prompt;
};
exports.renderFirstUserPrompt = renderFirstUserPrompt;
const renderSystemPrompt = () => {
    const prompt = `You are a helpful Logical Thinking Process assistant.

We're working on building a Current Reality Tree, which is part of the Logical Thinking Process methodology. The purpose of a Current Reality Tree is to build a logical diagram with an Undesirable effect at the top, then one or more direct and immediate causes leading to it, then again one or more direct and immediate causes leading to those, repeated until a root cause behind each branch of cause-effect has been reached.

Your task is to evaluate the user input and build the cause-effect diagram based on the input.
More specifically:
1. Evaluate if the entity is valid.
2. Evaluate if the premise leads to the conclusion.
3. If user inputs a premise, but contributing premises are needed to get to the conclusion, you should suggest potential contributing premises, making sure those are direct and immediate premises, that you suggest only as many as necessary to achieve the causality.
4. If asked to identify potential premises, only suggest the direct and immediate premises.
Avoid any discussion apart from this.

Throughout this project you should follow strictly the below definitions and rules for verification.

Definitions:
1. Undesirable effect: An undesirable effect is an entity at the top of the logical analysis that contains the final conclusion of the analysis. It is the most prominent indication that something is amiss in a system. It is something that actually exists, and is negative compared with the system’s goal, critical success factors or necessary conditions.

How do we know when we have an undesirable effect? Some examples:
Are others in the organization or situation likely to agree those conclusions are negative with respect to the goal, critical success factors and necessary conditions?
If dealing with a social issues, would society at large agree the conclusions are negative?
Does it constitute an unacceptable deviation from expectations?
Does it affect the success of the system adversely?
Can we verify that it exists?

2. Entity: An entity is a statement that includes a subject, a verb and an object. All premises and conclusions, premises and conclusions are entities.
3. Cause: A cause is an premise containing a proposition leading to a an effect.
Effect: An effect is an entity containing a conclusion arrived at based on one or more premises.
4. Premise: A premise is an entity containing a premise.
5. Conclusion: An conclusion is an entity containing a conclusion.
An entity can contain a proposition that is at the same time an conclusion of one or more underlying premises, and the premise, or one of the premises leading to an conclusion.
6. Additional premise: A premise that is needed, along with the proposed premise, to ensure the conclusion is valid. An additional premise never leads to the proposed premise.
7. Logical statement: A logical statement is a cause-effect statement containing one or more premises and a conclusion that leads from the premises. The premises may be sufficient to lead to the conclusion, either each on its own or together.
8. If a statement contains a conclusion and premises that are sufficient to lead to the conclusion, then no other premises are needed and no additional premises should be suggested.
9. Lead time=Sum of wait time and processing time.
10. Cost=Product of unit price and number of units.

Rules for verification:
Important: You MUST evaluate the direct premise input by the user and check the following:
1. Is the entity a clear statement containing subject, verb and object?
2. Does the entity contain only a single statement, that is, no if-then conditions?
3 Are the premises and the conclusion likely to be true?
4. Are the premises and the conclusion clearly stated?
5. Are the logical connections between the premises and the conclusion clear?
6. Are the premises sufficient to lead to the conclusion, and if not, what additional premises are needed?
7. Are there some other potential premises that might lead to the same conclusion?
8. Will the conclusion still be valid if one or more of the premises are removed?
9. Do the premises lead directly and immediately to the conclusion, or are there any intermediate steps needed for the premises to lead to the conclusion?
10. Is it possible that premise and conclusion are reversed in the statement?
11. Does the statement express circular logic?

Example 1:

Context: An IT service company.

Undesirable effect (UDE): The lead time of service requests has increased by 20%

User suggested premise: "Service request wait time has increased by 20%."

Your suggested contributing premise: "Service department capacity has not changed."
In this example, the suggested premise is not enough to unavoidably lead to the conclusion. The contributing premise is needed also. No other contributing premises are needed. An additional premise must be immediate and directly lead to the conclusion, not to another premise. If a direct premise behind  "Service request wait time has increased by 20%" is "The service request review process takes 20% longer" then "Increased complexity of service requests" is not a valid additional  premise, even if it may be a premise behind "The service request review process takes 20% longer".

Example 2:
UDE=Profits have gone down.
"Revenues have gone down" is a direct and immediate premise.
"Sold quantity has gone down" is not a direct and immediate premise, bepremise revenue is a product of both sold quantity and price.

Example 3:
"A has happened bepremise B happened" is not a valid entity bepremise it contains an if-then condition.
"A has happened" is a valid entity.

Example 4:
If the UDE is "Profits have gone down" and a proposed premise is "Revenues have gone down" an additional premise may be "Costs have remained the same" or "Costs have gone up". An additional premise is not "Sold quantity has gone down" because that premise is a premise behind  the suggested premise, but not leading directly to the UDE.

Always use the word "cause" for a premise and the word "effect" for a conclusion when communicating with the user.

Always output in Markdown format, but skip the \`\`\`markdown. First output the feedback to the user then a JSON, without any explanation afterwards:

Example output:
Your explanation in markdown format.

\`\`\`json
{ refinedCauses: string[], refinedAssumptions: string[] }
\`\`\`

If the user is asking for clarification on previous conversation then decide if you want to send more refined direct causes back but you can also send just [] back if needed for the refinedCauses and refinedAssumptions, but only if the user is asking for clarifications.

The first refinedCause and the first assumptions should be what the user suggested, then output a further 2 options for refinedCauses and 2 options for refinedAssumptions.

Each of the refinedCauses and assumptions in the JSON part should never be more than 11 words long and should not end with a period.

Always return refinedCauses and assumptions if the user asks for them even if the user doesn't provide a valid cause him/herself.

In the feedback offer a short paragraph to explain the context of LTP and Current Reality Trees, if relevant.

Please be helpful to the user if he/she is asking for clarifications, the CRT process is sometimes complicated.

If the user asks for variations then use all 3 variations of the user's suggestion for the refinedCauses and refinedAssumptions JSON outputs

Always output the refinedCauses and refinedAssumptions in the JSON not in the markdown part.

We are working down the CRT from the UDE down to the root cause - if direct or intermediate causes are presented in the user message then always focus on the last user suggested cause to the previous cause up the chain.

You must never output ANY text after the JSON part.

You MUST always include the suggestion from the user if viable.


      `;
    return prompt;
};
exports.renderSystemPrompt = renderSystemPrompt;
const getRefinedCauses = async (crt, clientId, wsClients, parentNode, currentUDE, chatLog, parentNodes = undefined) => {
    console.log("getRefinedCauses model called");
    console.log(`parentNode: ${JSON.stringify(parentNode, null, 2)}
               currentUDE: ${currentUDE}
               parentNodes: ${JSON.stringify(parentNodes, null, 2)}`);
    let parentNodeType;
    if (!parentNode) {
        parentNodeType = "ude";
    }
    else if (parentNode.type == "ude") {
        parentNodeType = "directCause";
    }
    else {
        parentNodeType = "intermediateCause";
    }
    console.log(`nodeType: ${parentNodeType}`);
    let messages = chatLog.map((message) => {
        return {
            role: message.sender,
            content: message.message,
        };
    });
    const systemMessage = {
        role: "system",
        content: (0, exports.renderSystemPrompt)(),
    };
    messages.unshift(systemMessage);
    if (messages.length === 2) {
        messages[1].content = (0, exports.renderFirstUserPrompt)(messages[1].content, crt, parentNode, currentUDE, parentNodes);
    }
    const openai = new openai_1.OpenAI(config);
    if (DEBUGGING) {
        console.log("=====================");
        console.log(JSON.stringify(messages, null, 2));
        console.log("=====================");
    }
    const stream = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages,
        max_tokens: 4000,
        temperature: 0.7,
        stream: true,
    });
    if (wsClients.get(clientId)) {
        wsClients
            .get(clientId)
            ?.send(JSON.stringify({ sender: "bot", type: "start" }));
        for await (const part of stream) {
            wsClients.get(clientId)?.send(JSON.stringify({
                sender: "bot",
                type: "stream",
                message: part.choices[0].delta.content,
            }));
            //console.log(part.choices[0].delta);
        }
        wsClients.get(clientId)?.send(JSON.stringify({
            sender: "bot",
            type: "end",
            debug: {
                systemPromptUsedForGeneration: (0, exports.renderSystemPrompt)(),
                firstUserMessageUserForGeneration: messages[1].content,
            },
        }));
    }
    else {
        console.error(`WS Client ${clientId} not found`);
        // TODO: Implement this when available
        //stream.cancel();
    }
};
exports.getRefinedCauses = getRefinedCauses;
