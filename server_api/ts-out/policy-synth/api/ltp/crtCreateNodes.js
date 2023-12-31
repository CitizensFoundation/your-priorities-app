"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyCauses = exports.getParentNodes = exports.convertToNodes = exports.filterTopCauses = exports.renderUserPrompt = exports.renderSystemPrompt = void 0;
const openai_1 = require("openai");
const uuid_1 = require("uuid");
const DEBUGGING = true;
const config = {
    apiKey: process.env.OPENAI_KEY,
};
const renderSystemPrompt = (causeToExmine = undefined, parentNodes = undefined) => {
    const prompt = `
    You are a helpful Logical Thinking Process assistant. We're working on a Current Reality Tree.

    We will work step by step and down the Current Reality Tree until we find the root cause of the "Undesireable Effect".

    ${causeToExmine != undefined
        ? `
      Please output 7 direct causes of the cause presented in the "Cause to Examine" below. The causes must be direct causes of the "Cause to Examine" not results of it.
    `
        : `
      Please output 7 direct causes of the "Undesireable Effect" and analyse the "Possible Raw Unclassified Causes" for ideas.
    `}

    Important: You MUST evaluate the 7 direct causes before you output them and check the following:
    • 1. Are the premises and the conclusion stated as whole sentences, that is, containing subject, verb and object?
    • 2. Are the premises and the conclusion likely to be true?
    • 3. Are the premises and the conclusion clearly stated?
    • 4. Are the logical connections between the premises and the conclusion clear?
    • 5. Are the premises sufficient to lead to the conclusion, and if not, what additional premises are needed?
    • 6. Are there some other potential causes that might lead to the same conclusion?
    • 7. Will the conclusion still be valid if one or more of the premises are removed?
    • 8. Are there any intermediate steps needed for the premises to lead to the conclusion?
    • 9. Is it possible that cause and effect are reversed in the statement?
    • 10. Does the statement express circular logic?

    Please output each direct cause in JSON without any explanation:
      { directCauseDescription, isDirectCause<bool>, isLikelyARootCauseOfUDE<bool>, confidenceLevel<int> }

    The directCauseDescription JSON should never be more than 11 words long.

    ${parentNodes != undefined
        ? `Direct and possible intermediate causes of the "Cause to Examine" are included below for your reference but you still need to focus your creation of direct causes on the "Cause to Examine" only.`
        : ``}

    ${causeToExmine != undefined
        ? `
    For the isDirectCause JSON field, please output true if the cause we are examining is a direct cause of the "Cause to Examine", otherwise output false.

    For the isLikelyARootCauseOfUDE JSON field, please output true if "Cause to Examine" is likely the root cause of the "Undesireable Effect (UDE)", otherwise output false.
    `
        : `
    Always keep the isLikelyARootCauseOfUDE to false for now as this is the first level of direct causes.
  `}

    You must never offer explainations, only output JSON array.
  `;
    return prompt;
};
exports.renderSystemPrompt = renderSystemPrompt;
const renderUserPrompt = (currentRealityTree, currentUDE, causeToExmine = undefined, parentNodes = undefined) => {
    // add all but the first node to selectedParentNodes
    return `Context: ${currentRealityTree.context}
          Undesirable Effect (UDE): ${currentUDE}

          ${parentNodes && parentNodes.length > 1
        ? `
            Chain of causes leading to the root cause we are searching for step by step:
          `
        : ``}

          ${parentNodes
        ? parentNodes
            .slice(1)
            .reverse()
            .map((node, index) => `
            ${index === 0 ? `Direct cause of UDE` : `Intermediate cause of UDE`}:
            ${node.description}

          `)
        : ""}

          ${causeToExmine
        ? `
            Cause to Examine: ${causeToExmine.description}

            Output the possible Direct Causes of the cause we are examining here in JSON:
          `
        : `
            Possible Direct Causes JSON Array Output:
           `}

          `;
};
exports.renderUserPrompt = renderUserPrompt;
const filterTopCauses = (parsedMessages) => {
    const directCauses = parsedMessages.filter((message) => message.isDirectCause);
    const sortedMessages = directCauses.sort((a, b) => b.confidenceLevel - a.confidenceLevel);
    const top3Messages = sortedMessages.slice(0, 3);
    return top3Messages;
};
exports.filterTopCauses = filterTopCauses;
const convertToNodes = (topCauses, nodeType, debug = undefined) => {
    return topCauses.map((cause) => {
        return {
            id: (0, uuid_1.v4)(),
            description: cause.directCauseDescription,
            type: nodeType,
            isRootCause: cause.isLikelyARootCauseOfUDE,
            isLogicValidated: false,
            debug,
        };
    });
};
exports.convertToNodes = convertToNodes;
const getParentNodes = (nodes, // Pass in crt.nodes here
currentNodeId, parentNodes = []) => {
    for (const node of nodes) {
        // Check if the current node is a direct child of this node
        const isDirectChild = node.andChildren?.some((child) => child.id === currentNodeId) ||
            node.orChildren?.some((child) => child.id === currentNodeId);
        if (isDirectChild) {
            parentNodes.push(node);
            // Call recursively with the parent node's ID
            return (0, exports.getParentNodes)(nodes, node.id, parentNodes);
        }
        // Recursively check in andChildren and orChildren
        const andChildrenResult = node.andChildren
            ? (0, exports.getParentNodes)(node.andChildren, currentNodeId, parentNodes)
            : undefined;
        const orChildrenResult = node.orChildren
            ? (0, exports.getParentNodes)(node.orChildren, currentNodeId, parentNodes)
            : undefined;
        if (andChildrenResult || orChildrenResult) {
            // If either returns a result, we found the parent node
            if (!parentNodes.includes(node)) {
                parentNodes.push(node);
            }
            return parentNodes;
        }
    }
    return parentNodes.length === 0 ? undefined : parentNodes;
};
exports.getParentNodes = getParentNodes;
const identifyCauses = async (crt, currentUDE, currentparentNode = undefined) => {
    let parentNodes = undefined;
    if (currentparentNode) {
        parentNodes = (0, exports.getParentNodes)(crt.nodes, currentparentNode.id);
    }
    let nodeType;
    if (!currentparentNode) {
        nodeType = "ude";
    }
    else if (currentparentNode.type == "ude") {
        nodeType = "directCause";
    }
    else {
        nodeType = "intermediateCause";
    }
    const openai = new openai_1.OpenAI(config);
    if (DEBUGGING) {
        console.log("DEBGUGGING: currentparentNode", JSON.stringify(currentparentNode, null, 2));
        console.log("DEBGUGGING: parentNodes", JSON.stringify(parentNodes, null, 2));
        console.log("DEBUGGING: crt", JSON.stringify(crt, null, 2));
        console.log("=====================");
        console.log((0, exports.renderSystemPrompt)(currentparentNode, parentNodes));
        console.log("---------------------");
        console.log((0, exports.renderUserPrompt)(crt, currentUDE, currentparentNode, parentNodes));
        console.log("=====================");
    }
    const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
            {
                role: "system",
                content: (0, exports.renderSystemPrompt)(currentparentNode, parentNodes),
            },
            {
                role: "user",
                content: (0, exports.renderUserPrompt)(crt, currentUDE, currentparentNode, parentNodes),
            },
        ],
        max_tokens: 2048,
        temperature: 0.5,
    });
    let rawMessage = response.choices[0].message.content;
    if (DEBUGGING) {
        console.log("DEBUGGING: rawMessage", rawMessage);
    }
    rawMessage = rawMessage.trim().replace(/```json/g, "");
    rawMessage = rawMessage.replace(/```/g, "");
    const parsedMessage = JSON.parse(rawMessage);
    if (DEBUGGING) {
        console.log("DEBUGGING: parsedMessage", JSON.stringify(parsedMessage, null, 2));
    }
    const topCauses = (0, exports.filterTopCauses)(parsedMessage);
    let debug = undefined;
    if (DEBUGGING) {
        debug = {
            systemPromptUsedForGeneration: (0, exports.renderSystemPrompt)(currentparentNode, parentNodes),
            firstUserMessageUserForGeneration: (0, exports.renderUserPrompt)(crt, currentUDE, currentparentNode, parentNodes),
        };
    }
    const nodes = (0, exports.convertToNodes)(topCauses, nodeType, debug);
    if (DEBUGGING) {
        console.log("DEBUGGING: final nodes", JSON.stringify(nodes, null, 2));
    }
    return nodes;
};
exports.identifyCauses = identifyCauses;
