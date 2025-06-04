"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, AlertTriangle, Activity } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"

// Define the agent performance type
interface AgentPerformance {
  id: string
  name: string
  status: "active" | "inactive"
  metrics: {
    framesAnalyzed: number[]
    eventsGenerated: number[]
    alertsGenerated: number[]
    timestamps: string[]
  }
  totals: {
    framesAnalyzed: number
    eventsGenerated: number
    alertsGenerated: number
  }
}

// Sample data for demonstration
const sampleAgentPerformance: AgentPerformance[] = [
  {
    id: "agent-001",
    name: "Video Surveillance Agent",
    status: "active",
    metrics: {
      framesAnalyzed: generateMetricData(60, 100, 500),
      eventsGenerated: generateMetricData(60, 5, 20),
      alertsGenerated: generateMetricData(60, 0, 5),
      timestamps: generateTimestamps(60),
    },
    totals: {
      framesAnalyzed: 15782,
      eventsGenerated: 423,
      alertsGenerated: 47,
    },
  },
  {
    id: "agent-002",
    name: "Data Processing Agent",
    status: "active",
    metrics: {
      framesAnalyzed: generateMetricData(60, 50, 300),
      eventsGenerated: generateMetricData(60, 10, 30),
      alertsGenerated: generateMetricData(60, 1, 8),
      timestamps: generateTimestamps(60),
    },
    totals: {
      framesAnalyzed: 8945,
      eventsGenerated: 612,
      alertsGenerated: 89,
    },
  },
  {
    id: "agent-003",
    name: "Anomaly Detection Agent",
    status: "active",
    metrics: {
      framesAnalyzed: generateMetricData(60, 200, 600),
      eventsGenerated: generateMetricData(60, 15, 40),
      alertsGenerated: generateMetricData(60, 2, 10),
      timestamps: generateTimestamps(60),
    },
    totals: {
      framesAnalyzed: 21456,
      eventsGenerated: 876,
      alertsGenerated: 124,
    },
  },
  {
    id: "agent-004",
    name: "Security Monitoring Agent",
    status: "inactive",
    metrics: {
      framesAnalyzed: generateMetricData(60, 0, 0),
      eventsGenerated: generateMetricData(60, 0, 0),
      alertsGenerated: generateMetricData(60, 0, 0),
      timestamps: generateTimestamps(60),
    },
    totals: {
      framesAnalyzed: 0,
      eventsGenerated: 0,
      alertsGenerated: 0,
    },
  },
]

// Helper function to generate random metric data
function generateMetricData(count: number, min: number, max: number): number[] {
  return Array.from({ length: count }, () => {
    if (min === 0 && max === 0) return 0 // For inactive agents
    return Math.floor(Math.random() * (max - min + 1)) + min
  })
}

// Helper function to generate timestamps for the last hour
function generateTimestamps(count: number): string[] {
  const now = new Date()
  return Array.from({ length: count }, (_, i) => {
    const time = new Date(now.getTime() - (count - i) * 60000) // One minute intervals
    return time.toISOString()
  })
}

export function AgentPerformanceView() {
  const agents = useMemo(() => sampleAgentPerformance, [])
  const { t } = useI18n()

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // Render a mini bar chart with timestamps
  const renderBarChart = (data: number[], timestamps: string[], height = 40) => {
    if (data.every((val) => val === 0)) {
      return <div className="h-[40px] bg-gray-100 rounded-sm"></div>
    }

    // Take the last 15 data points for the bar chart
    const recentData = data.slice(-15)
    const recentTimestamps = timestamps.slice(-15)
    const max = Math.max(...recentData)

    // Get timestamps for x-axis (show 5 points)
    const timeLabels = []
    const step = Math.floor(recentTimestamps.length / 4)
    for (let i = 0; i < recentTimestamps.length; i += step) {
      if (timeLabels.length < 5) {
        const date = new Date(recentTimestamps[i])
        timeLabels.push({
          position: (i / (recentTimestamps.length - 1)) * 100,
          label: `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`,
        })
      }
    }

    return (
      <div className="h-[40px] w-full relative">
        <div className="h-full w-full flex items-end gap-[2px]">
          {recentData.map((value, index) => {
            const heightPercent = max > 0 ? (value / max) * 100 : 0
            return (
              <div
                key={index}
                className="flex-1 bg-primary/80 rounded-sm"
                style={{ height: `${heightPercent}%` }}
              ></div>
            )
          })}
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-gray-500">
          {timeLabels.map((label, i) => (
            <div key={i} style={{ position: "absolute", left: `${label.position}%`, transform: "translateX(-50%)" }}>
              {label.label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 overflow-auto h-full pr-2">
      {agents.map((agent) => (
        <Card key={agent.id} className={`${agent.status === "inactive" ? "opacity-60" : ""} shadow-sm`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{agent.name}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{agent.id}</p>
              </div>
              <Badge variant="outline" className={`${getStatusBadgeColor(agent.status)} border-0`}>
                {agent.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {/* Frames Analyzed */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Video className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm font-medium">{t("performance.framesAnalyzed")}</span>
                </div>
                <span className="text-sm font-bold">{formatNumber(agent.totals.framesAnalyzed)}</span>
              </div>
              {renderBarChart(agent.metrics.framesAnalyzed, agent.metrics.timestamps)}
            </div>

            {/* Events Generated */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm font-medium">{t("performance.eventsGenerated")}</span>
                </div>
                <span className="text-sm font-bold">{formatNumber(agent.totals.eventsGenerated)}</span>
              </div>
              {renderBarChart(agent.metrics.eventsGenerated, agent.metrics.timestamps)}
            </div>

            {/* Alerts Generated */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm font-medium">{t("performance.alertsGenerated")}</span>
                </div>
                <span className="text-sm font-bold">{formatNumber(agent.totals.alertsGenerated)}</span>
              </div>
              {renderBarChart(agent.metrics.alertsGenerated, agent.metrics.timestamps)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
