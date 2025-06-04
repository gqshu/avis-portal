"use client"

import { useRef, useEffect } from "react"
import { Editor as MonacoEditor, type EditorProps, loader } from "@monaco-editor/react"

// Configure Monaco to use a reliable CDN
loader.config({
  monaco: undefined, // Use the default loader
  // Don't try to load workers from our server
  // This will make Monaco fall back to using blob URLs which works in all environments
})

export function Editor(props: EditorProps) {
  const editorRef = useRef<any>(null)

  useEffect(() => {
    // This ensures the editor is properly sized when it's mounted
    const resizeObserver = new ResizeObserver(() => {
      if (editorRef.current) {
        editorRef.current.layout()
      }
    })

    const container = document.getElementById("monaco-editor-container")
    if (container) {
      resizeObserver.observe(container)
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container)
      }
    }
  }, [])

  return (
    <div id="monaco-editor-container" className="h-full w-full">
      <MonacoEditor
        onMount={(editor) => {
          editorRef.current = editor
          if (props.onMount) {
            props.onMount(editor)
          }
        }}
        options={{
          ...props.options,
          // Disable features that might cause worker issues
          minimap: { enabled: false },
          automaticLayout: true,
        }}
        {...props}
      />
    </div>
  )
}
