import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface PredictionResult {
  prediction: number
  probabilities: {
    loss: number
    draw: number
    win: number
  }
  confidence: number
}

interface PredictionChartProps {
  prediction: PredictionResult
}

export function PredictionChart({ prediction }: PredictionChartProps) {
  const data = [
    {
      outcome: "Loss",
      probability: prediction.probabilities.loss,
      fill: "#ef4444", // Red
    },
    {
      outcome: "Draw",
      probability: prediction.probabilities.draw,
      fill: "#64748b", // Slate
    },
    {
      outcome: "Win",
      probability: prediction.probabilities.win,
      fill: "#22c55e", // Green
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Probabilities</CardTitle>
        <CardDescription>Visual breakdown of match outcome probabilities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="outcome" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value) => [`${value}%`, "Probability"]}
                contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
              <Bar dataKey="probability" radius={[4, 4, 0, 0]} name="Probability" isAnimationActive={true}>
                {data.map((entry, index) => (
                  <rect key={`rect-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
