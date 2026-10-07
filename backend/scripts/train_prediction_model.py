"""
Script to train, evaluate, verify, and save the Claim Processing Duration Prediction Model (AI Module 3).
"""

import os
import sys
import math
import joblib

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.database import SessionLocal
from app.ai.prediction import train_processing_duration_model, predict_pending_claims_duration, MODEL_PATH


def main():
    print("=======================================================================")
    print("AI/DSS Module 3: Claim Processing Duration Prediction Model Training")
    print("=======================================================================\n")

    db = SessionLocal()
    try:
        # 1. Train model on 3,497 resolved claims
        print("1. Loading resolved claims data & training RandomForestRegressor...")
        results = train_processing_duration_model(db, save_model=True)

        metrics = results["metrics"]
        params = results["model_params"]
        features = results["features_used"]

        print(f"\n--- MODEL TRAINING RESULTS ---")
        print(f"Total Resolved Training Claims: {metrics['train_size']}")
        print(f"Total Resolved Test Claims:     {metrics['test_size']}")
        print(f"Selected Input Features:         {features}")
        print(f"Model Algorithm:                 RandomForestRegressor")
        print(f"Model Parameters (Key):          n_estimators={params.get('n_estimators')}, max_depth={params.get('max_depth')}, random_state={params.get('random_state')}")

        print("\n--- TEST SET EVALUATION METRICS ---")
        print(f"MAE  (Mean Absolute Error):     {metrics['mae']} days")
        print(f"RMSE (Root Mean Squared Error): {metrics['rmse']} days")
        print(f"R²   (Variance Explained):       {metrics['r2']}")

        # 2. Print test set predictions vs actual
        print("\n--- TEST SET PREDICTIONS VS ACTUAL (SAMPLE 5) ---")
        for i, sample in enumerate(results["test_samples"], 1):
            print(f"  {i}. Claim {sample['claim_id']} ({sample['district_id']}, {sample['claim_type']}): Actual = {sample['actual_processing_days']} days | Predicted = {sample['predicted_processing_days']} days | Error = {sample['error_days']} days")

        # 3. Model Reload Verification
        print("\n--- MODEL PERSISTENCE VERIFICATION ---")
        assert os.path.exists(MODEL_PATH), f"Model file missing at {MODEL_PATH}"
        reloaded_artifacts = joblib.load(MODEL_PATH)
        print("[OK] Model file successfully reloaded from disk.")

        reloaded_pipeline = reloaded_artifacts["pipeline"]
        assert reloaded_pipeline is not None, "Reloaded pipeline is None"
        print("[OK] Pipeline reloaded successfully.")

        # 4. Numerical Integrity Verification
        test_samples = results["test_samples"]
        for sample in test_samples:
            pred = sample["predicted_processing_days"]
            assert isinstance(pred, (int, float)), f"Prediction is not float: {pred}"
            assert not math.isnan(pred), "Prediction is NaN"
            assert not math.isinf(pred), "Prediction is Infinity"
            assert pred >= 0.0, f"Prediction is negative: {pred}"
        print("[OK] Verification passed: All predictions are numeric, finite, non-negative, and non-NaN.")

        # 5. Inference Test on Pending Claims Sample
        print("\n--- PENDING CLAIMS INFERENCE SAMPLE (AI MODULE 3 INFERENCE) ---")
        pending_preds = predict_pending_claims_duration(db)
        print(f"Total Active Pending Claims Processed: {len(pending_preds)}")
        print("\nFirst 5 Pending Claim Predictive Turnaround Results:")
        for i, p in enumerate(pending_preds[:5], 1):
            print(f"  {i}. Claim ID: {p['claim_id']} | District: {p['district']} ({p['district_id']})")
            print(f"     Current Pending Days:   {p['current_pending_days']} days")
            print(f"     Predicted Total Duration: {p['predicted_processing_days']} days")
            print(f"     Predicted Remaining:      {p['predicted_remaining_days']} days")
            print(f"     Delay Risk Assessment:    {p['delay_risk']}")
            print(f"     Recommendation:           {p['recommendation']}\n")

    finally:
        db.close()


if __name__ == "__main__":
    main()
