// api/federated.js — Vercel Serverless Function
// Simulates Federated Learning with FedAvg aggregation across 3 farmer clients

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // ── Simulated local training data per farmer ────────────────────────────────
  const farmers = [
    { id: "farmer_a", name: "Farmer Arjun", region: "Punjab", samples: 450, cropType: "Wheat" },
    { id: "farmer_b", name: "Farmer Priya",  region: "Maharashtra", samples: 320, cropType: "Cotton" },
    { id: "farmer_c", name: "Farmer Ravi",   region: "Tamil Nadu", samples: 510, cropType: "Rice" },
  ];

  // ── Simulate 5 rounds of federated training ─────────────────────────────────
  // Each round: local training improves accuracy, then FedAvg aggregates weights
  const rounds = [];

  const baseAccuracies = {
    farmer_a: 0.61,
    farmer_b: 0.57,
    farmer_c: 0.64,
  };

  const improvements = {
    farmer_a: [0.10, 0.07, 0.05, 0.04, 0.03],
    farmer_b: [0.12, 0.08, 0.05, 0.03, 0.02],
    farmer_c: [0.09, 0.07, 0.06, 0.04, 0.02],
  };

  const totalSamples = farmers.reduce((s, f) => s + f.samples, 0);

  for (let r = 0; r < 5; r++) {
    const clientResults = farmers.map((f) => {
      const acc =
        baseAccuracies[f.id] +
        improvements[f.id].slice(0, r + 1).reduce((a, b) => a + b, 0);

      // Simulate local model weights (simplified 4-feature vector)
      const weights = [
        +(Math.random() * 0.2 + acc * 0.8).toFixed(4),
        +(Math.random() * 0.15 + acc * 0.7).toFixed(4),
        +(Math.random() * 0.1 + acc * 0.9).toFixed(4),
        +(Math.random() * 0.12 + acc * 0.75).toFixed(4),
      ];

      return {
        farmerId: f.id,
        farmerName: f.name,
        region: f.region,
        samples: f.samples,
        localAccuracy: +Math.min(acc, 0.96).toFixed(4),
        localLoss: +(1 - Math.min(acc, 0.96) + Math.random() * 0.05).toFixed(4),
        weights,
        epochsTrained: 5,
      };
    });

    // FedAvg: weighted average of local weights
    // w_global = Σ (n_i / n_total) * w_i
    const aggregatedWeights = [0, 0, 0, 0].map((_, wi) => {
      return +clientResults.reduce((sum, c) => {
        return sum + (c.samples / totalSamples) * c.weights[wi];
      }, 0).toFixed(4);
    });

    // Global accuracy = weighted average of local accuracies
    const globalAccuracy = +clientResults.reduce((sum, c) => {
      return sum + (c.samples / totalSamples) * c.localAccuracy;
    }, 0).toFixed(4);

    rounds.push({
      round: r + 1,
      clients: clientResults,
      aggregation: "FedAvg",
      aggregatedWeights,
      globalAccuracy,
      globalLoss: +(1 - globalAccuracy + Math.random() * 0.03).toFixed(4),
      communicationCost: `${(r + 1) * 2.4} KB`,
    });
  }

  return res.status(200).json({
    success: true,
    summary: {
      totalClients: farmers.length,
      totalSamples,
      totalRounds: 5,
      finalAccuracy: rounds[4].globalAccuracy,
      improvement: +(rounds[4].globalAccuracy - rounds[0].globalAccuracy).toFixed(4),
      algorithm: "FedAvg (McMahan et al., 2017)",
      formula: "w_global = Σ(n_i / n) × w_i",
    },
    farmers,
    rounds,
  });
}
