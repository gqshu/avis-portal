"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Plus, Trash2, Edit, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/lib/i18n/i18n-context"
import type { TaskSpec } from "@/lib/types/task"

// Sample tasks for the list
const sampleTasks: TaskSpec[] = [
  {
    id: "task-1",
    name: "Website Monitoring",
    type: "monitor",
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
  },
  {
    id: "task-2",
    name: "Data Ingestion Pipeline",
    type: "ingest",
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
  },
  {
    id: "task-3",
    name: "Performance Analysis",
    type: "analyze",
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
  },
  {
    id: "task-4",
    name: "Error Tracking",
    type: "monitor",
    description: "Track and report application errors",
    specification: JSON.stringify(
      {
        sources: ["logs", "exceptions"],
        threshold: 5,
        notification: "slack",
      },
      null,
      2,
    ),
  },
  {
    id: "task-5",
    name: "User Activity Analysis",
    type: "analyze",
    description: "Analyze user behavior and activity patterns",
    specification: JSON.stringify(
      {
        metrics: ["pageViews", "clickRate", "sessionDuration"],
        period: "daily",
        segments: ["newUsers", "returningUsers"],
      },
      null,
      2,
    ),
  },
]

export function TaskManagement() {
  const { t } = useI18n()
  const [tasks, setTasks] = useState<TaskSpec[]>(sampleTasks)
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([])
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskName, setEditingTaskName] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus the input when editing starts
  useEffect(() => {
    if (editingTaskId && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingTaskId])

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskIds((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId)
      } else {
        return [...prev, taskId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedTaskIds.length === tasks.length) {
      setSelectedTaskIds([])
    } else {
      setSelectedTaskIds(tasks.map((task) => task.id!))
    }
  }

  const handleDeleteSelected = () => {
    setTasks((prev) => prev.filter((task) => !selectedTaskIds.includes(task.id!)))
    setSelectedTaskIds([])
    // If we're editing a task that's being deleted, cancel the edit
    if (editingTaskId && selectedTaskIds.includes(editingTaskId)) {
      setEditingTaskId(null)
    }
  }

  const handleCreateTask = () => {
    const newTaskId = `task-${Date.now()}`
    const newTask: TaskSpec = {
      id: newTaskId,
      name: t("taskManagement.newTaskDefaultName"),
      type: "monitor",
      description: t("taskManagement.newTaskDefaultDescription"),
      specification: JSON.stringify({ rules: [], actions: [] }, null, 2),
    }
    setTasks((prev) => [...prev, newTask])

    // Start editing the new task name immediately
    setEditingTaskId(newTaskId)
    setEditingTaskName(newTask.name)
  }

  const startEditing = (taskId: string, currentName: string) => {
    setEditingTaskId(taskId)
    setEditingTaskName(currentName)
  }

  const saveTaskName = () => {
    if (!editingTaskId) return

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === editingTaskId) {
          return { ...task, name: editingTaskName.trim() || t("taskManagement.unnamedTask") }
        }
        return task
      }),
    )
    setEditingTaskId(null)
  }

  const cancelEditing = () => {
    setEditingTaskId(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveTaskName()
    } else if (e.key === "Escape") {
      cancelEditing()
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "monitor":
        return "bg-blue-100 text-blue-800"
      case "ingest":
        return "bg-green-100 text-green-800"
      case "analyze":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={selectedTaskIds.length === 0}
            className="text-xs h-7"
            aria-label={t("taskManagement.delete")}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            {t("taskManagement.delete")}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleCreateTask}
            className="text-xs h-7 bg-[#6C47FF] hover:bg-[#5A3CD7]"
            aria-label={t("taskManagement.new")}
          >
            <Plus className="h-3 w-3 mr-1" />
            {t("taskManagement.new")}
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden flex-1">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 px-3 py-2 text-left">
                <Checkbox
                  checked={selectedTaskIds.length === tasks.length && tasks.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label={t("taskManagement.selectAll")}
                />
              </th>
              <th className="px-3 py-2 text-left font-medium">{t("taskManagement.name")}</th>
              <th className="px-3 py-2 text-left font-medium">{t("taskManagement.type")}</th>
              <th className="px-3 py-2 text-left font-medium">{t("taskManagement.description")}</th>
              <th className="w-16 px-3 py-2 text-center font-medium">{t("taskManagement.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tasks.map((task) => (
              <tr key={task.id} className={selectedTaskIds.includes(task.id!) ? "bg-gray-50" : "hover:bg-gray-50"}>
                <td className="px-3 py-2">
                  <Checkbox
                    checked={selectedTaskIds.includes(task.id!)}
                    onCheckedChange={() => handleSelectTask(task.id!)}
                    aria-label={`${t("taskManagement.select")} ${task.name}`}
                  />
                </td>
                <td className="px-3 py-2 font-medium">
                  {editingTaskId === task.id ? (
                    <div className="flex items-center gap-1">
                      <Input
                        ref={inputRef}
                        value={editingTaskName}
                        onChange={(e) => setEditingTaskName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-6 text-xs py-0 px-2 w-full max-w-[200px]"
                        aria-label={t("taskManagement.editName")}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={saveTaskName}
                        className="h-6 w-6 p-0 text-green-600"
                        aria-label={t("taskManagement.save")}
                      >
                        <Check className="h-3 w-3" />
                        <span className="sr-only">{t("taskManagement.save")}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                        className="h-6 w-6 p-0 text-red-600"
                        aria-label={t("taskManagement.cancel")}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">{t("taskManagement.cancel")}</span>
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="flex items-center cursor-pointer hover:underline"
                      onClick={() => startEditing(task.id!, task.name)}
                    >
                      {task.name}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2">
                  <Badge variant="outline" className={`${getTypeColor(task.type)} border-0`}>
                    {t(`taskEditor.typeOptions.${task.type}`)}
                  </Badge>
                </td>
                <td className="px-3 py-2 text-gray-600 truncate max-w-[300px]">{task.description}</td>
                <td className="px-3 py-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => startEditing(task.id!, task.name)}
                    aria-label={t("taskManagement.edit")}
                  >
                    <Edit className="h-3 w-3" />
                    <span className="sr-only">{t("taskManagement.edit")}</span>
                  </Button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                  {t("taskManagement.noTasks")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
