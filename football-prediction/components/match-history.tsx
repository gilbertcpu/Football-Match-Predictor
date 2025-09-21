import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"

const mockMatches = [
  {
    id: 1,
    date: "2024-01-15",
    opponent: "Liverpool",
    venue: "Home",
    result: "W",
    score: "2-1",
    prediction: "W",
    confidence: 78,
  },
  {
    id: 2,
    date: "2024-01-08",
    opponent: "Arsenal",
    venue: "Away",
    result: "D",
    score: "1-1",
    prediction: "D",
    confidence: 65,
  },
  {
    id: 3,
    date: "2024-01-01",
    opponent: "Chelsea",
    venue: "Home",
    result: "L",
    score: "0-2",
    prediction: "W",
    confidence: 72,
  },
  {
    id: 4,
    date: "2023-12-28",
    opponent: "Tottenham",
    venue: "Away",
    result: "W",
    score: "3-1",
    prediction: "W",
    confidence: 85,
  },
]

export function MatchHistory() {
  const getResultColor = (result: string) => {
    switch (result) {
      case "W":
        return "success"
      case "D":
        return "secondary"
      case "L":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPredictionAccuracy = () => {
    const correct = mockMatches.filter((match) => match.result === match.prediction).length
    return Math.round((correct / mockMatches.length) * 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Predictions</CardTitle>
        <CardDescription>
          Model accuracy: {getPredictionAccuracy()}% over last {mockMatches.length} matches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockMatches.map((match) => (
            <div key={match.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{match.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    vs {match.opponent} ({match.venue})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-medium">{match.score}</div>
                  <div className="text-xs text-gray-500">{match.confidence}% conf.</div>
                </div>
                <Badge
                  className={
                    match.result === "W"
                      ? "bg-green-500 hover:bg-green-600"
                      : match.result === "D"
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-red-500 hover:bg-red-600"
                  }
                >
                  {match.result}
                </Badge>
                {match.result === match.prediction ? (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center border border-green-500 text-green-500">
                    ✓
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center border border-red-500 text-red-500">
                    ✗
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
