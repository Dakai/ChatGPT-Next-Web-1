import { useChatStore, useInputStore, SubmitKey, useAppConfig } from "../store";
import { IconButton } from "./button";
import styles from "./home.module.scss";
import SendWhiteIcon from "../icons/send-white.svg";
import Locale from "../locales";

function useSubmitHandler() {
  const config = useAppConfig();
  const submitKey = config.submitKey;

  const shouldSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return false;
    if (e.key === "Enter" && e.nativeEvent.isComposing) return false;
    return (
      (config.submitKey === SubmitKey.AltEnter && e.altKey) ||
      (config.submitKey === SubmitKey.CtrlEnter && e.ctrlKey) ||
      (config.submitKey === SubmitKey.ShiftEnter && e.shiftKey) ||
      (config.submitKey === SubmitKey.MetaEnter && e.metaKey) ||
      (config.submitKey === SubmitKey.Enter &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.metaKey)
    );
  };

  return {
    submitKey,
    shouldSubmit,
  };
}

export const InputPanel = () => {
  const { submitKey, shouldSubmit } = useSubmitHandler();
  const {
    inputArr,
    setInput,
    prevInputArr,
    isLoading,
    setIsLoading,
    setPrevInput,
  } = useInputStore();
  const { currentSessionIndex } = useChatStore();
  const chatStore = useChatStore();
  const onInput = (text: string) => {
    setInput(currentSessionIndex, text);
    const n = text.trim().length;

    // clear search results
    //if (n === 0) {
    //  setPromptHints([]);
    //} else if (!config.disablePromptHint && n < SEARCH_TEXT_LIMIT) {
    //  // check if need to trigger auto completion
    //  if (text.startsWith("/")) {
    //    let searchText = text.slice(1);
    //    onSearch(searchText);
    //  }
    //}
  };
  // submit user input
  const onUserSubmit = () => {
    if (inputArr[currentSessionIndex].length <= 0) return;
    setIsLoading(true);
    chatStore
      .onUserInput(inputArr[currentSessionIndex])
      .then(() => setIsLoading(false));
    setPrevInput(currentSessionIndex, inputArr[currentSessionIndex]);
    setInput(currentSessionIndex, "");
    //setPromptHints([]);
    //if (!isMobileScreen) inputRef.current?.focus();
    //setAutoScroll(true);
  };

  // check if should send message
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if ArrowUp and no userInput
    if (e.key === "ArrowUp" && inputArr[currentSessionIndex].length <= 0) {
      //setUserInput(beforeInput);
      setInput(currentSessionIndex, prevInputArr[currentSessionIndex]);
      e.preventDefault();
      return;
    }
    if (shouldSubmit(e)) {
      onUserSubmit();
      e.preventDefault();
    }
  };

  return (
    <div className={styles["chat-input-panel"]}>
      <div className={styles["chat-input-panel-inner"]}>
        <textarea
          // ref={inputRef}
          className={styles["chat-input"]}
          placeholder={Locale.Chat.Input(submitKey)}
          onInput={(e) => onInput(e.currentTarget.value)}
          value={inputArr[currentSessionIndex]}
          onKeyDown={onInputKeyDown}
          // onFocus={() => setAutoScroll(true)}
          // onBlur={() => {
          //   setTimeout(() => {
          //     if (document.activeElement !== inputRef.current) {
          //       setAutoScroll(false);
          //       setPromptHints([]);
          //     }
          //   }, 100);
          // }}
          // autoFocus
          // rows={inputRows}
        />
        <IconButton
          icon={<SendWhiteIcon />}
          text={Locale.Chat.Send}
          className={styles["chat-input-send"]}
          type="primary"
          onClick={onUserSubmit}
        />
      </div>
    </div>
  );
};
