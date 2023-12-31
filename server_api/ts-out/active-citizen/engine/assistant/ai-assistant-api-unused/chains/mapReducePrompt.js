"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const langchain_1 = require("langchain");
const question_prompt_template = `Use the following portion of a long document to see if any of the text is relevant to answer the question.
Return any relevant text verbatim.
{context}
Question: {question}
Relevant text, if any:`;
const QUESTION_PROMPT = new langchain_1.PromptTemplate(question_prompt_template, ["context", "question"]);
const combine_prompt_template = `Given the following extracted parts of a long document and a question, create a final answer with references ("SOURCES").
If you don't know the answer, just say that you don't know. Don't try to make up an answer.
ALWAYS return a "SOURCES" part in your answer.

QUESTION: Which state/country's law governs the interpretation of the contract?
==========
Content: This Agreement is governed by English law and the parties submit to the exclusive jurisdiction of the English courts in relation to any dispute (contractual or non-contractual) concerning this Agreement save that either party may apply to any court for an injunction or other relief to protect its Intellectual Property Rights.
Source: 28-pl
Content: No Waiver. Failure or delay in exercising any right or remedy under this Agreement shall not constitute a waiver of such (or any other) right or remedy.

11.7 Severability. The invalidity, illegality or unenforceability of any term (or part of a term) of this Agreement shall not affect the continuation in force of the remainder of the term (if any) and this Agreement.

11.8 No Agency. Except as expressly stated otherwise, nothing in this Agreement shall create an agency, partnership or joint venture of any kind between the parties.

11.9 No Third-Party Beneficiaries.
Source: 30-pl
Content: (b) if Google believes, in good faith, that the Distributor has violated or caused Google to violate any Anti-Bribery Laws (as defined in Clause 8.5) or that such a violation is reasonably likely to occur,
Source: 4-pl
==========
FINAL ANSWER: This Agreement is governed by English law.
SOURCES: 28-pl

QUESTION: What did the president say about Michael Jackson?
==========
Content: Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.

Last year COVID-19 kept us apart. This year we are finally together again.

Tonight, we meet as Democrats Republicans and Independents. But most importantly as Americans.

With a duty to one another to the American people to the Constitution.

And with an unwavering resolve that freedom will always triumph over tyranny.

Six days ago, Russia’s Vladimir Putin sought to shake the foundations of the free world thinking he could make it bend to his menacing ways. But he badly miscalculated.

He thought he could roll into Ukraine and the world would roll over. Instead he met a wall of strength he never imagined.

He met the Ukrainian people.

From President Zelenskyy to every Ukrainian, their fearlessness, their courage, their determination, inspires the world.

Groups of citizens blocking tanks with their bodies. Everyone from students to retirees teachers turned soldiers defending their homeland.
Source: 0-pl
Content: And we won’t stop.

We have lost so much to COVID-19. Time with one another. And worst of all, so much loss of life.

Let’s use this moment to reset. Let’s stop looking at COVID-19 as a partisan dividing line and see it for what it is: A God-awful disease.

Let’s stop seeing each other as enemies, and start seeing each other for who we really are: Fellow Americans.

We can’t change how divided we’ve been. But we can change how we move forward—on COVID-19 and other issues we must face together.

I recently visited the New York City Police Department days after the funerals of Officer Wilbert Mora and his partner, Officer Jason Rivera.

They were responding to a 9-1-1 call when a man shot and killed them with a stolen gun.

Officer Mora was 27 years old.

Officer Rivera was 22.

Both Dominican Americans who’d grown up on the same streets they later chose to patrol as police officers.

I spoke with their families and told them that we are forever in debt for their sacrifice, and we will carry on their mission to restore the trust and safety every community deserves.
Source: 24-pl
Content: And a proud Ukrainian people, who have known 30 years of independence, have repeatedly shown that they will not tolerate anyone who tries to take their country backwards.

To all Americans, I will be honest with you, as I’ve always promised. A Russian dictator, invading a foreign country, has costs around the world.

And I’m taking robust action to make sure the pain of our sanctions is targeted at Russia’s economy. And I will use every tool at our disposal to protect American businesses and consumers.

Tonight, I can announce that the United States has worked with 30 other countries to release 60 Million barrels of oil from reserves around the world.

America will lead that effort, releasing 30 Million barrels from our own Strategic Petroleum Reserve. And we stand ready to do more if necessary, unified with our allies.

These steps will help blunt gas prices here at home. And I know the news about what’s happening can seem alarming.

But I want you to know that we are going to be okay.
Source: 5-pl
Content: More support for patients and families.

To get there, I call on Congress to fund ARPA-H, the Advanced Research Projects Agency for Health.

It’s based on DARPA—the Defense Department project that led to the Internet, GPS, and so much more.

ARPA-H will have a singular purpose—to drive breakthroughs in cancer, Alzheimer’s, diabetes, and more.

A unity agenda for the nation.

We can do this.

My fellow Americans—tonight , we have gathered in a sacred space—the citadel of our democracy.

In this Capitol, generation after generation, Americans have debated great questions amid great strife, and have done great things.

We have fought for freedom, expanded liberty, defeated totalitarianism and terror.

And built the strongest, freest, and most prosperous nation the world has ever known.

Now is the hour.

Our moment of responsibility.

Our test of resolve and conscience, of history itself.

It is in this moment that our character is formed. Our purpose is found. Our future is forged.

Well I know this nation.
Source: 34-pl
==========
FINAL ANSWER: The president did not mention Michael Jackson.
SOURCES:

QUESTION: {question}
==========
{summaries}
==========
FINAL ANSWER:`;
const COMBINE_PROMPT = new langchain_1.PromptTemplate(combine_prompt_template, ["summaries", "question"]);
const OLD_EXAMPLE_PROMPT = new langchain_1.PromptTemplate("Content: {page_content}\nSource: {source}", ["page_content", "source"]);
const EXAMPLE_PROMPT = new langchain_1.PromptTemplate("{page_content}", ["page_content"]);
