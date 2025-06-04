"use client"

import { useState, useEffect } from "react"
import { Play } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Editor } from "@/components/ui/monaco-editor"
import type { Agent } from "@/lib/types/agent"

// Mock agents data (same as used in agent deployment)
const mockAgents: Agent[] = [
  {
    id: "agent-001",
    name: "Video Surveillance Agent",
    description: "Video surveillance monitoring agent",
    status: "active",
    tasks: [],
    config: {},
    memory_schema: ["detection_events", "person_tracking"],
  },
  {
    id: "agent-002",
    name: "Data Processing Agent",
    description: "Data processing agent",
    status: "disabled",
    tasks: [],
    config: {},
    memory_schema: ["raw_data", "processed_data", "export_logs"],
  },
  {
    id: "agent-003",
    name: "Anomaly Detection Agent",
    description: "Anomaly detection agent",
    status: "active",
    tasks: [],
    config: {},
    memory_schema: ["metrics", "anomalies", "alerts"],
  },
]

// Mock table structures for each memory schema
const mockTableStructures: Record<string, Array<{ name: string; columns: Array<{ name: string; type: string }> }>> = {
  detection_events: [
    {
      name: "events",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "timestamp", type: "DATETIME" },
        { name: "object_type", type: "VARCHAR(50)" },
        { name: "confidence", type: "FLOAT" },
        { name: "bbox_x", type: "INTEGER" },
        { name: "bbox_y", type: "INTEGER" },
        { name: "bbox_width", type: "INTEGER" },
        { name: "bbox_height", type: "INTEGER" },
      ],
    },
    {
      name: "cameras",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "name", type: "VARCHAR(100)" },
        { name: "location", type: "VARCHAR(200)" },
        { name: "status", type: "VARCHAR(20)" },
      ],
    },
  ],
  person_tracking: [
    {
      name: "tracks",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "person_id", type: "VARCHAR(50)" },
        { name: "timestamp", type: "DATETIME" },
        { name: "x_position", type: "FLOAT" },
        { name: "y_position", type: "FLOAT" },
        { name: "camera_id", type: "INTEGER" },
      ],
    },
    {
      name: "persons",
      columns: [
        { name: "id", type: "VARCHAR(50)" },
        { name: "first_seen", type: "DATETIME" },
        { name: "last_seen", type: "DATETIME" },
        { name: "total_detections", type: "INTEGER" },
      ],
    },
  ],
  raw_data: [
    {
      name: "ingestion_log",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "source", type: "VARCHAR(100)" },
        { name: "timestamp", type: "DATETIME" },
        { name: "file_path", type: "VARCHAR(500)" },
        { name: "file_size", type: "BIGINT" },
        { name: "status", type: "VARCHAR(20)" },
      ],
    },
  ],
  processed_data: [
    {
      name: "processing_results",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "input_file", type: "VARCHAR(500)" },
        { name: "output_file", type: "VARCHAR(500)" },
        { name: "processing_time", type: "FLOAT" },
        { name: "timestamp", type: "DATETIME" },
        { name: "status", type: "VARCHAR(20)" },
      ],
    },
  ],
  export_logs: [
    {
      name: "exports",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "export_type", type: "VARCHAR(50)" },
        { name: "destination", type: "VARCHAR(200)" },
        { name: "timestamp", type: "DATETIME" },
        { name: "record_count", type: "INTEGER" },
        { name: "status", type: "VARCHAR(20)" },
      ],
    },
  ],
  metrics: [
    {
      name: "system_metrics",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "timestamp", type: "DATETIME" },
        { name: "cpu_usage", type: "FLOAT" },
        { name: "memory_usage", type: "FLOAT" },
        { name: "disk_usage", type: "FLOAT" },
        { name: "network_io", type: "FLOAT" },
      ],
    },
  ],
  anomalies: [
    {
      name: "detected_anomalies",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "timestamp", type: "DATETIME" },
        { name: "anomaly_type", type: "VARCHAR(100)" },
        { name: "severity", type: "VARCHAR(20)" },
        { name: "description", type: "TEXT" },
        { name: "resolved", type: "BOOLEAN" },
      ],
    },
  ],
  alerts: [
    {
      name: "alert_history",
      columns: [
        { name: "id", type: "INTEGER" },
        { name: "timestamp", type: "DATETIME" },
        { name: "alert_type", type: "VARCHAR(50)" },
        { name: "message", type: "TEXT" },
        { name: "acknowledged", type: "BOOLEAN" },
        { name: "acknowledged_by", type: "VARCHAR(100)" },
      ],
    },
  ],
}

// Mock query results
const generateMockResults = (query: string) => {
  // Simple mock - in reality this would execute the actual SQL
  const mockData = [
    { id: 1, timestamp: "2024-01-15 10:30:00", object_type: "person", confidence: 0.95 },
    { id: 2, timestamp: "2024-01-15 10:31:15", object_type: "vehicle", confidence: 0.87 },
    { id: 3, timestamp: "2024-01-15 10:32:30", object_type: "person", confidence: 0.92 },
  ]

  return {
    columns: Object.keys(mockData[0] || {}),
    rows: mockData,
    executionTime: Math.floor(Math.random() * 100) + 10,
    rowCount: mockData.length,
  }
}

export function QueryMemory() {
  const { t } = useI18n()
  const [selectedAgentId, setSelectedAgentId] = useState<string>("")
  const [selectedSchema, setSelectedSchema] = useState<string>("")
  const [sqlQuery, setSqlQuery] = useState<string>("")
  const [queryResults, setQueryResults] = useState<any>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get available schemas for selected agent
  const availableSchemas = selectedAgentId
    ? mockAgents.find((agent) => agent.id === selectedAgentId)?.memory_schema || []
    : []

  // Get table structure for selected schema
  const tableStructure = selectedSchema ? mockTableStructures[selectedSchema] || [] : []

  // Update SQL query when schema changes
  useEffect(() => {
    if (selectedSchema && tableStructure.length > 0) {
      const firstTable = tableStructure[0].name
      const sampleQuery = t("queryMemory.sampleQuery", {
        schema: selectedSchema,
        table: firstTable,
      })
      setSqlQuery(sampleQuery)
    }
  }, [selectedSchema, tableStructure, t])

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) return

    setIsExecuting(true)
    setError(null)

    try {
      // Simulate query execution
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate mock results
      const results = generateMockResults(sqlQuery)
      setQueryResults(results)
    } catch (err) {
      setError(t("queryMemory.queryError"))
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="h-full flex flex-col space-y-2">
      {/* Top Section - Agent and Schema Selectors */}
      <Card>
        <CardHeader className="pb-2"></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">{t("queryMemory.selectAgent")}</label>
              <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder={t("queryMemory.selectAgent")} />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {mockAgents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">{t("queryMemory.selectMemorySchema")}</label>
              <Select value={selectedSchema} onValueChange={setSelectedSchema} disabled={!selectedAgentId}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder={t("queryMemory.selectMemorySchema")} />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {availableSchemas.map((schema) => (
                    <SelectItem key={schema} value={schema}>
                      {schema}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schema Structure Panel - Full Width */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t("queryMemory.memorySchema")}</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedSchema ? (
            <div className="text-center text-gray-500 py-8">{t("queryMemory.noSchemaSelected")}</div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {tableStructure.map((table) => (
                <div key={table.name} className="border rounded-lg overflow-hidden min-w-[250px] flex-shrink-0">
                  <div className="bg-gray-50 px-3 py-2 font-medium text-xs">{table.name}</div>
                  <div className="divide-y max-h-48 overflow-y-auto">
                    {table.columns.map((column) => (
                      <div key={column.name} className="px-3 py-2 flex justify-between text-xs">
                        <span className="font-mono">{column.name}</span>
                        <span className="text-gray-500">{column.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Query Results Panel - Full Width */}
      <Card className="flex-1 min-h-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t("queryMemory.queryResults")}</CardTitle>
          {queryResults && (
            <div className="text-[10px] text-gray-500 space-x-4">
              <span>{t("queryMemory.executionTime", { time: queryResults.executionTime })}</span>
              <span>{t("queryMemory.rowsReturned", { count: queryResults.rowCount })}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)] overflow-auto">
          {error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : !queryResults ? (
            <div className="text-center text-gray-500 py-8">{t("queryMemory.noResults")}</div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {queryResults.columns.map((column: string) => (
                      <th key={column} className="px-3 py-2 text-left font-medium text-gray-700 text-xs">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {queryResults.rows.map((row: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {queryResults.columns.map((column: string) => (
                        <td key={column} className="px-3 py-2 text-gray-900 text-xs">
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SQL Editor Panel - Full Width */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">{t("queryMemory.sqlEditor")}</CardTitle>
            <Button
              onClick={handleRunQuery}
              disabled={!sqlQuery.trim() || isExecuting}
              className="bg-[#6C47FF] hover:bg-[#5A3CD7]"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              {isExecuting ? t("common.loading") : t("queryMemory.runQuery")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden" style={{ height: "250px" }}>
            <Editor
              height="250px"
              language="sql"
              value={sqlQuery}
              onChange={(value) => setSqlQuery(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                padding: { top: 8, bottom: 8 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
