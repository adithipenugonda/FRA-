import pandas as pd
import numpy as np
from faker import Faker
import random
from pathlib import Path

# -----------------------------
# 1. Basic configuration
# -----------------------------

fake = Faker("en_IN")

random.seed(42)
np.random.seed(42)

NUMBER_OF_CLAIMS = 5000

# -----------------------------
# 2. Load our location data
# -----------------------------

# locations = pd.read_csv("../data/locations.csv")
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

locations = pd.read_csv(DATA_DIR / "locations.csv")

print("Locations loaded:", len(locations))

# -----------------------------
# 3. Generate claim IDs
# -----------------------------

claim_ids = [
    f"FRA{i:05d}"
    for i in range(1, NUMBER_OF_CLAIMS + 1)
]

# -----------------------------
# 4. Generate claims
# -----------------------------

claims = []

for claim_id in claim_ids:

    # Select a valid location
    location = locations.sample(1).iloc[0]

    # Claim type
    claim_type = random.choice(["IFR", "CFR"])

    # Status
    status = random.choices(
        ["Approved", "Pending", "Rejected"],
        weights=[55, 30, 15],
        k=1
    )[0]

    # Land area
    land_area = round(
        np.random.uniform(0.5, 8.0),
        2
    )

    # Submission date
    submission_date = fake.date_between(
        start_date="-5y",
        end_date="today"
    )

    # Decision date
    if status == "Pending":
        decision_date = None
    else:
        decision_date = fake.date_between(
            start_date=submission_date,
            end_date="today"
        )

    claim = {
        "claim_id": claim_id,
        "state": "Telangana",
        "district_id": location["district_id"],
        "district": location["district_name"],
        "mandal": location["mandal"],
        "village": location["village"],
        "claimant_name": f"Claimant_{claim_id}",
        "claim_type": claim_type,
        "land_area_acres": land_area,
        "status": status,
        "submission_date": submission_date,
        "decision_date": decision_date
    }

    claims.append(claim)

# -----------------------------
# 5. Convert to DataFrame
# -----------------------------

df = pd.DataFrame(claims)

# -----------------------------
# 6. Save dataset
# -----------------------------

output_path = DATA_DIR / "fra_claims.csv"

df.to_csv(
    output_path,
    index=False
)

print("\nDataset generated successfully!")
print("Number of records:", len(df))
print("Saved to:", output_path)

# -----------------------------
# 7. Basic inspection
# -----------------------------

print("\nFirst 5 records:")
print(df.head())

print("\nStatus distribution:")
print(df["status"].value_counts())

print("\nClaim type distribution:")
print(df["claim_type"].value_counts())