"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Save, Upload, Download, Check, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/i18n-context"
import { SimpleJsonEditor } from "@/components/ui/simple-json-editor"
import type { TaskSpec, TaskType, TaskCategory, ParameterType } from "@/lib/types/task"

// Dynamically import Monaco Editor with no SSR to avoid hydration issues
const MonacoEditor = dynamic(() => import("@/components/ui/monaco-editor").then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <SimpleJsonEditor value="" onChange={() => {}} aria-label="Loading editor..." />,
})

// Sample tasks for the dropdown
const sampleTasks: TaskSpec[] = [
  {
    id: "task-1",
    name: "Website Monitoring Template",
    type: "monitor",
    category: "routine",
    description: "Monitor website availability and response time",
    specification: JSON.stringify(
      {
        rules: [
          { type: "availability", threshold: 99.9 },
          { type: "responseTime", threshold: 200 },
        ],
        actions: [{ type: "alert", target: "email" }],
      },
      null,
      2,
    ),
    parameters: {
      check_interval: {
        type: "int",
        description: "Interval between checks in seconds",
        defaultValue: "300",
      },
      timeout: {
        type: "int",
        description: "Request timeout in seconds",
        defaultValue: "30",
      },
      retry_count: {
        type: "int",
        description: "Number of retries on failure",
        defaultValue: "3",
      },
    },
  },
  {
    id: "task-2",
    name: "Data Ingestion Template",
    type: "ingest",
    category: "routine",
    description: "Ingest data from API endpoints into the database",
    specification: JSON.stringify(
      {
        sources: [{ type: "rest", endpoint: "https://api.example.com/data" }],
        destination: {
          type: "database",
          table: "raw_data",
        },
      },
      null,
      2,
    ),
    parameters: {
      batch_size: {
        type: "int",
        description: "Number of records to process in each batch",
        defaultValue: "1000",
      },
      sync_interval: {
        type: "int",
        description: "Synchronization interval in seconds",
        defaultValue: "3600",
      },
      max_retries: {
        type: "int",
        description: "Maximum number of retry attempts",
        defaultValue: "5",
      },
    },
  },
  {
    id: "task-3",
    name: "System Analysis Template",
    type: "analyze",
    category: "one-time",
    description: "Analyze system performance metrics",
    specification: JSON.stringify(
      {
        metrics: ["cpu", "memory", "disk", "network"],
        period: "hourly",
        aggregation: "average",
      },
      null,
      2,
    ),
    parameters: {
      analysis_depth: {
        type: "str",
        description: "Level of analysis detail",
        defaultValue: "detailed",
      },
      report_format: {
        type: "str",
        description: "Output format for the report",
        defaultValue: "pdf",
      },
      include_recommendations: {
        type: "bool",
        description: "Whether to include recommendations in the report",
        defaultValue: "true",
      },
    },
  },
]

export function TaskEditor() {
  const { t } = useI18n()
  const [availableTasks, setAvailableTasks] = useState<TaskSpec[]>(sampleTasks)
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")
  const [taskSpec, setTaskSpec] = useState<TaskSpec>({
    id: "",
    name: "",
    type: "monitor",
    category: "routine",
    description: "",
    specification: JSON.stringify({ rules: [], actions: [] }, null, 2),
    parameters: {},
  })
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [newParamKey, setNewParamKey] = useState("")
  const [newParamType, setNewParamType] = useState<ParameterType>("str")
  const [newParamDescription, setNewParamDescription] = useState("")

  // Reset success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [saveSuccess])

  // Load task when selected from dropdown
  const handleTaskSelection = (taskId: string) => {
    setSelectedTaskId(taskId)

    if (taskId === "new") {
      // Create a new task
      setTaskSpec({
        id: "",
        name: "",
        type: "monitor",
        category: "routine",
        description: "",
        specification: JSON.stringify({ rules: [], actions: [] }, null, 2),
        parameters: {},
      })
    } else {
      // Find and load the selected task
      const selectedTask = availableTasks.find((task) => task.id === taskId)
      if (selectedTask) {
        setTaskSpec({ ...selectedTask })
      }
    }
  }

  const handleSpecificationChange = (value: string | undefined) => {
    if (!value) return

    try {
      // Validate JSON
      JSON.parse(value)
      setJsonError(null)
      setTaskSpec((prev) => ({ ...prev, specification: value }))
    } catch (error) {
      if (error instanceof Error) {
        setJsonError(t("common.invalidJson"))
      } else {
        setJsonError(t("common.invalidJson"))
      }
    }
  }

  const handleInputChange = (field: keyof TaskSpec, value: string) => {
    setTaskSpec((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddParameter = () => {
    if (!newParamKey.trim() || !newParamDescription.trim()) return
    if (taskSpec.parameters[newParamKey]) return // Don't add duplicate keys

    setTaskSpec((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [newParamKey.trim()]: {
          type: newParamType,
          description: newParamDescription.trim(),
          defaultValue: "",
        },
      },
    }))
    setNewParamKey("")
    setNewParamType("str")
    setNewParamDescription("")
  }

  const handleUpdateParameterType = (key: string, type: ParameterType) => {
    setTaskSpec((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: {
          ...prev.parameters[key],
          type: type,
        },
      },
    }))
  }

  const handleUpdateParameterDescription = (key: string, description: string) => {
    setTaskSpec((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: {
          ...prev.parameters[key],
          description: description,
        },
      },
    }))
  }

  const handleUpdateParameterDefaultValue = (key: string, defaultValue: string) => {
    setTaskSpec((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: {
          ...prev.parameters[key],
          defaultValue: defaultValue,
        },
      },
    }))
  }

  const handleDeleteParameter = (key: string) => {
    setTaskSpec((prev) => {
      const newParameters = { ...prev.parameters }
      delete newParameters[key]
      return {
        ...prev,
        parameters: newParameters,
      }
    })
  }

  const handleSave = () => {
    if (!taskSpec.name) {
      alert(t("taskEditor.errors.nameRequired"))
      return
    }

    // Here you would typically save to your backend
    console.log("Saving task template:", taskSpec)
    setSaveSuccess(true)

    // If this is a new task, add it to the available tasks
    if (!selectedTaskId || selectedTaskId === "new") {
      const newTask = {
        ...taskSpec,
        id: `task-${availableTasks.length + 1}`,
      }
      setAvailableTasks((prev) => [...prev, newTask])
      setSelectedTaskId(newTask.id)
    } else {
      // Update the existing task in the available tasks
      setAvailableTasks((prev) => prev.map((task) => (task.id === selectedTaskId ? { ...taskSpec } : task)))
    }
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string
          const parsed = JSON.parse(content)

          setTaskSpec({
            id: parsed.id || "",
            name: parsed.name || "",
            type: parsed.type || "monitor",
            category: parsed.category || "routine",
            description: parsed.description || "",
            specification: JSON.stringify(parsed.specification || {}, null, 2),
            parameters: parsed.parameters || {},
          })

          setJsonError(null)
        } catch (error) {
          setJsonError(t("taskEditor.errors.failedImport"))
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(taskSpec, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

      const exportFileName = `${taskSpec.name || "task"}_template_${new Date().toISOString().split("T")[0]}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileName)
      linkElement.click()
    } catch (error) {
      console.error(t("taskEditor.errors.exportFailed"), error)
    }
  }

  const getCategoryDisplayText = (category: TaskCategory) => {
    return category === "routine" ? t("taskEditor.categoryOptions.routine") : t("taskEditor.categoryOptions.oneTime")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            className="text-xs h-7"
            aria-label={t("taskEditor.import")}
          >
            <Upload className="h-3 w-3 mr-1" />
            {t("taskEditor.import")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="text-xs h-7"
            aria-label={t("taskEditor.export")}
          >
            <Download className="h-3 w-3 mr-1" />
            {t("taskEditor.export")}
          </Button>
        </div>
        <Button
          className="bg-[#6C47FF] hover:bg-[#5A3CD7] h-7 text-xs px-6"
          onClick={handleSave}
          disabled={!!jsonError}
          aria-label={saveSuccess ? t("taskEditor.templateSaved") : t("taskEditor.saveTemplate")}
        >
          {saveSuccess ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              {t("taskEditor.templateSaved")}
            </>
          ) : (
            <>
              <Save className="h-3 w-3 mr-1" />
              {t("taskEditor.saveTemplate")}
            </>
          )}
        </Button>
      </div>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t("taskEditor.templateProperties")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="task-select" className="w-16 flex-shrink-0 text-xs">
                {t("taskEditor.template")}
              </Label>
              <Select value={selectedTaskId} onValueChange={handleTaskSelection}>
                <SelectTrigger id="task-select" className="flex-1 h-7 text-xs">
                  <SelectValue placeholder={t("taskEditor.selectTaskTemplate")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new" className="text-xs">
                    {t("taskEditor.createNewTemplate")}
                  </SelectItem>
                  {availableTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id} className="text-xs">
                      {task.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="task-name" className="w-16 flex-shrink-0 text-xs">
                {t("taskEditor.name")}
              </Label>
              <Input
                id="task-name"
                value={taskSpec.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("taskEditor.templateNamePlaceholder")}
                className="flex-1 h-7 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="task-type" className="w-16 flex-shrink-0 text-xs">
                {t("taskEditor.type")}
              </Label>
              <Select value={taskSpec.type} onValueChange={(value) => handleInputChange("type", value as TaskType)}>
                <SelectTrigger id="task-type" className="flex-1 h-7 text-xs">
                  <SelectValue placeholder={t("taskEditor.typePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monitor" className="text-xs">
                    {t("taskEditor.typeOptions.monitor")}
                  </SelectItem>
                  <SelectItem value="ingest" className="text-xs">
                    {t("taskEditor.typeOptions.ingest")}
                  </SelectItem>
                  <SelectItem value="analyze" className="text-xs">
                    {t("taskEditor.typeOptions.analyze")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="task-category" className="w-16 flex-shrink-0 text-xs">
                {t("taskEditor.category")}
              </Label>
              <div className="flex-1 h-7 px-3 py-1 text-xs bg-gray-50 border border-gray-200 rounded-md flex items-center">
                {getCategoryDisplayText(taskSpec.category)}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Label htmlFor="task-description" className="w-16 flex-shrink-0 mt-1 text-xs">
                {t("taskEditor.description")}
              </Label>
              <Textarea
                id="task-description"
                value={taskSpec.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder={t("taskEditor.templateDescriptionPlaceholder")}
                rows={2}
                className="flex-1 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t("taskEditor.taskParameters")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2">
              <Input
                value={newParamKey}
                onChange={(e) => setNewParamKey(e.target.value)}
                placeholder={t("taskEditor.parameterKey")}
                className="col-span-3 h-7 text-xs"
              />
              <Select value={newParamType} onValueChange={(value) => setNewParamType(value as ParameterType)}>
                <SelectTrigger className="col-span-2 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="str" className="text-xs">
                    String
                  </SelectItem>
                  <SelectItem value="int" className="text-xs">
                    Integer
                  </SelectItem>
                  <SelectItem value="float" className="text-xs">
                    Float
                  </SelectItem>
                  <SelectItem value="bool" className="text-xs">
                    Boolean
                  </SelectItem>
                  <SelectItem value="datetime" className="text-xs">
                    DateTime
                  </SelectItem>
                  <SelectItem value="json" className="text-xs">
                    JSON
                  </SelectItem>
                  <SelectItem value="file" className="text-xs">
                    File
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={newParamDescription}
                onChange={(e) => setNewParamDescription(e.target.value)}
                placeholder="Parameter description"
                className="col-span-6 h-7 text-xs"
              />
              <Button
                onClick={handleAddParameter}
                disabled={!newParamKey.trim() || !newParamDescription.trim()}
                size="sm"
                className="col-span-1 h-7 px-3"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="border rounded-md">
              {Object.keys(taskSpec.parameters).length > 0 ? (
                <div className="divide-y">
                  {Object.entries(taskSpec.parameters).map(([key, param]) => (
                    <div key={key} className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="w-20 flex-shrink-0 text-xs font-medium">{key}</Label>
                        <Select
                          value={param.type}
                          onValueChange={(value) => handleUpdateParameterType(key, value as ParameterType)}
                        >
                          <SelectTrigger className="w-24 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="str" className="text-xs">
                              String
                            </SelectItem>
                            <SelectItem value="int" className="text-xs">
                              Integer
                            </SelectItem>
                            <SelectItem value="float" className="text-xs">
                              Float
                            </SelectItem>
                            <SelectItem value="bool" className="text-xs">
                              Boolean
                            </SelectItem>
                            <SelectItem value="datetime" className="text-xs">
                              DateTime
                            </SelectItem>
                            <SelectItem value="json" className="text-xs">
                              JSON
                            </SelectItem>
                            <SelectItem value="file" className="text-xs">
                              File
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={param.defaultValue || ""}
                          onChange={(e) => handleUpdateParameterDefaultValue(key, e.target.value)}
                          placeholder="Default value"
                          className="flex-1 h-7 text-xs"
                        />
                        <Button
                          onClick={() => handleDeleteParameter(key)}
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="w-20 flex-shrink-0 text-xs text-gray-500">Description:</Label>
                        <Input
                          value={param.description}
                          onChange={(e) => handleUpdateParameterDescription(key, e.target.value)}
                          placeholder="Parameter description"
                          className="flex-1 h-7 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-xs">{t("taskEditor.noParametersDefined")}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t("taskEditor.taskSpecification")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] border rounded-md overflow-hidden">
            <MonacoEditor
              height="100%"
              defaultLanguage="json"
              value={taskSpec.specification}
              onChange={handleSpecificationChange}
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                formatOnPaste: true,
                formatOnType: true,
                lineNumbers: "on",
                lineNumbersMinChars: 3,
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersWidth: 1,
                padding: { top: 4, bottom: 4 },
              }}
              aria-label={t("taskEditor.taskSpecification")}
            />
          </div>
          {jsonError && <p className="text-red-500 text-xs mt-2">{jsonError}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
