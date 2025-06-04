"use client"

import type React from "react"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TaskEngine } from "@/lib/types/runtime"

interface TaskEngineFormProps {
  engine: TaskEngine
  onSave: (engine: TaskEngine) => void
  onCancel: () => void
  isNew: boolean
}

export function TaskEngineForm({ engine, onSave, onCancel, isNew }: TaskEngineFormProps) {
  const { t } = useI18n()
  const [formData, setFormData] = useState<TaskEngine>({
    ...engine,
    // Keep the status as is, it will be managed by the backend
    status: engine.status || "unknown",
  })

  const handleChange = (field: keyof TaskEngine, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
        <h2 className="font-semibold text-gray-800 text-sm">
          {isNew ? t("agentRuntime.engines.add") : t("agentRuntime.engines.edit")}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="hostname" className="text-xs">
              {t("agentRuntime.engines.hostname")}
            </Label>
            <Input
              id="hostname"
              value={formData.hostname}
              onChange={(e) => handleChange("hostname", e.target.value)}
              className="h-7 text-xs"
              disabled={!isNew}
              required
              placeholder={t("agentRuntime.engines.hostnamePlaceholder")}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="ip" className="text-xs">
              {t("agentRuntime.engines.ip")}
            </Label>
            <Input
              id="ip"
              value={formData.ip}
              onChange={(e) => handleChange("ip", e.target.value)}
              className="h-7 text-xs"
              required
              placeholder={t("agentRuntime.engines.ipPlaceholder")}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="type" className="text-xs">
              {t("agentRuntime.engines.type")}
            </Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger id="type" className="h-7 text-xs">
                <SelectValue placeholder={t("agentRuntime.engines.selectType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vsi" className="text-xs">
                  {t("agentRuntime.engines.types.vsi")}
                </SelectItem>
                <SelectItem value="modelplus" className="text-xs">
                  {t("agentRuntime.engines.types.modelplus")}
                </SelectItem>
                <SelectItem value="roboflow" className="text-xs">
                  {t("agentRuntime.engines.types.roboflow")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>

      <div className="border-t border-gray-200 pt-3 mt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="h-7 text-xs">
          {t("common.cancel")}
        </Button>
        <Button type="submit" onClick={handleSubmit} className="h-7 text-xs bg-[#6C47FF] hover:bg-[#5A3CD7]">
          {t("common.save")}
        </Button>
      </div>
    </div>
  )
}
