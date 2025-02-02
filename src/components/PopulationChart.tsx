'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function PopulationChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={[
          {
            year: 1960,
            北海道: 5039206,
          },
          {
            year: 1965,
            北海道: 5171800,
          },
          {
            year: 1970,
            北海道: 5184287,
          },
          {
            year: 1975,
            北海道: 5338206,
          },
          {
            year: 1980,
            北海道: 5575989,
          },
          {
            year: 1985,
            北海道: 5679439,
          },
          {
            year: 1990,
            北海道: 5643647,
          },
          {
            year: 1995,
            北海道: 5692321,
          },
          {
            year: 2000,
            北海道: 5683062,
          },
          {
            year: 2005,
            北海道: 5627737,
          },
          {
            year: 2010,
            北海道: 5506419,
          },
          {
            year: 2015,
            北海道: 5381733,
          },
          {
            year: 2020,
            北海道: 5224614,
          },
          {
            year: 2025,
            北海道: 5016554,
          },
          {
            year: 2030,
            北海道: 4791592,
          },
          {
            year: 2035,
            北海道: 4546357,
          },
          {
            year: 2040,
            北海道: 4280427,
          },
          {
            year: 2045,
            北海道: 4004973,
          },
        ]}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="北海道" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
