"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, Search, Clock, Filter } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n/i18n-context"

// Define the log entry type
interface LogEntry {
  id: string
  agent_id: string
  task_id: string
  host_id: string
  text: string
  timestamp: Date
  type: "info" | "warning" | "error" | "debug"
}

// Sample data for demonstration
const sampleAgents = [
  { id: "agent-001", name: "Video Surveillance Agent" },
  { id: "agent-002", name: "Data Processing Agent" },
  { id: "agent-003", name: "Anomaly Detection Agent" },
]

// Generate sample log entries
const generateSampleLogs = (count: number): LogEntry[] => {
  const types: ("info" | "warning" | "error" | "debug")[] = ["info", "warning", "error", "debug"]
  const logs: LogEntry[] = []

  for (let i = 0; i < count; i++) {
    const agentIndex = Math.floor(Math.random() * sampleAgents.length)
    const agent = sampleAgents[agentIndex]
    const type = types[Math.floor(Math.random() * types.length)]

    // Create a timestamp within the last 24 hours
    const timestamp = new Date()
    timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 24))
    timestamp.setMinutes(timestamp.getMinutes() - Math.floor(Math.random() * 60))
    timestamp.setSeconds(timestamp.getSeconds() - Math.floor(Math.random() * 60))

    logs.push({
      id: `log-${i}`,
      agent_id: agent.id,
      task_id: `task-${Math.floor(Math.random() * 5) + 1}`,
      host_id: `host-${Math.floor(Math.random() * 3) + 1}`,
      text: getLogText(type, agent.id),
      timestamp,
      type,
    })
  }

  return logs
}

// Helper function to generate log text based on type
const getLogText = (type: string, agentId: string): string => {
  switch (type) {
    case "info":
      return `Agent ${agentId} successfully processed data batch.`
    case "warning":
      return `Agent ${agentId} encountered a non-critical issue with data processing.`
    case "error":
      return `Agent ${agentId} failed to connect to the database. Retrying in 5 seconds.`
    case "debug":
      return `Agent ${agentId} initialized with configuration: { verbose: true, timeout: 30s }.`
    default:
      return `Agent ${agentId} logged an event.`
  }
}

export function LogsPanel() {
  const { t } = useI18n()
  const [logs] = useState<LogEntry[]>(generateSampleLogs(50))
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgentId, setSelectedAgentId] = useState<string>("all") // Changed from empty string to "all"
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    let filtered = logs

    // Filter by agent_id if selected
    if (selectedAgentId && selectedAgentId !== "all") {
      // Changed condition to check for "all"
      filtered = filtered.filter((log) => log.agent_id === selectedAgentId)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (log) =>
          log.text.toLowerCase().includes(term) ||
          log.agent_id.toLowerCase().includes(term) ||
          log.task_id.toLowerCase().includes(term) ||
          log.host_id.toLowerCase().includes(term),
      )
    }

    // Sort by timestamp
    filtered = [...filtered].sort((a, b) => {
      if (sortDirection === "asc") {
        return a.timestamp.getTime() - b.timestamp.getTime()
      } else {
        return b.timestamp.getTime() - a.timestamp.getTime()
      }
    })

    return filtered
  }, [logs, searchTerm, selectedAgentId, sortDirection])

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Get badge color based on log type
  const getLogTypeBadgeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "debug":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  return (
    <div className="p-4 h-full overflow-auto">
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder={t("logs.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 h-7 w-full sm:w-[180px] text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-3 w-3 text-gray-500" />
                <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                  <SelectTrigger className="h-7 w-full sm:w-[180px] text-xs">
                    <SelectValue placeholder={t("logs.filterByAgent")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">
                      {t("logs.allAgents")}
                    </SelectItem>
                    {sampleAgents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id} className="text-xs">
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500 text-xs">{t("logs.agentId")}</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500 text-xs">{t("logs.taskId")}</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500 text-xs">{t("logs.hostId")}</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500 text-xs">{t("logs.type")}</th>
                    <th
                      className="px-4 py-2 text-left font-medium text-gray-500 cursor-pointer text-xs"
                      onClick={toggleSortDirection}
                    >
                      <div className="flex items-center">
                        {t("logs.timestamp")}
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                          {sortDirection === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500 text-xs">{t("logs.message")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">{log.agent_id}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{log.task_id}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{log.host_id}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Badge variant="outline" className={`${getLogTypeBadgeColor(log.type)} border-0`}>
                          {log.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-400" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-4 py-2 max-w-md truncate">{log.text}</td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-xs">
                        {t("logs.noLogsFound")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
