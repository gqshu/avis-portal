export type TaskEngine = {
  hostname: string
  ip: string
  status: "connected" | "unknown" | "disconnected"
  type: "vsi" | "modelplus" | "roboflow"
}

export type VideoSource = {
  id: string
  uri: string
  type?: "camera" | "file"
  ingestion_config: any
}

export type Model = {
  id: string
  name: string
  type: string
  config: any
}

export type Tool = {
  id: string
  name: string
  description: string
  config: any
}

export type AgentRuntimeConfig = {
  engines: TaskEngine[]
  storage: {
    db_config: any
    oss_config: any
    redis_config: any
  }
  dialog: {
    llm_model: string
    llm_config: any
    models?: Array<{ name: string; config: any }>
  }
  video_sources: VideoSource[]
  models: Model[]
  tools: Tool[]
}
