// islands/SkillsCompass.tsx
import { useEffect, useRef } from "preact/hooks";
import * as d3 from "d3";

export default function SkillsCompass() {
  const svgRef = useRef<SVGSVGElement>(null);

  const data = [
    { axis: "AI / Machine Learning", value: 95 },
    { axis: "Scientific Research", value: 90 },
    { axis: "Software Engineering", value: 95 },
    { axis: "Data Science", value: 95 },
    { axis: "Analytical Chemistry", value: 70 },
    { axis: "Project Management", value: 85 },
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 400;
    const height = 400;
    const margin = 60;
    const radius = Math.min(width, height) / 2 - margin;
    const levels = 5;
    const angleSlice = (Math.PI * 2) / data.length;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Circular grid levels
    for (let j = 0; j < levels; j++) {
      const r = (radius / levels) * (j + 1);
      svg.append("circle")
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("stroke-width", 0.5)
        .attr("class", "text-slate-200 dark:text-white/10");
    }

    // Axes
    const axis = svg.selectAll(".axis")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("stroke", "currentColor")
      .attr("stroke-width", 0.5)
      .attr("class", "text-slate-200 dark:text-white/10");

    axis.append("text")
      .attr("class", "text-[10px] font-black uppercase tracking-widest fill-slate-500 dark:fill-slate-400")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => (radius + 30) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => (radius + 30) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d.axis);

    // Radar Line
    const radarLine = d3.lineRadial<any>()
      .radius(d => (d.value / 100) * radius)
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    svg.append("path")
      .datum(data)
      .attr("d", radarLine)
      .attr("fill", "rgba(99, 102, 241, 0.2)")
      .attr("stroke", "#6366f1")
      .attr("stroke-width", 2)
      .attr("class", "drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-700 hover:fill-indigo-500/40");

    // Data points
    svg.selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 4)
      .attr("cx", (d, i) => (d.value / 100) * radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => (d.value / 100) * radius * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("fill", "#6366f1")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5);

  }, []);

  return (
    <div class="bg-white/50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-md shadow-xl dark:shadow-2xl h-full flex flex-col items-center justify-center">
      <h3 class="text-white font-bold text-lg tracking-tight mb-8">Expertise Compass</h3>
      <svg ref={svgRef} class="w-full max-w-[400px] aspect-square"></svg>
    </div>
  );
}