import {forwardRef} from "@nextui-org/system";
import {Tooltip} from "@nextui-org/tooltip";
import {ReactNode, useCallback, useMemo} from "react";

import {useSnippet, UseSnippetProps} from "./use-snippet";
import {SnippetCopyIcon} from "./snippet-copy-icon";
import {SnippetCheckIcon} from "./snippet-check-icon";

export interface SnippetProps extends Omit<UseSnippetProps, "ref"> {}

const Snippet = forwardRef<SnippetProps, "div">((props, ref) => {
  const {
    Component,
    domRef,
    children,
    slots,
    classNames,
    copied,
    copyIcon = <SnippetCopyIcon />,
    checkIcon = <SnippetCheckIcon />,
    symbolBefore,
    disableCopy,
    disableTooltip,
    hideSymbol,
    hideCopyButton,
    tooltipProps,
    isMultiLine,
    onCopy,
    getSnippetProps,
    getCopyButtonProps,
  } = useSnippet({ref, ...props});

  const TooltipContent = useCallback(
    ({children}: {children?: ReactNode}) => <Tooltip {...tooltipProps}>{children}</Tooltip>,
    [...Object.values(tooltipProps)],
  );

  const contents = useMemo(() => {
    if (hideCopyButton) {
      return null;
    }

    const copyButton = <button {...getCopyButtonProps()}>{copied ? checkIcon : copyIcon}</button>;

    if (disableTooltip) {
      return copyButton;
    }

    return <TooltipContent>{copyButton}</TooltipContent>;
  }, [
    slots,
    classNames?.copy,
    copied,
    checkIcon,
    copyIcon,
    onCopy,
    TooltipContent,
    disableCopy,
    disableTooltip,
    hideCopyButton,
  ]);

  const preContent = useMemo(() => {
    if (isMultiLine && children && Array.isArray(children)) {
      return (
        <div className="flex flex-col">
          {children.map((t, index) => (
            <pre key={`${index}-${t}`} className={slots.pre({class: classNames?.pre})}>
              {!hideSymbol && <span className="select-none">{symbolBefore}</span>}
              {t}
            </pre>
          ))}
        </div>
      );
    }

    return (
      <pre className={slots.pre({class: classNames?.pre})}>
        {!hideSymbol && <span className="select-none">{symbolBefore}</span>}
        {children}
      </pre>
    );
  }, [children, hideSymbol, isMultiLine, symbolBefore, classNames?.pre, slots]);

  return (
    <Component ref={domRef} {...getSnippetProps()}>
      {preContent}
      {contents}
    </Component>
  );
});

Snippet.displayName = "NextUI.Snippet";

export default Snippet;
