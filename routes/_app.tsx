import { type PageProps } from "$fresh/server.ts";
import Navigation from "../components/Navigation.tsx";
import Footer from "../components/Footer.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>woodrock.deno.dev</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div class="px-4 py-8 mx-auto bg-[#925EA6]">
          <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
            <img
              class="my-6"
              src="/favicon.png"
              width="128"
              height="128"
              alt="the woodRock logo: the words <wR> with a nebula in the background."
            />
            <h1 class="text-4xl font-bold">Welcome to woodrock.deno.dev</h1>
            <p class="my-4">
              Jesse Wood | Researcher | Engineer
            </p>
          </div>
        </div>
        <Navigation /> 
        <Component />
        <Footer />
      </body>
    </html>
  );
}
