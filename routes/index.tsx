// routes/index.tsx
import { Button } from "../components/Button.tsx";

export default function Home() {
  return (
    <div class="bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section with Animated Text */}
      <section class="py-12 md:py-20 px-4">
        <div class="max-w-6xl mx-auto text-center">
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
              Building the Future with Data & AI
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10">
            I combine machine learning, scientific research, and software engineering 
            to solve complex problems in marine biology and beyond.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <a href="/projects">
              <Button>Explore Projects</Button>
            </a>
            <a href="/publications">
              <Button>View Publications</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Research Focus Cards */}
      <section class="py-16 px-4 bg-white">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Research Focus</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg p-8 transform transition-transform hover:scale-105">
              <div class="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-center mb-4">AI for Marine Science</h3>
              <p class="text-gray-600 text-center">
                Developing machine learning approaches to analyze fatty acid chromatographic data and mass spectrometry for marine biomass classification.
              </p>
            </div>

            {/* Card 2 */}
            <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-lg p-8 transform transition-transform hover:scale-105">
              <div class="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-center mb-4">Data-Driven Engineering</h3>
              <p class="text-gray-600 text-center">
                Creating innovative software solutions that bridge the gap between scientific research and practical applications in industry.
              </p>
            </div>

            {/* Card 3 */}
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 transform transition-transform hover:scale-105">
              <div class="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-center mb-4">Sustainable Technology</h3>
              <p class="text-gray-600 text-center">
                Leveraging technology to support environmental sustainability and develop solutions for real-world ecological challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Publication */}
      <section class="py-16 px-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Latest Research</h2>
          
          <div class="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl">
            <div class="grid grid-cols-1 md:grid-cols-3">
              <div class="md:col-span-1 bg-gradient-to-br from-purple-600 to-indigo-700 p-8">
                <div class="h-full flex flex-col justify-center">
                  <h3 class="text-2xl font-bold mb-4">Featured Publication</h3>
                  <p class="text-white/80 mb-6">
                    Automated Fish Classification Using Machine Learning
                  </p>
                  <div class="mt-auto">
                    <a href="/publications" class="inline-flex items-center text-sm font-medium text-white hover:text-indigo-200">
                      View All Publications
                      <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div class="md:col-span-2 p-8">
                <h4 class="text-xl font-semibold mb-3">
                  Automated Fish Classification Using Unprocessed Fatty Acid Chromatographic Data: A Machine Learning Approach
                </h4>
                <p class="text-white/80 mb-6 line-clamp-4">
                  Fish is approximately 40% edible fillet. The remaining 60% can be processed into low-value fertilizer or high-value pharmaceutical-grade omega-3 concentrates. High-value manufacturing options depend on the composition of the biomass, which varies with fish species, fish tissue and seasonally throughout the year. This paper investigates different classification and feature selection algorithms for their ability to automate the processing of Gas Chromatography data.
                </p>
                <div class="flex flex-wrap gap-4">
                  <a 
                    href="/download?filename=wood2022automated.pdf"
                    class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </a>
                  <a 
                    href="https://openaccess.wgtn.ac.nz/articles/chapter/Automated_Fish_Classification_Using_Unprocessed_Fatty_Acid_Chromatographic_Data_A_Machine_Learning_Approach/22107473"
                    target="_blank" 
                    class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Access
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section class="py-16 px-4 bg-white">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-6">Featured Projects</h2>
          <p class="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16">
            A selection of my recent work in research and engineering
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project 1 */}
            <div class="bg-white rounded-xl shadow-xl overflow-hidden transform transition hover:shadow-2xl">
              <div class="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-white opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-xl font-bold">Fishy Business</h3>
                  <span class="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800">Python</span>
                </div>
                <p class="text-gray-600 mb-6">
                  An ML-powered toolkit for automated analysis of fatty acid chromatographic data to classify fish species and quality.
                </p>
                <a 
                  href="https://github.com/woodRock/fishy-business" 
                  target="_blank"
                  class="flex items-center text-indigo-600 font-medium hover:text-indigo-800"
                >
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                  View on GitHub
                </a>
              </div>
            </div>
            
            {/* Project 2 */}
            <div class="bg-white rounded-xl shadow-xl overflow-hidden transform transition hover:shadow-2xl">
              <div class="h-48 bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-white opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-xl font-bold">Portfolio Website</h3>
                  <span class="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">TypeScript</span>
                </div>
                <p class="text-gray-600 mb-6">
                  Modern portfolio website built with Deno Fresh and Tailwind CSS, featuring responsive design and dynamic content.
                </p>
                <a 
                  href="https://github.com/woodRock/portfolio" 
                  target="_blank"
                  class="flex items-center text-blue-600 font-medium hover:text-blue-800"
                >
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
          
          <div class="text-center mt-12">
            <a href="/projects">
              <Button>View All Projects</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section class="py-20 px-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Interested in Collaboration?</h2>
          <p class="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            I'm always open to discussing research opportunities, project ideas, or potential collaborations.
          </p>
          <a href="/contact">
            <button class="px-8 py-3 bg-white text-indigo-900 rounded-lg font-bold text-lg shadow-lg hover:bg-gray-100 transition-colors">
              Get in Touch
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}