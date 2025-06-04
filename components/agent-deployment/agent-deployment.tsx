"use client"

import { useState, useEffect } from "react"
import { Plus, Play, Square, Power, PowerOff, Edit, Trash2, X } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Agent, TaskStatus } from "@/lib/types/agent"
import type { TaskSpec } from "@/lib/types/task"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Editor } from "@/components/ui/monaco-editor"

// Define AgentTask type
type AgentTask = {
  id: string
  name: string
  status: TaskStatus
  host: string
  reason?: string
  parameters?: Record<string, string>
}

// Mock tasks for selection - only routine tasks
const availableTasks: TaskSpec[] = [
  {
    id: "task-1",
    name: "Camera Feed Analysis",
    type: "monitor",
    category: "routine",
    description: "Analyzes camera feeds for objects and events",
    specification: "",
    parameters: {
      detection_threshold: "0.75",
      frame_rate: "15",
      max_objects: "10",
    },
  },
  {
    id: "task-2",
    name: "Motion Detection",
    type: "monitor",
    category: "routine",
    description: "Detects motion in video streams",
    specification: "",
    parameters: {
      sensitivity: "medium",
      min_area: "100",
      cooldown_period: "5",
    },
  },
  {
    id: "task-6",
    name: "Metric Collection",
    type: "monitor",
    category: "routine",
    description: "Collects system and application metrics",
    specification: "",
    parameters: {
      collection_interval: "60",
      metrics_types: "cpu,memory,disk",
      retention_days: "30",
    },
  },
].filter((task) => task.category === "routine") // Only show routine tasks

// Mock hosts for task assignment
const availableHosts = ["engine-01", "engine-02", "engine-03"]

// Mock data for demonstration
const mockAgents: Agent[] = [
  {
    id: "agent-001",
    name: "Video Surveillance Agent",
    description: "Video surveillance monitoring agent",
    status: "active",
    tasks: [
      {
        id: "task-1",
        status: "running",
        name: "Camera Feed Analysis",
        host: "engine-01",
        reason: "Running normally",
        parameters: {
          detection_threshold: "0.75",
          frame_rate: "15",
          max_objects: "10",
        },
      },
      {
        id: "task-2",
        status: "stopped",
        name: "Motion Detection",
        host: "engine-02",
        reason: "Manually stopped",
        parameters: {
          sensitivity: "medium",
          min_area: "100",
          cooldown_period: "5",
        },
      },
    ],
    config: {
      detection_threshold: 0.75,
      frame_rate: 15,
      notification_endpoint: "https://api.example.com/notifications",
    },
    memory_schema: ["detection_events", "person_tracking"],
  },
  {
    id: "agent-002",
    name: "Data Processing Agent",
    description: "Data processing agent",
    status: "disabled",
    tasks: [
      { id: "task-3", status: "stopped", name: "Data Ingestion", host: "engine-01", reason: "Agent disabled" },
      { id: "task-4", status: "stopped", name: "Data Transformation", host: "engine-03", reason: "Agent disabled" },
      { id: "task-5", status: "stopped", name: "Data Export", host: "engine-02", reason: "Agent disabled" },
    ],
    config: {
      batch_size: 100,
      processing_interval: 300,
      output_format: "json",
    },
    memory_schema: ["raw_data", "processed_data", "export_logs"],
  },
  {
    id: "agent-003",
    name: "Anomaly Detection Agent",
    description: "Anomaly detection agent",
    status: "active",
    tasks: [
      {
        id: "task-6",
        status: "running",
        name: "Metric Collection",
        host: "engine-02",
        reason: "Running normally",
        parameters: {
          collection_interval: "60",
          metrics_types: "cpu,memory,disk",
          retention_days: "30",
        },
      },
      {
        id: "task-7",
        status: "error",
        name: "Anomaly Analysis",
        host: "engine-03",
        reason: "Execution error: Out of memory",
      },
    ],
    config: {
      sensitivity: "high",
      baseline_period: "7d",
      alert_threshold: 3,
    },
    memory_schema: ["metrics", "anomalies", "alerts"],
  },
]

export function AgentDeployment() {
  const { t } = useI18n()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)

  // Form state
  const [formData, setFormData] = useState<Partial<Agent>>({
    name: "",
    description: "",
    tasks: [],
    config: {},
    memory_schema: [],
  })
  const [configJson, setConfigJson] = useState("")
  const [newMemorySchema, setNewMemorySchema] = useState("")
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")

  // Task parameters state
  const [selectedTaskParameters, setSelectedTaskParameters] = useState<Record<string, string>>({})
  const [newParamKey, setNewParamKey] = useState("")
  const [newParamValue, setNewParamValue] = useState("")

  // Fetch agents from backend (mocked)
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/agents')
        // const data = await response.json()

        // Using mock data for demonstration
        setAgents(mockAgents)
        setLoading(false)
      } catch (err) {
        setError(t("agentDeployment.errors.failedToLoad"))
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  // Initialize form with agent data if editing
  useEffect(() => {
    if (editingAgent) {
      setFormData({
        ...editingAgent,
        name: editingAgent.name || "",
      })
      setConfigJson(JSON.stringify(editingAgent.config, null, 2))
    } else if (showForm) {
      setFormData({
        name: "",
        description: "",
        tasks: [],
        config: {},
        memory_schema: [],
      })
      setConfigJson("{}")
      setSelectedTaskId("")
      setSelectedTaskParameters({})
    }
  }, [editingAgent, showForm])

  const handleCreateAgent = () => {
    setEditingAgent(null)
    setShowForm(true)
  }

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingAgent(null)
  }

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }))
  }

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }))
  }

  const handleConfigChange = (value: string) => {
    setConfigJson(value)
    try {
      const parsed = JSON.parse(value)
      setFormData((prev) => ({ ...prev, config: parsed }))
      setJsonError(null)
    } catch (error) {
      setJsonError(t("common.invalidJson"))
    }
  }

  const handleAddMemorySchema = () => {
    if (newMemorySchema.trim() && !formData.memory_schema?.includes(newMemorySchema.trim())) {
      setFormData((prev) => ({
        ...prev,
        memory_schema: [...(prev.memory_schema || []), newMemorySchema.trim()],
      }))
      setNewMemorySchema("")
    }
  }

  const handleRemoveMemorySchema = (schema: string) => {
    setFormData((prev) => ({
      ...prev,
      memory_schema: prev.memory_schema?.filter((s) => s !== schema) || [],
    }))
  }

  const handleTaskSelection = (taskId: string) => {
    setSelectedTaskId(taskId)

    // Load default parameters for the selected task
    const selectedTask = availableTasks.find((task) => task.id === taskId)
    if (selectedTask && selectedTask.parameters) {
      setSelectedTaskParameters({ ...selectedTask.parameters })
    } else {
      setSelectedTaskParameters({})
    }
  }

  const handleAddTaskParameter = () => {
    if (!newParamKey.trim() || !newParamValue.trim()) return
    if (selectedTaskParameters[newParamKey]) return // Don't add duplicate keys

    setSelectedTaskParameters((prev) => ({
      ...prev,
      [newParamKey.trim()]: newParamValue.trim(),
    }))
    setNewParamKey("")
    setNewParamValue("")
  }

  const handleUpdateTaskParameter = (key: string, value: string) => {
    setSelectedTaskParameters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleDeleteTaskParameter = (key: string) => {
    setSelectedTaskParameters((prev) => {
      const newParameters = { ...prev }
      delete newParameters[key]
      return newParameters
    })
  }

  const handleAddTask = () => {
    if (!selectedTaskId) return

    // Check if task is already added
    if (formData.tasks?.some((task) => task.id === selectedTaskId)) {
      return
    }

    const taskInfo = availableTasks.find((t) => t.id === selectedTaskId)
    if (!taskInfo) return

    const newTask: AgentTask = {
      id: selectedTaskId,
      name: taskInfo.name,
      status: "stopped",
      host: availableHosts[0],
      parameters: { ...selectedTaskParameters },
    }

    setFormData((prev) => ({
      ...prev,
      tasks: [...(prev.tasks || []), newTask],
    }))

    // Reset selection
    setSelectedTaskId("")
    setSelectedTaskParameters({})
  }

  const handleRemoveTask = (taskId: string) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks?.filter((task) => task.id !== taskId) || [],
    }))
  }

  const handleTaskHostChange = (taskId: string, host: string) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks?.map((task) => (task.id === taskId ? { ...task, host } : task)) || [],
    }))
  }

  const handleSaveAgent = () => {
    if (jsonError) {
      alert(t("agentDeployment.form.jsonError"))
      return
    }

    if (!formData.name) {
      alert(t("agentDeployment.errors.nameRequired"))
      return
    }

    if (editingAgent) {
      // Update existing agent
      setAgents((prev) =>
        prev.map((a) =>
          a.id === editingAgent.id
            ? {
                ...editingAgent,
                name: formData.name || "",
                description: formData.description || "",
                tasks: formData.tasks || [],
                config: formData.config || {},
                memory_schema: formData.memory_schema || [],
              }
            : a,
        ),
      )
    } else {
      // Create new agent (with disabled status)
      const newAgent: Agent = {
        id: `agent-${Date.now().toString(36)}`,
        name: formData.name || "",
        description: formData.description || "",
        status: "disabled",
        tasks: formData.tasks || [],
        config: formData.config || {},
        memory_schema: formData.memory_schema || [],
      }
      setAgents((prev) => [...prev, newAgent])
    }
    setShowForm(false)
    setEditingAgent(null)
  }

  const handleDeleteAgent = (agentId: string) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== agentId))
  }

  const handleToggleAgentStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId) {
          return {
            ...agent,
            status: agent.status === "active" ? "disabled" : "active",
            // If disabling, stop all tasks
            tasks:
              agent.status === "active"
                ? agent.tasks.map((task) => ({
                    ...task,
                    status: "stopped" as TaskStatus,
                    reason: t("agentDeployment.reason.stopped"),
                  }))
                : agent.tasks,
          }
        }
        return agent
      }),
    )
  }

  const handleToggleTaskStatus = (agentId: string, taskId: string) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId) {
          return {
            ...agent,
            tasks: agent.tasks.map((task) => {
              if (task.id === taskId) {
                const newStatus = task.status === "running" ? "stopped" : "running"
                const reason =
                  newStatus === "running" ? t("agentDeployment.reason.completed") : t("agentDeployment.reason.stopped")
                return {
                  ...task,
                  status: newStatus,
                  reason,
                }
              }
              return task
            }),
          }
        }
        return agent
      }),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "disabled":
        return "bg-gray-100 text-gray-800"
      case "running":
        return "bg-blue-100 text-blue-800"
      case "stopped":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    return t(`agentDeployment.status.${status}`)
  }

  const getAgentStatusText = (status: string) => {
    return t(`agentDeployment.status.${status}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-2">
            {t("common.retry")}
          </Button>
        </div>
      </div>
    )
  }

  // Show agent form instead of agent list when creating/editing
  if (showForm) {
    return (
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <h2 className="font-semibold text-gray-800 text-lg">
            {editingAgent ? t("agentDeployment.form.title.edit") : t("agentDeployment.form.title.create")}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseForm}
            className="h-8 w-8 p-0"
            aria-label={t("common.cancel")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t("common.cancel")}</span>
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Label htmlFor="name" className="w-24 flex-shrink-0">
                {t("agentDeployment.form.name")}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={t("settingsPanel.sections.general.namePlaceholder")}
                aria-label={t("agentDeployment.form.name")}
                className="flex-1"
              />
            </div>

            <div className="flex items-start gap-4">
              <Label htmlFor="description" className="w-24 flex-shrink-0 pt-2">
                {t("agentDeployment.form.description")}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder={t("agentDeployment.form.descriptionPlaceholder")}
                className="resize-none flex-1"
                rows={3}
                aria-label={t("agentDeployment.form.description")}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">Routine Tasks</Label>

              {/* Task Template Selection */}
              <div className="flex space-x-2">
                <Select value={selectedTaskId} onValueChange={handleTaskSelection}>
                  <SelectTrigger className="flex-1 h-9">
                    <SelectValue placeholder="Select routine task template" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTasks
                      .filter((task) => !formData.tasks?.some((t) => t.id === task.id))
                      .map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.name} ({task.type})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Task Parameters Panel */}
              {selectedTaskId && (
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{t("taskEditor.taskParameters")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={newParamKey}
                          onChange={(e) => setNewParamKey(e.target.value)}
                          placeholder={t("taskEditor.parameterKey")}
                          className="flex-1 h-7 text-xs"
                        />
                        <Input
                          value={newParamValue}
                          onChange={(e) => setNewParamValue(e.target.value)}
                          placeholder={t("taskEditor.parameterValue")}
                          className="flex-1 h-7 text-xs"
                        />
                        <Button
                          onClick={handleAddTaskParameter}
                          disabled={!newParamKey.trim() || !newParamValue.trim()}
                          size="sm"
                          className="h-7 px-3"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="border rounded-md">
                        {Object.keys(selectedTaskParameters).length > 0 ? (
                          <div className="divide-y">
                            {Object.entries(selectedTaskParameters).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2 p-2">
                                <Label className="w-24 flex-shrink-0 text-xs font-medium">{key}</Label>
                                <Input
                                  value={value}
                                  onChange={(e) => handleUpdateTaskParameter(key, e.target.value)}
                                  className="flex-1 h-7 text-xs"
                                />
                                <Button
                                  onClick={() => handleDeleteTaskParameter(key)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-red-600"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-gray-500 text-xs">
                            {t("taskEditor.noParametersDefined")}
                          </div>
                        )}
                      </div>

                      <Button
                        type="button"
                        onClick={handleAddTask}
                        disabled={!selectedTaskId}
                        size="sm"
                        className="h-8 px-4"
                        aria-label="Add routine task with parameters"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Task with Parameters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Selected Tasks List */}
              <div className="border rounded-md mt-2">
                {formData.tasks && formData.tasks.length > 0 ? (
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">{t("agentDeployment.task.name")}</th>
                        <th className="px-3 py-2 text-left font-medium">{t("agentDeployment.task.host")}</th>
                        <th className="px-3 py-2 text-left font-medium">{t("common.parameters")}</th>
                        <th className="px-3 py-2 text-right font-medium">{t("agentDeployment.task.actions")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {formData.tasks.map((task) => (
                        <tr key={task.id}>
                          <td className="px-3 py-2">{task.name}</td>
                          <td className="px-3 py-2">
                            <select
                              value={task.host}
                              onChange={(e) => handleTaskHostChange(task.id, e.target.value)}
                              className="text-xs border rounded px-2 py-1 w-full"
                              aria-label={t("agentDeployment.task.host")}
                            >
                              {availableHosts.map((host) => (
                                <option key={host} value={host}>
                                  {host}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap gap-1">
                              {task.parameters && Object.keys(task.parameters).length > 0 ? (
                                Object.entries(task.parameters)
                                  .slice(0, 2)
                                  .map(([key, value]) => (
                                    <Badge key={key} variant="outline" className="text-xs px-1 py-0">
                                      {key}: {value}
                                    </Badge>
                                  ))
                              ) : (
                                <span className="text-gray-400 text-xs">{t("taskEditor.noParametersDefined")}</span>
                              )}
                              {task.parameters && Object.keys(task.parameters).length > 2 && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  +{Object.keys(task.parameters).length - 2} more
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTask(task.id)}
                              className="h-6 w-6 p-0 text-red-600"
                              aria-label={t("agentDeployment.delete")}
                            >
                              <Trash2 className="h-3 w-3" />
                              <span className="sr-only">{t("agentDeployment.delete")}</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-xs">No routine tasks assigned</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="config">{t("agentDeployment.form.config")}</Label>
              <div className="border rounded-md overflow-hidden" style={{ height: "200px" }}>
                <Editor
                  height="200px"
                  language="json"
                  value={configJson}
                  onChange={(value) => handleConfigChange(value || "{}")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 3,
                    padding: { top: 4, bottom: 4 },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                />
              </div>
              {jsonError && <p className="text-red-500 text-xs">{jsonError}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t("agentDeployment.form.memorySchema")}</Label>
              <div className="flex space-x-2">
                <Input
                  value={newMemorySchema}
                  onChange={(e) => setNewMemorySchema(e.target.value)}
                  placeholder={t("agentDeployment.form.addMemorySchema")}
                  className="flex-1 h-9"
                  aria-label={t("agentDeployment.form.addMemorySchema")}
                />
                <Button
                  type="button"
                  onClick={handleAddMemorySchema}
                  disabled={!newMemorySchema.trim()}
                  size="sm"
                  className="h-9 px-3"
                  aria-label={t("agentDeployment.form.addMemorySchema")}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.memory_schema?.map((schema, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-purple-50 text-purple-800 border-purple-200 flex items-center gap-1"
                  >
                    {schema}
                    <button
                      onClick={() => handleRemoveMemorySchema(schema)}
                      className="ml-1 text-purple-800 hover:text-purple-900"
                      aria-label={t("agentDeployment.delete")}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">{t("agentDeployment.delete")}</span>
                    </button>
                  </Badge>
                ))}
                {formData.memory_schema?.length === 0 && (
                  <p className="text-xs text-gray-500">{t("agentDeployment.form.noMemorySchema")}</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="border-t border-gray-200 pt-4 mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCloseForm} aria-label={t("agentDeployment.form.cancel")}>
            {t("agentDeployment.form.cancel")}
          </Button>
          <Button
            onClick={handleSaveAgent}
            disabled={!!jsonError}
            className="bg-[#6C47FF] hover:bg-[#5A3CD7]"
            aria-label={editingAgent ? t("agentDeployment.form.update") : t("agentDeployment.form.create")}
          >
            {editingAgent ? t("agentDeployment.form.update") : t("agentDeployment.form.create")}
          </Button>
        </div>
      </div>
    )
  }

  // Show agent list
  return (
    <div className="p-4 h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">{t("agentDeployment.title")}</h2>
        <Button
          onClick={handleCreateAgent}
          className="bg-[#6C47FF] hover:bg-[#5A3CD7] h-8"
          size="sm"
          aria-label={t("agentDeployment.createNew")}
        >
          <Plus className="h-4 w-4 mr-1" />
          {t("agentDeployment.createNew")}
        </Button>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">{t("agentDeployment.noAgents")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {agents.map((agent) => (
            <Card key={agent.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base flex items-center">
                      {agent.name}
                      <Badge variant="outline" className={`ml-2 ${getStatusColor(agent.status)} border-0`}>
                        {getAgentStatusText(agent.status)}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleAgentStatus(agent.id)}
                      className={`h-8 w-8 ${agent.status === "active" ? "text-red-600" : "text-green-600"}`}
                      title={agent.status === "active" ? t("agentDeployment.disable") : t("agentDeployment.activate")}
                      aria-label={
                        agent.status === "active" ? t("agentDeployment.disable") : t("agentDeployment.activate")
                      }
                    >
                      {agent.status === "active" ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditAgent(agent)}
                      className="h-8 w-8"
                      title={t("agentDeployment.edit")}
                      aria-label={t("agentDeployment.edit")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAgent(agent.id)}
                      className="h-8 w-8 text-red-600"
                      title={t("agentDeployment.delete")}
                      aria-label={t("agentDeployment.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Routine Tasks</h4>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">{t("agentDeployment.task.name")}</th>
                          <th className="px-3 py-2 text-left font-medium">{t("agentDeployment.task.host")}</th>
                          <th className="px-3 py-2 text-left font-medium">{t("agentDeployment.task.status")}</th>
                          <th className="px-3 py-2 text-left font-medium">{t("common.parameters")}</th>
                          <th className="px-3 py-2 text-left font-medium">{t("agentDeployment.task.reason")}</th>
                          <th className="px-3 py-2 text-right font-medium">{t("agentDeployment.task.actions")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {agent.tasks.map((task) => (
                          <tr key={task.id}>
                            <td className="px-3 py-2">{task.name}</td>
                            <td className="px-3 py-2">{task.host}</td>
                            <td className="px-3 py-2">
                              <Badge variant="outline" className={`${getStatusColor(task.status)} border-0`}>
                                {getStatusText(task.status)}
                              </Badge>
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex flex-wrap gap-1">
                                {task.parameters && Object.keys(task.parameters).length > 0 ? (
                                  Object.entries(task.parameters)
                                    .slice(0, 2)
                                    .map(([key, value]) => (
                                      <Badge key={key} variant="outline" className="text-xs px-1 py-0">
                                        {key}: {value}
                                      </Badge>
                                    ))
                                ) : (
                                  <span className="text-gray-400 text-xs">-</span>
                                )}
                                {task.parameters && Object.keys(task.parameters).length > 2 && (
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    +{Object.keys(task.parameters).length - 2}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-xs text-gray-600">{task.reason || "-"}</td>
                            <td className="px-3 py-2 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleTaskStatus(agent.id, task.id)}
                                disabled={agent.status === "disabled" || task.status === "error"}
                                className="h-6 w-6"
                                title={
                                  task.status === "running"
                                    ? t("agentDeployment.task.stop")
                                    : t("agentDeployment.task.start")
                                }
                                aria-label={
                                  task.status === "running"
                                    ? t("agentDeployment.task.stop")
                                    : t("agentDeployment.task.start")
                                }
                              >
                                {task.status === "running" ? (
                                  <Square className="h-3 w-3" />
                                ) : (
                                  <Play className="h-3 w-3" />
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {agent.tasks.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-3 py-3 text-center text-gray-500">
                              No routine tasks
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">{t("agentDeployment.configuration")}</h4>
                  </div>
                  <div className="bg-gray-50 rounded-md p-3 font-mono text-xs overflow-x-auto">
                    <pre>{JSON.stringify(agent.config, null, 2)}</pre>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">{t("agentDeployment.memorySchema")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {agent.memory_schema.map((schema, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                        {schema}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
