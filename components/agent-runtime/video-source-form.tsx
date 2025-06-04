"use client"

import type React from "react"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { VideoSource } from "@/lib/types/runtime"

interface VideoSourceFormProps {
  source: VideoSource
  onSave: (source: VideoSource) => void
  onCancel: () => void
  isNew: boolean
}

export function VideoSourceForm({ source, onSave, onCancel, isNew }: VideoSourceFormProps) {
  const { t } = useI18n()
  const [formData, setFormData] = useState<VideoSource>({
    ...source,
    type: source.type || "camera", // Add default type if not present
  })
  const [configJson, setConfigJson] = useState<string>(JSON.stringify(source.ingestion_config || {}, null, 2))
  const [jsonError, setJsonError] = useState<string | null>(null)

  const handleChange = (field: keyof VideoSource, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleConfigChange = (value: string) => {
    setConfigJson(value)
    try {
      const parsed = JSON.parse(value)
      setFormData((prev) => ({ ...prev, ingestion_config: parsed }))
      setJsonError(null)
    } catch (error) {
      setJsonError(t("common.invalidJson"))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jsonError) {
      onSave(formData)
    }
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
        <h2 className="font-semibold text-gray-800 text-sm">
          {isNew ? t("agentRuntime.videoSources.add") : t("agentRuntime.videoSources.edit")}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="id" className="text-xs">
              {t("agentRuntime.videoSources.id")}
            </Label>
            <Input
              id="id"
              value={formData.id}
              onChange={(e) => handleChange("id", e.target.value)}
              className="h-7 text-xs"
              required
              placeholder={t("agentRuntime.videoSources.idPlaceholder")}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="type" className="text-xs">
              {t("agentRuntime.videoSources.type")}
            </Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger id="type" className="h-7 text-xs">
                <SelectValue placeholder={t("agentRuntime.videoSources.selectType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="camera" className="text-xs">
                  {t("agentRuntime.videoSources.types.camera")}
                </SelectItem>
                <SelectItem value="file" className="text-xs">
                  {t("agentRuntime.videoSources.types.file")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="uri" className="text-xs">
              {t("agentRuntime.videoSources.uri")}
            </Label>
            <Input
              id="uri"
              value={formData.uri}
              onChange={(e) => handleChange("uri", e.target.value)}
              className="h-7 text-xs"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="config" className="text-xs">
              {t("agentRuntime.videoSources.config")}
            </Label>
            <Textarea
              id="config"
              value={configJson}
              onChange={(e) => handleConfigChange(e.target.value)}
              className="font-mono text-xs h-32"
            />
            {jsonError && <p className="text-red-500 text-xs">{jsonError}</p>}
          </div>
        </div>
      </form>

      <div className="border-t border-gray-200 pt-3 mt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} className="h-7 text-xs">
          {t("common.cancel")}
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!!jsonError}
          className="h-7 text-xs bg-[#6C47FF] hover:bg-[#5A3CD7]"
        >
          {t("common.save")}
        </Button>
      </div>
    </div>
  )
}
