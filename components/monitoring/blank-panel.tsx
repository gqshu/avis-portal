import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BlankPanelProps {
  title: string
}

export function BlankPanel({ title }: BlankPanelProps) {
  return (
    <div className="p-4 h-full overflow-auto">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[calc(100%-80px)]">
          <div className="text-center text-gray-500">
            <p>This panel is under development.</p>
            <p className="mt-2">Check back soon for updates!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
