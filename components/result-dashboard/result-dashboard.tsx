"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/lib/i18n/i18n-context"

interface AgentMetric {
  name: string
  value: string | number
  color: string
}

interface Agent {
  id: string
  name: string
  status: "active" | "inactive" | "error"
  dashboards: string[]
  selectedDashboard: string
  metrics: AgentMetric[]
  isLoading: boolean
}

// Simulate API call to fetch agent metrics
const fetchAgentMetrics = async (agentId: string, dashboard: string): Promise<AgentMetric[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400))

  // Different metrics based on agent type
  const metricSets = {
    "security-camera": [
      { name: "People Detected", value: Math.floor(Math.random() * 50) + 10, color: "text-blue-600" },
      { name: "Avg Stay Duration", value: `${Math.floor(Math.random() * 30) + 5}min`, color: "text-green-600" },
      { name: "Suspicious Activities", value: Math.floor(Math.random() * 5), color: "text-red-600" },
      { name: "Crowd Density", value: `${Math.floor(Math.random() * 40) + 20}%`, color: "text-purple-600" },
      { name: "Face Recognition Rate", value: `${Math.floor(Math.random() * 20) + 80}%`, color: "text-orange-600" },
      { name: "Last Alert", value: `${Math.floor(Math.random() * 60)}min ago`, color: "text-gray-600" },
    ],
    "traffic-monitor": [
      { name: "Vehicle Count", value: Math.floor(Math.random() * 200) + 50, color: "text-blue-600" },
      { name: "Max Car Speed", value: `${Math.floor(Math.random() * 40) + 60}km/h`, color: "text-green-600" },
      { name: "Traffic Violations", value: Math.floor(Math.random() * 10), color: "text-red-600" },
      { name: "Avg Car Speed", value: `${Math.floor(Math.random() * 20) + 40}km/h`, color: "text-purple-600" },
      { name: "Congestion Level", value: `${Math.floor(Math.random() * 60) + 20}%`, color: "text-orange-600" },
      { name: "Peak Traffic Time", value: `${Math.floor(Math.random() * 12) + 7}:00`, color: "text-gray-600" },
    ],
    "warehouse-analytics": [
      { name: "Workers Present", value: Math.floor(Math.random() * 20) + 5, color: "text-blue-600" },
      { name: "Safety Violations", value: Math.floor(Math.random() * 3), color: "text-green-600" },
      { name: "Equipment Usage", value: `${Math.floor(Math.random() * 40) + 60}%`, color: "text-red-600" },
      { name: "Inventory Movements", value: Math.floor(Math.random() * 50) + 20, color: "text-purple-600" },
      { name: "Avg Task Duration", value: `${Math.floor(Math.random() * 30) + 15}min`, color: "text-orange-600" },
      { name: "Efficiency Score", value: `${Math.floor(Math.random() * 20) + 80}%`, color: "text-gray-600" },
    ],
  }

  return metricSets[agentId as keyof typeof metricSets] || metricSets["security-camera"]
}

export function ResultDashboard() {
  const { t } = useTranslation()

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "security-camera",
      name: "Security Camera Agent",
      status: "active",
      dashboards: ["Default", "Detailed", "Security Focus", "Performance"],
      selectedDashboard: "Default",
      metrics: [],
      isLoading: true,
    },
    {
      id: "traffic-monitor",
      name: "Traffic Monitor Agent",
      status: "active",
      dashboards: ["Default", "Traffic Flow", "Violations", "Speed Analysis"],
      selectedDashboard: "Default",
      metrics: [],
      isLoading: true,
    },
    {
      id: "warehouse-analytics",
      name: "Warehouse Analytics Agent",
      status: "inactive",
      dashboards: ["Default", "Safety", "Productivity", "Inventory"],
      selectedDashboard: "Default",
      metrics: [],
      isLoading: true,
    },
  ])

  // Load initial metrics for all agents
  useEffect(() => {
    agents.forEach((agent) => {
      loadMetrics(agent.id, agent.selectedDashboard)
    })
  }, [])

  const loadMetrics = async (agentId: string, dashboard: string) => {
    setAgents((prev) => prev.map((agent) => (agent.id === agentId ? { ...agent, isLoading: true } : agent)))

    try {
      const metrics = await fetchAgentMetrics(agentId, dashboard)
      setAgents((prev) => prev.map((agent) => (agent.id === agentId ? { ...agent, metrics, isLoading: false } : agent)))
    } catch (error) {
      console.error("Failed to load metrics:", error)
      setAgents((prev) => prev.map((agent) => (agent.id === agentId ? { ...agent, isLoading: false } : agent)))
    }
  }

  const handleDashboardChange = (agentId: string, dashboard: string) => {
    setAgents((prev) =>
      prev.map((agent) => (agent.id === agentId ? { ...agent, selectedDashboard: dashboard } : agent)),
    )
    loadMetrics(agentId, dashboard)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return t("resultDashboard.active")
      case "inactive":
        return t("resultDashboard.inactive")
      case "error":
        return t("resultDashboard.error")
      default:
        return status
    }
  }

  const generateTimestamp = () => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const seconds = now.getSeconds().toString().padStart(2, "0")
    return `${hours}${minutes}${seconds}`
  }

  return (
    <div className="space-y-6">
      {agents.map((agent) => (
        <Card key={agent.id} className="w-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-medium">{agent.name}</h3>
                <Badge variant={getStatusBadgeVariant(agent.status)}>{getStatusText(agent.status)}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">{t("resultDashboard.dashboard")}</span>
                <Select
                  value={agent.selectedDashboard}
                  onValueChange={(value) => handleDashboardChange(agent.id, value)}
                >
                  <SelectTrigger className="w-40 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {agent.dashboards.map((dashboard) => (
                      <SelectItem key={dashboard} value={dashboard} className="text-xs">
                        {dashboard}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {agent.isLoading
                  ? // Loading skeleton
                    Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-6 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))
                  : agent.metrics.map((metric, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs font-bold text-gray-700 mb-1">{metric.name}</div>
                        <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
                      </div>
                    ))}
              </div>
            </div>

            {/* Output Frames */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">{t("resultDashboard.outputFrames")}</h4>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border hover:border-gray-300 transition-colors">
                      <img
                        src={`/placeholder.svg?height=120&width=160&text=${t("resultDashboard.frame", { number: index + 1 })}`}
                        alt={t("resultDashboard.frame", { number: index + 1 })}
                        className="w-full h-full object-cover"
                      />
                      {/* Timestamp overlay */}
                      <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                        {generateTimestamp()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
