// routes/contact.tsx
import { Button } from "../components/Button.tsx";
import { FreshContext } from "$fresh/server.ts";
import { useState } from "preact/hooks";

export default function Contact() {
  return (
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-5xl font-bold text-center mb-6 text-gray-800">
          Get In Touch
        </h1>
        <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          I'm always open to discussing new projects, research opportunities, or
          potential collaborations. Feel free to reach out!
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div class="col-span-1">
            <div class="bg-white rounded-xl shadow-md p-6 h-full">
              <h2 class="text-xl font-semibold mb-4 text-gray-800">
                Connect With Me
              </h2>

              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-md font-medium text-gray-900">Email</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      <a
                        href="mailto:jrhwood98@gmail.com"
                        class="text-indigo-600 hover:text-indigo-800"
                      >
                        jrhwood98@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-md font-medium text-gray-900">LinkedIn</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      <a
                        href="https://www.linkedin.com/in/jrhwood"
                        target="_blank"
                        class="text-indigo-600 hover:text-indigo-800"
                      >
                        linkedin.com/in/jrhwood
                      </a>
                    </p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-md font-medium text-gray-900">GitHub</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      <a
                        href="https://github.com/woodrock"
                        target="_blank"
                        class="text-indigo-600 hover:text-indigo-800"
                      >
                        github.com/woodrock
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div class="col-span-1 md:col-span-2">
            <div class="bg-white rounded-xl shadow-md p-6">
              <h2 class="text-xl font-semibold mb-4 text-gray-800">
                Send Me a Message
              </h2>

              <form class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="name"
                      class="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    for="subject"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label
                    for="message"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <div class="pt-2">
                  <button
                    type="submit"
                    class="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Location/Map Section */}
        <div class="mt-12 bg-white rounded-xl shadow-md p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 class="text-xl font-semibold mb-4 text-gray-800">
                My Location
              </h2>
              <p class="text-gray-600 mb-4">
                Currently based in Wellington, New Zealand
              </p>
              <p class="text-gray-600">
                I'm open to remote collaboration and opportunities worldwide.
              </p>
            </div>
            <div class="rounded-lg overflow-hidden h-[300px] shadow-inner">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                // marginHeight="0"
                // marginWidth="0"
                src="https://www.openstreetmap.org/export/embed.html?bbox=174.7655%2C-41.2966%2C174.7856%2C-41.2766&amp;layer=mapnik&amp;marker=-41.28664%2C174.77557"
                style="border: none"
                title="Wellington, New Zealand Map"
              ></iframe>
              <div class="text-right text-xs mt-1">
                <a
                  href="https://www.openstreetmap.org/?mlat=-41.28664&amp;mlon=174.77557#map=15/-41.28664/174.77557"
                  target="_blank"
                  class="text-indigo-600 hover:text-indigo-800"
                >
                  View larger map
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Optional server-side handler for form submission
export const handler = {
  async POST(req: Request, ctx: FreshContext) {
    // This would handle the form submission
    // For now, just return a success response
    const formData = await req.formData();

    // Here you would process the form data, e.g. send an email
    console.log("Contact form submission:", Object.fromEntries(formData));

    // Redirect back to the contact page with a success message
    const url = new URL(req.url);
    url.searchParams.set("success", "true");
    return Response.redirect(url.toString(), 303);
  },
};
