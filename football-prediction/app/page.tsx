"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trophy, Target, TrendingUp, Calendar, MapPin, Users, Clock } from "lucide-react"
import { PredictionChart } from "@/components/prediction-chart"
import { MatchHistory } from "@/components/match-history"

interface MatchData {
  opponent: string
  venue: string
  xg: number
  xga: number
  captain: string
  formation: string
  team: string
  date: string
  time: string
}

interface PredictionResult {
  prediction: number
  probabilities: {
    loss: number
    draw: number
    win: number
  }
  confidence: number
}

export default function FootballPredictor() {
  const [matchData, setMatchData] = useState<MatchData>({
    opponent: "",
    venue: "Home",
    xg: 1.5,
    xga: 1.2,
    captain: "",
    formation: "4-3-3",
    team: "",
    date: new Date().toISOString().split("T")[0],
    time: "15:00",
  })

  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePredict = async () => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock prediction based on input data (simulating XGBoost model)
    const mockPrediction = generateMockPrediction(matchData)
    setPrediction(mockPrediction)
    setIsLoading(false)
  }

  // Replace the generateMockPrediction function with this improved version
  const generateMockPrediction = (data: MatchData): PredictionResult => {
    // Start with base probabilities
    let winProb = 0.33
    let drawProb = 0.33
    let lossProb = 0.34

    // Apply more significant adjustments based on input features
    if (data.venue === "Home") winProb += 0.15
    else lossProb += 0.1

    if (data.xg > data.xga + 0.5) winProb += 0.2
    else if (data.xga > data.xg + 0.5) lossProb += 0.2

    // Adjust based on formation
    if (data.formation === "4-3-3" || data.formation === "4-2-3-1") winProb += 0.05
    if (data.formation === "5-3-2" || data.formation === "3-5-2") drawProb += 0.05

    // Normalize probabilities
    const total = winProb + drawProb + lossProb
    winProb = winProb / total
    drawProb = drawProb / total
    lossProb = lossProb / total

    const maxProb = Math.max(winProb, drawProb, lossProb)
    let prediction = 2 // Win
    if (maxProb === drawProb) prediction = 1 // Draw
    if (maxProb === lossProb) prediction = 0 // Loss

    return {
      prediction,
      probabilities: {
        win: Math.round(winProb * 100),
        draw: Math.round(drawProb * 100),
        loss: Math.round(lossProb * 100),
      },
      confidence: Math.round(maxProb * 100),
    }
  }

  const getResultLabel = (pred: number) => {
    switch (pred) {
      case 0:
        return "Loss"
      case 1:
        return "Draw"
      case 2:
        return "Win"
      default:
        return "Unknown"
    }
  }

  const getResultColor = (pred: number) => {
    switch (pred) {
      case 0:
        return "destructive"
      case 1:
        return "secondary"
      case 2:
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Football Match Predictor</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Predict football match outcomes using advanced XGBoost machine learning model trained on Premier League data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Match Details
                </CardTitle>
                <CardDescription>Enter the match parameters to get a prediction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="team">Team</Label>
                    <Input
                      id="team"
                      placeholder="e.g., Manchester United"
                      value={matchData.team}
                      onChange={(e) => setMatchData({ ...matchData, team: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="opponent">Opponent</Label>
                    <Input
                      id="opponent"
                      placeholder="e.g., Liverpool"
                      value={matchData.opponent}
                      onChange={(e) => setMatchData({ ...matchData, opponent: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Select
                      value={matchData.venue}
                      onValueChange={(value) => setMatchData({ ...matchData, venue: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Away">Away</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={matchData.date}
                      onChange={(e) => setMatchData({ ...matchData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={matchData.time}
                      onChange={(e) => setMatchData({ ...matchData, time: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Expected Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="xg">Expected Goals (xG)</Label>
                      <Input
                        id="xg"
                        type="number"
                        step="0.1"
                        value={matchData.xg}
                        onChange={(e) => setMatchData({ ...matchData, xg: Number.parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="xga">Expected Goals Against (xGA)</Label>
                      <Input
                        id="xga"
                        type="number"
                        step="0.1"
                        value={matchData.xga}
                        onChange={(e) => setMatchData({ ...matchData, xga: Number.parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Team Setup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="formation">Formation</Label>
                      <Select
                        value={matchData.formation}
                        onValueChange={(value) => setMatchData({ ...matchData, formation: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4-3-3">4-3-3</SelectItem>
                          <SelectItem value="4-4-2">4-4-2</SelectItem>
                          <SelectItem value="3-5-2">3-5-2</SelectItem>
                          <SelectItem value="4-2-3-1">4-2-3-1</SelectItem>
                          <SelectItem value="3-4-3">3-4-3</SelectItem>
                          <SelectItem value="5-3-2">5-3-2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="captain">Captain</Label>
                      <Input
                        id="captain"
                        placeholder="e.g., Harry Kane"
                        value={matchData.captain}
                        onChange={(e) => setMatchData({ ...matchData, captain: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={isLoading || !matchData.team || !matchData.opponent}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? "Predicting..." : "Predict Match Result"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {prediction && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Prediction Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-2">
                    <Badge variant={getResultColor(prediction.prediction)} className="text-lg px-4 py-2">
                      {getResultLabel(prediction.prediction)}
                    </Badge>
                    <p className="text-sm text-gray-600">Confidence: {prediction.confidence}%</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">Probability Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Win</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all duration-500"
                              style={{ width: `${prediction.probabilities.win}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{prediction.probabilities.win}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Draw</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-500 transition-all duration-500"
                              style={{ width: `${prediction.probabilities.draw}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{prediction.probabilities.draw}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Loss</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 transition-all duration-500"
                              style={{ width: `${prediction.probabilities.loss}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{prediction.probabilities.loss}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Match Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{matchData.venue} venue</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>
                    {matchData.date} at {matchData.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>Formation: {matchData.formation}</span>
                </div>
                {matchData.captain && (
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 text-gray-500" />
                    <span>Captain: {matchData.captain}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Expected Goals</span>
                  <span className="font-medium">{matchData.xg}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expected Goals Against</span>
                  <span className="font-medium">{matchData.xga}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Components */}
        {prediction && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <PredictionChart prediction={prediction} />
            </div>
            <div>
              <MatchHistory />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
