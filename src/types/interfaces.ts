// Raw API Population Data
export interface PopulationDataEntry {
  year: number;
  value: number;
  rate?: number; // Optional: Only present in some population types
}

export interface PopulationType {
  label: '総人口' | '年少人口' | '生産年齢人口' | '老年人口';
  data: PopulationDataEntry[];
}

export interface PopulationResponse {
  message: string | null;
  result: {
    boundaryYear: number;
    data: PopulationType[];
  };
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
  boundaryYear: number;
}
