import { BaseCallbackHandler } from './base.js';
import { AgentAction, AgentFinish, LLMResult } from '../schema';
import { ChatResponse } from '../schemas';

export class StreamingLLMCallbackHandler extends BaseCallbackHandler {
  chain_starts: number = 0;
  chain_ends: number = 0;
  llm_starts: number = 0;
  llm_ends: number = 0;
  llm_streams: number = 0;
  tool_starts: number = 0;
  tool_ends: number = 0;
  agent_ends: number = 0;
  starts: number = 0;
  ends: number = 0;
  errors: number = 0;

  constructor(private websocket: any) {
    super();
  }

  async on_llm_new_token(token: string, kwargs: any): Promise<void> {
    const resp: ChatResponse = {
      sender: 'bot',
      message: token,
      type: 'stream'
    };
    await this.websocket.send_json(resp);
  }

  on_llm_start(serialized: any, prompts: string[], kwargs: any): void {
    this.llm_starts += 1;
    this.starts += 1;
  }

  on_llm_end(response: LLMResult, kwargs: any): void {
    this.llm_ends += 1;
    this.ends += 1;
  }

  on_llm_error(error: Exception | KeyboardInterrupt, kwargs: any): void {
    this.errors += 1;
  }

  on_chain_start(serialized: any, inputs: any, kwargs: any): void {
    this.chain_starts += 1;
    this.starts += 1;
  }

  on_chain_end(outputs: any, kwargs: any): void {
    this.chain_ends += 1;
    this.ends += 1;
  }

  on_chain_error(error: Exception | KeyboardInterrupt, kwargs: any): void {
    this.errors += 1;
  }

  on_tool_start(serialized: any, input_str: string, kwargs: any): void {
    this.tool_starts += 1;
    this.starts += 1;
  }

  on_tool_end(output: string, kwargs: any): void {
    this.tool_ends += 1;
    this.ends += 1;
  }

  on_tool_error(error: Exception | KeyboardInterrupt, kwargs: any): void {
    this.errors += 1;
  }

  on_text(text: string, kwargs: any): void {
    this.text += 1;
  }

  on_agent_finish(finish: AgentFinish, kwargs: any): void {
    this.agent_ends += 1;
    this.ends += 1;
  }

  on_agent_action(action: AgentAction, kwargs: any): any {
    this.tool_starts += 1;
    this.starts += 1;
  }
}

export class FollowupQuestionGenCallbackHandler extends BaseCallbackHandler {
  chain_starts: number = 0;
  chain_ends: number = 0;
  llm_starts: number = 0;
  llm_ends: number = 0;
  llm_streams: number = 0;
  tool_starts: number = 0;
  tool_ends: number = 0;
  agent_ends: number = 0;
  starts: number = 0;
  ends: number = 0;
  errors: number = 0;

  constructor(private websocket: any) {
    super();
  }

  async on_llm_new_token(token: string, kwargs: any): Promise<void> {
    const resp: ChatResponse = {
      sender: 'bot',
      message: token,
      type: 'stream_followup'
    };
    console.log(token);
    await this.websocket.send_json(resp);
  }

  on_llm_start(serialized: any, prompts: string[], kwargs: any): void {
    this.llm_starts += 1;
    this.starts += 1;
  }

  on_llm_end(response: LLMResult, kwargs: any): void {
    this.llm_ends += 1;
    this.ends += 1;
  }

  on_llm_error(error: Exception | KeyboardInterrupt, kwargs: any): void {
    this.errors += 1;
  }

  on_chain_start(serialized: any, inputs: any, kwargs: any): void {
    this.chain_starts += 1;
    this.starts += 1;
  }

  on_chain_end(outputs: any, kwargs: any): void {
    this.chain_ends += 1;
    this.ends += 1;
  }

  on_chain_error(error: Exception | KeyboardInterrupt, kwargs: any): void {
    this.errors += 1;
  }

  on_tool_start(serialized: any, input_str: string, kwargs: any): void {
    this.tool_starts += 1;
    this.starts += 1;
  }

  on_tool_end(output: string, kwargs: any): void {
    this.tool_ends += 1;
    this.ends += 1;
  }

  on_tool_error(error: Exception | KeyboardInterrupt, kwargs: any): void {
    this.errors += 1;
  }

  on_text(text: string, kwargs: any): void {
    this.text += 1;
  }

  on_agent_finish(finish: AgentFinish, kwargs: any): void {
    this.agent_ends += 1;
    this.ends += 1;
  }

  on_agent_action(action: AgentAction, kwargs: any): any {
    this.tool_starts += 1;
    this.starts += 1;
  }
}