import pandas as pd
import os

# Path to your EDRR file
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "Study 1_Compiled_EDRR_updated.xlsx")

def load_real_subjects():
    """
    Loads real subject data from the EDRR Excel.
    Extracts Site ID and Subject ID.
    """
    # Create a mock dataframe if file doesn't exist yet for testing
    if not os.path.exists(DATA_PATH):
        print(f"⚠️ Warning: File not found at {DATA_PATH}. Using mock data.")
        data = {
            'Subject ID': ['001-014', '002-058', '021-078', '004-001', '022-005', '023-010'],
            'Open Issues': [3, 5, 0, 1, 8, 2] # Mock counts
        }
        return pd.DataFrame(data)

    # Load actual Excel (assuming first sheet has the data)
    df = pd.read_excel(DATA_PATH)
    
    # Ensure we have Subject IDs. 
    # Logic: Extract Site ID from "XXX-YYY" format
    if 'Subject ID' in df.columns:
        df['Site ID'] = df['Subject ID'].apply(lambda x: x.split('-')[0] if '-' in str(x) else 'Unknown')
    
    return df