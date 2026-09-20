import pandas as pd
from pathlib import Path

# --------------------------------
# 1. Project paths
# --------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

# --------------------------------
# 2. Load raw dataset
# --------------------------------

input_file = DATA_DIR / "fra_claims.csv"

df = pd.read_csv(input_file)

print("Raw dataset loaded")
print("Records:", len(df))

# --------------------------------
# 3. Convert date columns
# --------------------------------

df["submission_date"] = pd.to_datetime(
    df["submission_date"]
)

df["decision_date"] = pd.to_datetime(
    df["decision_date"],
    errors="coerce"
)

# --------------------------------
# 4. Calculate processing days
# --------------------------------

df["processing_days"] = (
    df["decision_date"] - df["submission_date"]
).dt.days.astype("Int64")
# --------------------------------
# 5. Calculate pending days
# --------------------------------

today = pd.Timestamp.today().normalize()

df["pending_days"] = (
    today - df["submission_date"]
).dt.days

# Pending days should only apply
# to pending claims
df.loc[
    df["status"] != "Pending",
    "pending_days"
] = 0

# --------------------------------
# 6. Calculate claim age
# --------------------------------

df["claim_age_days"] = (
    today - df["submission_date"]
).dt.days

# --------------------------------
# 7. Save processed dataset
# --------------------------------

output_file = DATA_DIR / "fra_claims_processed.csv"

df.to_csv(
    output_file,
    index=False
)

# --------------------------------
# 8. Display results
# --------------------------------

print("\nFeature engineering completed!")

print("New columns:")
print("- processing_days")
print("- pending_days")
print("- claim_age_days")

print("\nProcessed dataset shape:")
print(df.shape)

print("\nSample records:")
print(
    df[
        [
            "claim_id",
            "status",
            "submission_date",
            "decision_date",
            "processing_days",
            "pending_days",
            "claim_age_days"
        ]
    ].head(10)
)

print("\nSaved to:")
print(output_file)