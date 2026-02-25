import { JSX } from "preact";

export type Props<T extends HTMLButtonElement | HTMLAnchorElement> =
  & JSX.HTMLAttributes<T>;

export function Button<T extends HTMLButtonElement | HTMLAnchorElement>(
  props: Props<T>,
) {
  const htmlClass = "inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-zinc-900 border border-white/10 text-white text-sm font-bold transition-all duration-300 hover:bg-zinc-800 hover:border-white/20 active:scale-95 shadow-lg hover:shadow-indigo-500/10";

  if (props.href) {
    return (
      <a
        {...props as Props<HTMLAnchorElement>}
        class={`${htmlClass} ${props.class || ""}`}
      />
    );
  }

  return (
    <button
      {...props as Props<HTMLButtonElement>}
      class={`${htmlClass} ${props.class || ""}`}
    />
  );
}