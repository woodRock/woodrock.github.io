import {Button} from "../components/Button.tsx"
import DownloadButton from "../components/DownloadButton.tsx"

export default function Paper() {
    return (
        <div class="px-4 py-8 mx-auto bg-[#E1CFE8]">
            <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
                <div>
                    <h1 class="text-4xl font-bold">
                        Automated Fish Classification Using Unprocessed Fatty Acid Chromatographic Data: A Machine Learning Approach
                    </h1>
                    <p class="my-4">
                        Fish is approximately 40% edible fillet. The remaining 60% can be processed into low-value fertilizer or high-value pharmaceutical-grade omega-3 concentrates. High-value manufacturing options depend on the composition of the biomass, which varies with fish species, fish tissue and seasonally throughout the year. Fatty acid composition, measured by Gas Chromatography, is an important measure of marine biomass quality. This technique is accurate and precise, but processing and interpreting the results is time-consuming and requires domain-specific expertise. The paper investigates different classification and feature selection algorithms for their ability to automate the processing of Gas Chromatography data. Experiments found that SVM could classify compositionally diverse marine biomass based on raw chromatographic fatty acid data. The SVM model is interpretable through visualization which can highlight important features for classification. Experiments demonstrated that applying feature selection significantly reduced dimensionality and improved classification performance on high-dimensional low sample-size datasets. According to the reduction rate, feature selection could accelerate the classification system up to four times.
                    </p>
                </div>
                <DownloadButton /> 
                <a href="https://openaccess.wgtn.ac.nz/articles/chapter/Automated_Fish_Classification_Using_Unprocessed_Fatty_Acid_Chromatographic_Data_A_Machine_Learning_Approach/22107473">
                    <Button> 
                        Open Access 
                    </Button>
                </a>
            </div>
        </div>
    )
}