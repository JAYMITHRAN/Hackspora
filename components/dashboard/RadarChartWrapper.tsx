import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface RadarData {
  skill: string
  current: number
  required: number
}

interface RadarChartWrapperProps {
  data: RadarData[]
  title?: string
  className?: string
}

export default function RadarChartWrapper({ data, title, className }: RadarChartWrapperProps) {
  return (
    <div className={className}>
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" className="text-sm" />
          <PolarRadiusAxis angle={90} domain={[0, 10]} className="text-xs" tickCount={6} />
          <Radar
            name="Your Skills"
            dataKey="current"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="Required Skills"
            dataKey="required"
            stroke="#EF4444"
            fill="#EF4444"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Your Skills</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-red-500 rounded-full"></div>
          <span>Required Skills</span>
        </div>
      </div>
    </div>
  )
}
