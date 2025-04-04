import ProjectCard from "../components/ProjectCard.tsx";

export default function Projects() {
  return (
    <div class="p-4">
        <h1 class="text-4xl font-bold text-center my-8">My Projects</h1>

        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProjectCard
                title="Portfolio Website"
                language="TypeScript, Deno"
                githubLink="https://github.com/woodRock/woodrock.github.io"
                description="Personal portfolio website built with Deno Fresh and Tailwind CSS. Features responsive design and dynamic content loading."
            />

            <ProjectCard
                title="Fishy Business"
                language="Python, Pytorch, LaTeX"
                githubLink="https://github.com/woodRock/fishy-business"
                description="PhD Candidate in Artificial Intelligence. Applying machine learning to fish oil analysis."
                backgroundColor="#CFE1E8"
            />

            <ProjectCard
                title="Ionic Scholar"
                language="Ionic, Typescript"
                githubLink="https://github.com/woodRock/ionic-scholar"
                description="This individually developed app keeps track of academic references. The app remembers the users progress, keywords, quotes. Also it can generate citations."
                backgroundColor="#CFE1E8"
            />      

            <ProjectCard
                title="Expert Chainsaw"
                language="Node, Github Actions"
                githubLink="https://github.com/woodRock/expert-chainsaw"
                description="This GitHub Action used the Open Weather API to display the weather forecast for a given area. It is updated once every 30 minutes. The weather forecast is displayed within predefined tags (hidden inside HTML comments), such that it does not overwrite any other existing content in a README."
                backgroundColor="#CFE1E8"
            />

            <ProjectCard 
                title="Scaling Palm Tree"
                language="Rust"
                githubLink="https://github.com/woodRock/scaling-palm-tree"
                description="A command-line interface (CLI) for bus timetables in Wellington, New Zealand."
                backgroundColor="#CFE1E8"
            />

            <ProjectCard
                title="Wordle Solver Transformer"
                language="Python, Pytorch"
                githubLink="https://github.com/woodRock/wordle"
                description="Wordle solver with a transformer deep learning neural network."
                backgroundColor="#CFE1E8"
            />

            <ProjectCard
                title="Autograd"
                language="C++, Cuda"
                githubLink="https://github.com/woodRock/autograd"
                description="Deep learning library written in c++ for a basic autograd."
                backgroundColor="#CFE1E8"
            />
        </div>
    </div>
  );
}