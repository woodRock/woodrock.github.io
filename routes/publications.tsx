// routes/publications.tsx
import PaperCard from "../components/PaperCard.tsx";

export default function Publications() {
  const papers = [
    {
        title: "PREPRINT: Hook, Line and Spectra: Machine Learning for Fish Species and Part Classification using Rapid Evaporative Ionization Mass Spectrometry",
        abstract: "Marine biomass composition analysis traditionally requires time-consuming processes and domain expertise. This study demonstrates the effectiveness of Rapid Evaporative ionization Mass Spectrometry (REIMS) combined with advanced machine learning techniques for accurate marine biomass composition determination. Using fish species and body parts as model systems representing diverse biochemical profiles, we investigate various machine learning methods, including unsupervised pre-training strategies for transformers. The deep learning approaches consistently outperformed traditional machine learning across all tasks. We further explored the explainability of the best-performing and mostly black-box models using Local Interpretable Model-agnostic Explanations to find important features driving decisions behind each of the top-performing classifiers. REIMS analysis with machine learning can be accurate and potentially explainable technique for automated marine biomass compositional analysis. It has potential applications in marine-based industry quality control, product optimization, and food safety monitoring.",
        filename: "wood2025hook.pdf",
        link: "https://www.youtube.com/watch?v=c7jvWOfwc1M",
        linkLabel: "TBD",
        year: 2025,
        journal: "TBD",
        backgroundColor: "#E1CFE8"
    },
    {
      title: "Automated Fish Classification Using Unprocessed Fatty Acid Chromatographic Data: A Machine Learning Approach",
      abstract: "Fish is approximately 40% edible fillet. The remaining 60% can be processed into low-value fertilizer or high-value pharmaceutical-grade omega-3 concentrates. High-value manufacturing options depend on the composition of the biomass, which varies with fish species, fish tissue and seasonally throughout the year. Fatty acid composition, measured by Gas Chromatography, is an important measure of marine biomass quality. This technique is accurate and precise, but processing and interpreting the results is time-consuming and requires domain-specific expertise. The paper investigates different classification and feature selection algorithms for their ability to automate the processing of Gas Chromatography data. Experiments found that SVM could classify compositionally diverse marine biomass based on raw chromatographic fatty acid data. The SVM model is interpretable through visualization which can highlight important features for classification. Experiments demonstrated that applying feature selection significantly reduced dimensionality and improved classification performance on high-dimensional low sample-size datasets. According to the reduction rate, feature selection could accelerate the classification system up to four times.",
      filename: "wood2022automated.pdf",
      link: "https://openaccess.wgtn.ac.nz/articles/chapter/Automated_Fish_Classification_Using_Unprocessed_Fatty_Acid_Chromatographic_Data_A_Machine_Learning_Approach/22107473",
      linkLabel: "Open Access",
      year: 2022,
      journal: "Journal of Machine Learning for Biomedical Imaging",
      backgroundColor: "#E1CFE8"
    },
    {
      title: "Rapid determination of bulk composition and quality of marine biomass in Mass Spectrometry",
      abstract: "Navigating the analysis of mass spectrometry data for marine biomass and fish demands a technologically adept approach to derive accurate and actionable insights. This research will introduce a novel AI methodology to interpret a substantial repository of mass spectrometry datasets, utilizing pre-training strategies like Next Spectra Prediction and Masked Spectra Modeling, targeting enhanced interpretability and correlation of spectral patterns with chemical attributes. Three core research objectives are explored: 1) precise fish species and body part identification via binary and multi-class classification, respectively; 2) quantitative contaminant analysis employing multi-label classification and multi-output regression; and 3) traceability through pair-wise comparison and instance recognition. By validating against traditional baselines and various downstream tasks, this work aims to enhance chemical analytical processes and offer fresh insights into the chemical and traceability aspects of marine biology and fisheries through advanced AI applications.",
      filename: "wood2022rapid.pdf",
      link: "https://github.com/woodRock/fishy-business/blob/main/proposal/proposal.pdf",
      linkLabel: "View Publication",
      year: 2022,
      journal: "Environmental Biotechnology",
      backgroundColor: "#D1E8CF"
    }
  ];

  return (
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-5xl font-bold text-center mb-12 text-gray-800">Publications</h1>
        
        <div class="space-y-10">
          {papers.map((paper, index) => (
            <PaperCard
              key={index}
              title={paper.title}
              abstract={paper.abstract}
              filename={paper.filename}
              link={paper.link}
              linkLabel={paper.linkLabel}
              backgroundColor={paper.backgroundColor}
              year={paper.year}
              journal={paper.journal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}