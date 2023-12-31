"""Callback handlers used in the app."""
from typing import Any, Dict, List

from langchain.callbacks.base import BaseCallbackHandler
from langchain.schema import AgentAction, AgentFinish, LLMResult
from typing import Any, Dict, List, Union

from schemas import ChatResponse


class StreamingLLMCallbackHandler(BaseCallbackHandler):
    """Callback handler for streaming LLM responses."""
    chain_starts: int = 0
    chain_ends: int = 0
    llm_starts: int = 0
    llm_ends: int = 0
    llm_streams: int = 0
    tool_starts: int = 0
    tool_ends: int = 0
    agent_ends: int = 0
    starts: int = 0
    ends: int = 0
    errors: int = 0

    def __init__(self, websocket):
        self.websocket = websocket

    async def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        resp = ChatResponse(sender="bot", message=token, type="stream")
        await self.websocket.send_json(resp.dict())

    def on_llm_start(
        self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> None:
        """Run when LLM starts running."""
        self.llm_starts += 1
        self.starts += 1

    def on_llm_end(self, response: LLMResult, **kwargs: Any) -> None:
        """Run when LLM ends running."""
        self.llm_ends += 1
        self.ends += 1

    def on_llm_error(
        self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any
    ) -> None:
        """Run when LLM errors."""
        self.errors += 1

    def on_chain_start(
        self, serialized: Dict[str, Any], inputs: Dict[str, Any], **kwargs: Any
    ) -> None:
        """Run when chain starts running."""
        self.chain_starts += 1
        self.starts += 1

    def on_chain_end(self, outputs: Dict[str, Any], **kwargs: Any) -> None:
        """Run when chain ends running."""
        self.chain_ends += 1
        self.ends += 1

    def on_chain_error(
        self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any
    ) -> None:
        """Run when chain errors."""
        self.errors += 1

    def on_tool_start(
        self, serialized: Dict[str, Any], input_str: str, **kwargs: Any
    ) -> None:
        """Run when tool starts running."""
        self.tool_starts += 1
        self.starts += 1

    def on_tool_end(self, output: str, **kwargs: Any) -> None:
        """Run when tool ends running."""
        self.tool_ends += 1
        self.ends += 1

    def on_tool_error(
        self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any
    ) -> None:
        """Run when tool errors."""
        self.errors += 1

    def on_text(self, text: str, **kwargs: Any) -> None:
        """Run when agent is ending."""
        self.text += 1

    def on_agent_finish(self, finish: AgentFinish, **kwargs: Any) -> None:
        """Run when agent ends running."""
        self.agent_ends += 1
        self.ends += 1

    def on_agent_action(self, action: AgentAction, **kwargs: Any) -> Any:
        """Run on agent action."""
        self.tool_starts += 1
        self.starts += 1


class FollowupQuestionGenCallbackHandler(BaseCallbackHandler):
    """Callback handler for question generation."""
    chain_starts: int = 0
    chain_ends: int = 0
    llm_starts: int = 0
    llm_ends: int = 0
    llm_streams: int = 0
    tool_starts: int = 0
    tool_ends: int = 0
    agent_ends: int = 0
    starts: int = 0
    ends: int = 0
    errors: int = 0

    def __init__(self, websocket):
        self.websocket = websocket

    async def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        resp = ChatResponse(sender="bot", message=token, type="stream_followup")
        print(token)
        await self.websocket.send_json(resp.dict())

    def on_llm_start(
        self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> None:
        """Run when LLM starts running."""
        self.llm_starts += 1
        self.starts += 1

    def on_llm_end(self, response: LLMResult, **kwargs: Any) -> None:
        """Run when LLM ends running."""
        self.llm_ends += 1
        self.ends += 1

    def on_llm_error(
        self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any
    ) -> None:
        """Run when LLM errors."""
        self.errors += 1

    def on_chain_start(
        self, serialized: Dict[str, Any], inputs: Dict[str, Any], **kwargs: Any
    ) -> None:
        """Run when chain starts running."""
        self.chain_starts += 1
        self.starts += 1

    def on_chain_end(self, outputs: Dict[str, Any], **kwargs: Any) -> None:
        """Run when chain ends running."""
        self.chain_ends += 1
        self.ends += 1

    def on_chain_error(
        self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any
    ) -> None:
        """Run when chain errors."""
        self.errors += 1

    def on_tool_start(
        self, serialized: Dict[str, Any], input_str: str, **kwargs: Any
    ) -> None:
        """Run when tool starts running."""
        self.tool_starts += 1
        self.starts += 1

    def on_tool_end(self, output: str, **kwargs: Any) -> None:
        """Run when tool ends running."""
        self.tool_ends += 1
        self.ends += 1

    def on_tool_error(
        self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any
    ) -> None:
        """Run when tool errors."""
        self.errors += 1

    def on_text(self, text: str, **kwargs: Any) -> None:
        """Run when agent is ending."""
        self.text += 1

    def on_agent_finish(self, finish: AgentFinish, **kwargs: Any) -> None:
        """Run when agent ends running."""
        self.agent_ends += 1
        self.ends += 1

    def on_agent_action(self, action: AgentAction, **kwargs: Any) -> Any:
        """Run on agent action."""
        self.tool_starts += 1
        self.starts += 1


