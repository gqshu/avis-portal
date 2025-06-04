export type TaskType = "monitor" | "ingest" | "analyze"
export type TaskCategory = "routine" | "one-time"
export type ParameterType = "str" | "int" | "float" | "bool" | "datetime" | "json" | "file"

export interface TaskParameter {
  type: ParameterType
  description: string
  defaultValue?: string
}

export interface TaskSpec {
  id?: string
  name: string
  type: TaskType
  category: TaskCategory
  description: string
  specification: string // JSON string
  parameters: Record<string, TaskParameter> // Key-value pairs for task parameters with type and description
}
