export type AgentStatus = "active" | "disabled"

export type TaskStatus = "running" | "stopped" | "error"

export interface AgentTask {
  id: string
  name: string
  status: TaskStatus
  host: string
}

export interface Agent {
  id: string
  name: string
  description: string
  status: AgentStatus
  tasks: AgentTask[]
  config: any
  memory_schema: string[]
}
