import { type NextRequest, NextResponse } from "next/server"

// This would be where you'd integrate with your actual XGBoost model
// For now, we'll simulate the prediction logic

interface MatchFeatures {
  opponent_freq: number
  venue_Home: number
  xg: number
  xga: number
  captain_freq: number
  formation_freq: number
  team_freq: number
}

export async function POST(request: NextRequest) {
  try {
    const matchData = await request.json()

    // Simulate the preprocessing pipeline from your Python script
    const features = preprocessMatchData(matchData)

    // Simulate XGBoost prediction
    const prediction = simulateXGBoostPrediction(features)

    return NextResponse.json({
      success: true,
      prediction: prediction.class,
      probabilities: prediction.probabilities,
      confidence: Math.max(...Object.values(prediction.probabilities)),
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ success: false, error: "Prediction failed" }, { status: 500 })
  }
}

function preprocessMatchData(data: any): MatchFeatures {
  // Simulate the preprocessing steps from your Python script
  // In a real implementation, you'd need to:
  // 1. Apply the same frequency encoding for categorical variables
  // 2. Apply the same StandardScaler transformation
  // 3. Ensure feature order matches training data

  return {
    opponent_freq: getOpponentFrequency(data.opponent),
    venue_Home: data.venue === "Home" ? 1 : 0,
    xg: Number.parseFloat(data.xg),
    xga: Number.parseFloat(data.xga),
    captain_freq: getCaptainFrequency(data.captain),
    formation_freq: getFormationFrequency(data.formation),
    team_freq: getTeamFrequency(data.team),
  }
}

function simulateXGBoostPrediction(features: MatchFeatures) {
  // Simulate XGBoost prediction logic
  // This is a simplified version - in reality you'd load your trained model

  let winProb = 0.33
  let drawProb = 0.33
  let lossProb = 0.34

  // Apply feature-based adjustments (simplified heuristics)
  if (features.venue_Home === 1) winProb += 0.1
  if (features.xg > features.xga) winProb += 0.15

  // Normalize probabilities
  const total = winProb + drawProb + lossProb
  winProb /= total
  drawProb /= total
  lossProb /= total

  const probabilities = {
    loss: Math.round(lossProb * 100),
    draw: Math.round(drawProb * 100),
    win: Math.round(winProb * 100),
  }

  // Determine predicted class
  const maxProb = Math.max(winProb, drawProb, lossProb)
  let predictedClass = 2 // Win
  if (maxProb === drawProb) predictedClass = 1 // Draw
  if (maxProb === lossProb) predictedClass = 0 // Loss

  return {
    class: predictedClass,
    probabilities,
  }
}

// Helper functions to simulate frequency encoding
// In a real implementation, these would use the actual frequency mappings from training
function getOpponentFrequency(opponent: string): number {
  const frequencies: { [key: string]: number } = {
    Liverpool: 38,
    "Manchester City": 38,
    Arsenal: 38,
    Chelsea: 38,
    Tottenham: 38,
    "Manchester United": 38,
    Newcastle: 38,
  }
  return frequencies[opponent] || 20 // Default frequency
}

function getCaptainFrequency(captain: string): number {
  return captain ? 15 : 5 // Simplified frequency
}

function getFormationFrequency(formation: string): number {
  const frequencies: { [key: string]: number } = {
    "4-3-3": 150,
    "4-4-2": 120,
    "3-5-2": 80,
    "4-2-3-1": 100,
    "3-4-3": 90,
    "5-3-2": 60,
  }
  return frequencies[formation] || 50
}

function getTeamFrequency(team: string): number {
  return team ? 38 : 20 // Simplified frequency
}
