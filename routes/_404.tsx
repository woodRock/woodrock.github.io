// routes/_404.tsx
import { Head } from "$fresh/runtime.ts";
import SimpleMaze from "../islands/Game404.tsx";

export default function Error404Page() {
  return (
    <>
      <Head>
        <title>404 - Simple Maze</title>
        <style>
          {`
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              font-family: sans-serif;
              background-color: #000;
            }
            
            .navigation-with-search {
              display: none;
            }
          `}
        </style>
      </Head>
      <SimpleMaze />
    </>
  );
}