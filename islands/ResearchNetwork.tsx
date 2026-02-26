// islands/ResearchNetwork.tsx
import { useEffect, useRef, useState } from "preact/hooks";
import * as d3 from "d3";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  type: "root" | "reference" | "citation";
  year?: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  type: "references" | "citedBy";
}

export default function ResearchNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/research-network");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch research network:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const width = 800;
    const height = 500;
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    svg.selectAll("*").remove(); // Clear previous render

    // Define gradients and filters
    const defs = svg.append("defs");
    
    // Node glow
    const filter = defs.append("filter")
      .attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "2.5")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const simulation = d3.forceSimulation<Node>(data.nodes)
      .force("link", d3.forceLink<Node, Link>(data.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    const link = svg.append("g")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", d => d.type === "citedBy" ? "4 4" : "0")
      .attr("class", "text-slate-300 dark:text-slate-800");

    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => setSelectedNode(d))
      .on("mouseover", function() {
        d3.select(this).select("circle").transition().attr("r", 12).style("filter", "url(#glow)");
      })
      .on("mouseout", function() {
        d3.select(this).select("circle").transition().attr("r", d => (d as any).type === "root" ? 10 : 6).style("filter", null);
      });

    node.append("circle")
      .attr("r", d => d.type === "root" ? 10 : 6)
      .attr("fill", d => {
        if (d.type === "root") return "#6366f1";
        if (d.type === "reference") return "#94a3b8";
        return "#818cf8";
      })
      .attr("stroke", "currentColor")
      .attr("stroke-width", 1.5)
      .attr("class", "text-white dark:text-zinc-950");

    node.append("text")
      .attr("dx", 14)
      .attr("dy", ".35em")
      .text(d => d.title.length > 30 ? d.title.substring(0, 30) + "..." : d.title)
      .attr("fill", "currentColor")
      .attr("class", "text-slate-900 dark:text-slate-400 font-semibold")
      .style("font-size", "10px")
      .style("font-family", "Inter")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [data]);

  return (
    <div class="relative w-full bg-white/50 dark:bg-zinc-900/40 rounded-[2.5rem] border border-black/5 dark:border-white/5 overflow-hidden backdrop-blur-sm shadow-xl dark:shadow-2xl transition-colors duration-300">
      <div class="absolute top-8 left-8 z-10">
        <h3 class="text-white font-bold text-lg tracking-tight mb-1">Research Knowledge Graph</h3>
        <p class="text-slate-500 text-xs uppercase tracking-widest font-black">Live Data: Semantic Scholar API</p>
      </div>

      {loading && (
        <div class="absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-zinc-950/20 z-20">
          <div class="flex flex-col items-center">
            <div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Mapping citations...</p>
          </div>
        </div>
      )}

      <svg ref={svgRef} class="w-full h-[500px] cursor-grab active:cursor-grabbing"></svg>

      {/* Detail Panel */}
      {selectedNode && (
        <div class="absolute bottom-8 right-8 left-8 lg:left-auto lg:w-80 bg-white/90 dark:bg-zinc-900/90 border border-black/10 dark:border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-2xl animate-fade-in animate-slide-up">
          <button 
            onClick={() => setSelectedNode(null)}
            class="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span class={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${
            selectedNode.type === 'root' ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
          }`}>
            {selectedNode.type}
          </span>
          <h4 class="text-white font-bold text-sm leading-snug mb-2">{selectedNode.title}</h4>
          {selectedNode.year && <p class="text-slate-200 dark:text-slate-500 text-xs mb-1 font-medium">Published: {selectedNode.year}</p>}
          <a 
            href={`https://www.semanticscholar.org/paper/${selectedNode.id}`}
            target="_blank"
            class="mt-4 inline-flex items-center text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
          >
            View on Semantic Scholar
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}

      {/* Legend */}
      <div class="absolute bottom-8 left-8 hidden md:flex items-center gap-6">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">My Paper</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-slate-400"></div>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Reference</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-indigo-400"></div>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Citation</span>
        </div>
      </div>
    </div>
  );
}