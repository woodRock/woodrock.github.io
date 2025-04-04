import { JSX } from "preact";

export type Props<T extends HTMLButtonElement | HTMLAnchorElement> =
  & JSX.HTMLAttributes<T>;

export function Button<T extends HTMLButtonElement | HTMLAnchorElement>(
  props: Props<T>,
) {
  const htmlClass = "ui-btn px-2 py-1 border-gray-500 border-1 rounded bg-white hover:bg-gray-200 focus:bg-gray-200 transition-colors font-normal";

  if (props.href) {
    return (
      <a
        {...props as Props<HTMLAnchorElement>}
        class={htmlClass}
      />
    );
  }

  return (
    <button
      {...props as Props<HTMLButtonElement>}
      class={htmlClass}
    />
  );
}