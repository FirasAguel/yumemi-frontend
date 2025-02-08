export interface Prefecture {
  prefCode: number;
  prefName: string;
}

// Raw API Population Data
export interface PopulationDataEntry {
  year: number;
  value: number;
  rate?: number; // Optional: Only present in some population types
}

// For Recharts: Reshaped Data to Fit Graph Requirements
export interface YearlyPopulationData {
  year: number;
  [prefecture: string]: number;
}

export interface ChartPopulationData {
  boundaryYear: number;
  populationData: YearlyPopulationData[];
}

// Props for PopulationChart Component
export interface PopulationChartProps {
  populationData: YearlyPopulationData[];
  boundaryYears: { [key: string]: number };
}

export interface FullPopulationData {
  boundaryYear: number;
  populationData: {
    label: string;
    data: PopulationDataEntry[];
  }[];
}
