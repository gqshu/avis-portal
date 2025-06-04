"use client"

import { useState } from "react"
import { Cpu, Camera, Database, Wrench, Plus, Trash2, MessageSquare } from "lucide-react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TaskEngineForm } from "./task-engine-form"
import { VideoSourceForm } from "./video-source-form"
import { ConfigForm } from "./config-form"
import type { AgentRuntimeConfig, TaskEngine, VideoSource } from "@/lib/types/runtime"

// Sample data
const sampleAgentRuntime: AgentRuntimeConfig = {
  engines: [
    { hostname: "engine-01", ip: "192.168.1.101", status: "connected", type: "vsi" },
    { hostname: "engine-02", ip: "192.168.1.102", status: "disconnected", type: "modelplus" },
    { hostname: "engine-03", ip: "192.168.1.103", status: "unknown", type: "roboflow" },
  ],
  storage: {
    db_config: {
      host: "db.example.com",
      port: 5432,
      username: "agent_user",
      database: "agent_db",
    },
    oss_config: {
      endpoint: "oss.example.com",
      bucket: "agent-data",
      region: "us-west-1",
    },
    redis_config: {
      host: "redis.example.com",
      port: 6379,
      db: 0,
    },
  },
  dialog: {
    llm_model: "gpt-4",
    llm_config: {
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
    },
    models: [
      {
        name: "gpt-4",
        config: {
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 0.9,
        },
      },
      {
        name: "gpt-3.5-turbo",
        config: {
          temperature: 0.9,
          max_tokens: 2048,
          top_p: 1.0,
        },
      },
    ],
  },
  video_sources: [
    {
      id: "cam-01",
      uri: "rtsp://192.168.1.201/stream1",
      type: "camera",
      ingestion_config: { fps: 15, resolution: "720p" },
    },
    {
      id: "cam-02",
      uri: "rtsp://192.168.1.202/stream1",
      type: "camera",
      ingestion_config: { fps: 30, resolution: "1080p" },
    },
    { id: "file-01", uri: "/path/to/video.mp4", type: "file", ingestion_config: { loop: true } },
  ],
  models: [
    {
      id: "model-01",
      name: "Object Detection",
      type: "vision",
      config: { threshold: 0.5, classes: ["person", "car"] },
    },
    { id: "model-02", name: "Face Recognition", type: "vision", config: { threshold: 0.7 } },
  ],
  tools: [
    { id: "tool-01", name: "Image Analyzer", description: "Analyzes image content", config: { enabled: true } },
    { id: "tool-02", name: "Text Extractor", description: "Extracts text from images", config: { enabled: true } },
  ],
}

type EditingItem = {
  type: "engine" | "video" | "storage" | null
  id: string | null
  isNew: boolean
}

export function AgentRuntime() {
  const { t } = useI18n()
  const [runtimeConfig, setRuntimeConfig] = useState<AgentRuntimeConfig>(sampleAgentRuntime)
  const [editingItem, setEditingItem] = useState<EditingItem>({ type: null, id: null, isNew: false })

  const handleAddEngine = () => {
    setEditingItem({ type: "engine", id: null, isNew: true })
  }

  const handleEditEngine = (engineHostname: string) => {
    setEditingItem({ type: "engine", id: engineHostname, isNew: false })
  }

  const handleDeleteEngine = (engineHostname: string) => {
    setRuntimeConfig((prev) => ({
      ...prev,
      engines: prev.engines.filter((engine) => engine.hostname !== engineHostname),
    }))
  }

  const handleAddVideoSource = () => {
    setEditingItem({ type: "video", id: null, isNew: true })
  }

  const handleEditVideoSource = (sourceId: string) => {
    setEditingItem({ type: "video", id: sourceId, isNew: false })
  }

  const handleDeleteVideoSource = (sourceId: string) => {
    setRuntimeConfig((prev) => ({
      ...prev,
      video_sources: prev.video_sources.filter((source) => source.id !== sourceId),
    }))
  }

  const handleEditStorage = () => {
    setEditingItem({ type: "storage", id: null, isNew: false })
  }

  const handleSaveEngine = (engine: TaskEngine) => {
    setRuntimeConfig((prev) => {
      if (editingItem.isNew) {
        return {
          ...prev,
          engines: [...prev.engines, engine],
        }
      } else {
        return {
          ...prev,
          engines: prev.engines.map((e) => (e.hostname === engine.hostname ? engine : e)),
        }
      }
    })
    setEditingItem({ type: null, id: null, isNew: false })
  }

  const handleSaveVideoSource = (source: VideoSource) => {
    setRuntimeConfig((prev) => {
      if (editingItem.isNew) {
        return {
          ...prev,
          video_sources: [...prev.video_sources, source],
        }
      } else {
        return {
          ...prev,
          video_sources: prev.video_sources.map((s) => (s.id === source.id ? source : s)),
        }
      }
    })
    setEditingItem({ type: null, id: null, isNew: false })
  }

  const handleSaveStorage = (storage: { db_config: any; oss_config: any; redis_config: any }) => {
    setRuntimeConfig((prev) => ({
      ...prev,
      storage,
    }))
    setEditingItem({ type: null, id: null, isNew: false })
  }

  const handleCancelEdit = () => {
    setEditingItem({ type: null, id: null, isNew: false })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "disconnected":
        return "bg-red-100 text-red-800"
      case "unknown":
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getStatusText = (status: string) => {
    return t(`agentRuntime.engines.statuses.${status}`)
  }

  const renderRightPanel = () => {
    if (!editingItem.type) return null

    switch (editingItem.type) {
      case "engine":
        const engineToEdit = editingItem.isNew
          ? { hostname: "", ip: "", status: "unknown", type: "vsi" }
          : runtimeConfig.engines.find((e) => e.hostname === editingItem.id) || {
              hostname: "",
              ip: "",
              status: "unknown",
              type: "vsi",
            }
        return (
          <TaskEngineForm
            engine={engineToEdit}
            onSave={handleSaveEngine}
            onCancel={handleCancelEdit}
            isNew={editingItem.isNew}
          />
        )
      case "video":
        const sourceToEdit = editingItem.isNew
          ? { id: "", uri: "", type: "camera", ingestion_config: {} }
          : runtimeConfig.video_sources.find((s) => s.id === editingItem.id) || {
              id: "",
              uri: "",
              type: "camera",
              ingestion_config: {},
            }
        return (
          <VideoSourceForm
            source={sourceToEdit}
            onSave={handleSaveVideoSource}
            onCancel={handleCancelEdit}
            isNew={editingItem.isNew}
          />
        )
      case "storage":
        return (
          <ConfigForm
            title={t("agentRuntime.storage.title")}
            config={runtimeConfig.storage}
            onSave={handleSaveStorage}
            onCancel={handleCancelEdit}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 p-4 overflow-auto">
        {/* Task Engines Section */}
        <Card className="mb-4">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <Cpu className="h-4 w-4 mr-2" />
              {t("agentRuntime.engines.title")}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddEngine} className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              {t("agentRuntime.engines.add")}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {runtimeConfig.engines.map((engine) => (
                <div
                  key={engine.hostname}
                  className="flex items-center justify-between p-2 rounded-md border hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="flex items-center mr-3">
                      <Cpu className="h-3 w-3 mr-1" />
                      <span className="text-xs font-medium">{engine.hostname}</span>
                    </div>
                    <span className="text-xs text-gray-500 mr-3">{engine.ip}</span>
                    <Badge variant="outline" className={`${getStatusColor(engine.status)} border-0 text-xs`}>
                      {getStatusText(engine.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEngine(engine.hostname)}
                      className="h-6 w-6 p-0"
                      aria-label={t("agentRuntime.engines.edit")}
                    >
                      <span className="sr-only">{t("agentRuntime.engines.edit")}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEngine(engine.hostname)}
                      className="h-6 w-6 p-0 text-red-500"
                      aria-label={t("agentRuntime.engines.delete")}
                    >
                      <span className="sr-only">Delete</span>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {runtimeConfig.engines.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-xs">{t("agentRuntime.engines.empty")}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Video Sources Section */}
        <Card className="mb-4">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <Camera className="h-4 w-4 mr-2" />
              {t("agentRuntime.videoSources.title")}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddVideoSource} className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              {t("agentRuntime.videoSources.add")}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {runtimeConfig.video_sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between p-2 rounded-md border hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="text-xs font-medium mr-2">{source.id}</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-0 text-xs">
                        {source.type || "camera"}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{source.uri}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditVideoSource(source.id)}
                      className="h-6 w-6 p-0"
                      aria-label={t("agentRuntime.videoSources.edit")}
                    >
                      <span className="sr-only">{t("agentRuntime.videoSources.edit")}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteVideoSource(source.id)}
                      className="h-6 w-6 p-0 text-red-500"
                      aria-label={t("agentRuntime.videoSources.delete")}
                    >
                      <span className="sr-only">Delete</span>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {runtimeConfig.video_sources.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-xs">{t("agentRuntime.videoSources.empty")}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Storage Section */}
        <Card className="mb-4">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <Database className="h-4 w-4 mr-2" />
              {t("agentRuntime.storage.title")}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleEditStorage} className="h-7 text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 mr-1"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              {t("agentRuntime.storage.edit")}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Database Config */}
              <div className="rounded-md border p-2">
                <h4 className="text-xs font-medium mb-2">{t("agentRuntime.storage.db")}</h4>
                <div className="space-y-1">
                  {Object.entries(runtimeConfig.storage.db_config).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <span className="text-xs text-gray-500 w-24">{key}:</span>
                      <span className="text-xs font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Object Storage Config */}
              <div className="rounded-md border p-2">
                <h4 className="text-xs font-medium mb-2">{t("agentRuntime.storage.oss")}</h4>
                <div className="space-y-1">
                  {Object.entries(runtimeConfig.storage.oss_config).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <span className="text-xs text-gray-500 w-24">{key}:</span>
                      <span className="text-xs font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Redis Config */}
              <div className="rounded-md border p-2">
                <h4 className="text-xs font-medium mb-2">{t("agentRuntime.storage.redis")}</h4>
                <div className="space-y-1">
                  {Object.entries(runtimeConfig.storage.redis_config || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <span className="text-xs text-gray-500 w-24">{key}:</span>
                      <span className="text-xs font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialog Section */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              {t("agentRuntime.dialog.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* List all models without distinguishing LLM */}
              {runtimeConfig.dialog.models && runtimeConfig.dialog.models.length > 0 ? (
                runtimeConfig.dialog.models.map((model, index) => (
                  <div key={index} className="rounded-md border p-2">
                    <div className="flex items-center mb-2">
                      <span className="text-xs font-medium">{model.name}</span>
                    </div>
                    <div className="space-y-1">
                      {Object.entries(model.config || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center">
                          <span className="text-xs text-gray-500 w-24">{key}:</span>
                          <span className="text-xs font-mono">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 text-xs">{t("agentRuntime.dialog.noModels")}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Models and Tools Section */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Wrench className="h-4 w-4 mr-2" />
              {t("agentRuntime.modelsTools.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="models" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="models" className="text-xs">
                  {t("agentRuntime.modelsTools.models")}
                </TabsTrigger>
                <TabsTrigger value="tools" className="text-xs">
                  {t("agentRuntime.modelsTools.tools")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="models" className="pt-2">
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {runtimeConfig.models.map((model) => (
                      <div key={model.id} className="rounded-md border p-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <span className="text-xs font-medium">{model.name}</span>
                            <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800 border-0 text-xs">
                              {model.type}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{model.id}</span>
                        </div>
                        <div className="space-y-1 mt-2">
                          {Object.entries(model.config).map(([key, value]) => (
                            <div key={key} className="flex items-center">
                              <span className="text-xs text-gray-500 w-24">{key}:</span>
                              <span className="text-xs font-mono">
                                {typeof value === "object" ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="tools" className="pt-2">
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {runtimeConfig.tools.map((tool) => (
                      <div key={tool.id} className="rounded-md border p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{tool.name}</span>
                          <span className="text-xs text-gray-500">{tool.id}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{tool.description}</p>
                        <div className="space-y-1">
                          {Object.entries(tool.config).map(([key, value]) => (
                            <div key={key} className="flex items-center">
                              <span className="text-xs text-gray-500 w-24">{key}:</span>
                              <span className="text-xs font-mono">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel for Editing */}
      {editingItem.type && (
        <div className="w-[300px] flex-shrink-0 bg-white border-l border-gray-200 shadow-sm flex flex-col h-full overflow-auto">
          {renderRightPanel()}
        </div>
      )}
    </div>
  )
}
