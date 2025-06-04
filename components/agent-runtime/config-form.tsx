"use client"

import type React from "react"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ConfigFormProps {
  title: string
  config: any
  onSave: (config: any) => void
  onCancel: () => void
}

export function ConfigForm({ title, config, onSave, onCancel }: ConfigFormProps) {
  const { t } = useI18n()

  // For storage config
  const [dbConfigJson, setDbConfigJson] = useState<string>(JSON.stringify(config.db_config || {}, null, 2))
  const [ossConfigJson, setOssConfigJson] = useState<string>(JSON.stringify(config.oss_config || {}, null, 2))
  const [redisConfigJson, setRedisConfigJson] = useState<string>(JSON.stringify(config.redis_config || {}, null, 2))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Parse JSON for storage config
      const dbConfig = JSON.parse(dbConfigJson)
      const ossConfig = JSON.parse(ossConfigJson)
      const redisConfig = JSON.parse(redisConfigJson)

      onSave({
        db_config: dbConfig,
        oss_config: ossConfig,
        redis_config: redisConfig,
      })
    } catch (error) {
      // Only show error when trying to save
      alert(t("common.invalidJson"))
    }
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
        <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-auto space-y-4">
        <div className="space-y-1">
          <Label htmlFor="db_config" className="text-xs">
            {t("agentRuntime.storage.dbConfig")}
          </Label>
          <Textarea
            id="db_config"
            value={dbConfigJson}
            onChange={(e) => setDbConfigJson(e.target.value)}
            className="font-mono text-xs h-32"
            placeholder={t("agentRuntime.storage.dbConfigPlaceholder")}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="oss_config" className="text-xs">
            {t("agentRuntime.storage.ossConfig")}
          </Label>
          <Textarea
            id="oss_config"
            value={ossConfigJson}
            onChange={(e) => setOssConfigJson(e.target.value)}
            className="font-mono text-xs h-32"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="redis_config" className="text-xs">
            {t("agentRuntime.storage.redisConfig")}
          </Label>
          <Textarea
            id="redis_config"
            value={redisConfigJson}
            onChange={(e) => setRedisConfigJson(e.target.value)}
            className="font-mono text-xs h-32"
          />
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
