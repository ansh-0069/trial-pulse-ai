import pandas as pd
import random
import numpy as np
from data_loader import load_real_subjects

# --- CONFIGURATION ---
REAL_SITES = ['001', '002', '004', '021', '022', '023']
CRISIS_SITE = '042' # The "Site 42" Narrative
TOTAL_SITES = 45    # 7 Interactive + 38 Dummy

def generate_master_dataset():
    """
    Generates the 'Golden Dataset' for the prototype.
    Combines Real Data + Site 42 Injection + Dummy Noise.
    """
    real_df = load_real_subjects()
    
    sites_data = []

    # 1. Process Real Sites
    for site_id in REAL_SITES:
        # Filter subjects for this site
        subjects = real_df[real_df['Site ID'] == site_id] if 'Site ID' in real_df.columns else pd.DataFrame()
        subject_count = len(subjects) if not subjects.empty else random.randint(5, 15)
        
        # Generate Good/Average Metrics
        sites_data.append({
            "id": site_id,
            "name": f"Site {site_id} - University Hospital",
            "lat": 40.7128 + random.uniform(-10, 10), # Random global locations
            "lng": -74.0060 + random.uniform(-20, 20),
            "status": "Active",
            "patients": subject_count,
            "dqi": random.randint(80, 98), # Generally good
            "overdue_items": random.randint(0, 5),
            "is_dummy": False
        })

    # 2. INJECT SITE 42 (The Crisis) [cite: 4]
    sites_data.append({
        "id": CRISIS_SITE,
        "name": "Site 042 - City General",
        "lat": 34.0522, # Los Angeles approx
        "lng": -118.2437,
        "status": "Critical",
        "patients": 22,
        "dqi": 45, # THE TRIGGER VALUE
        "overdue_items": 15,
        "is_dummy": False,
        "issues": {
            "visit_completion": 40, # Low score
            "query_resolution": 35, # Low score
            "cra_turnover": True    # The Root Cause
        }
    })

    # 3. Generate 38 Dummy Sites (Visual Noise)
    for i in range(TOTAL_SITES - len(sites_data)):
        site_num = 100 + i
        sites_data.append({
            "id": str(site_num),
            "name": f"Site {site_num} - Regional Center",
            "lat": random.uniform(-50, 60),
            "lng": random.uniform(-120, 140),
            "status": random.choice(["Active", "Active", "Warning"]),
            "patients": random.randint(5, 50),
            "dqi": random.randint(70, 95),
            "overdue_items": random.randint(0, 3),
            "is_dummy": True
        })

    return sites_data

def get_dqi_breakdown(site_id):
    """
    Returns the specific DQI formula breakdown[cite: 118].
    """
    if site_id == CRISIS_SITE:
        return {
            "visit_completion": 15, # Out of 25
            "query_resolution": 5,  # Out of 20 (Crisis)
            "data_conformance": 10, # Out of 20
            "lab_reconciliation": 10, # Out of 15
            "safety": 2,            # Out of 10 (Crisis)
            "signatures": 3,        # Out of 10
            "total": 45
        }
    else:
        # Healthy site
        return {
            "visit_completion": 24,
            "query_resolution": 19,
            "data_conformance": 19,
            "lab_reconciliation": 15,
            "safety": 10,
            "signatures": 10,
            "total": 97
        }