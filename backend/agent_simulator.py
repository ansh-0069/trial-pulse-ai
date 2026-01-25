# The "Script" for the Multi-Agent Workspace
SITE_42_ANALYSIS = {
    "site_id": "042",
    "status": "Analyzing",
    "agents": {
        "DataQuality": {
            "status": "Alert",
            "message": "DQI detected at 45 (Threshold < 60). Safety reporting lag > 14 days.",
            "timestamp": "Now"
        },
        "SitePerformance": {
            "status": "Root Cause Found",
            "message": "Correlation detected: Primary CRA (ID: 882) resigned on Oct 12. No replacement logged.",
            "timestamp": "Now + 2s"
        },
        "Orchestrator": {
            "status": "Action Plan Ready",
            "message": "Proposal: 1. Reassign Senior CRA from Site 008 (Capacity: 40%). 2. Initiate Remote Monitoring Audit.",
            "timestamp": "Now + 4s"
        }
    }
}

def run_agent_simulation(site_id):
    if site_id == "042":
        return SITE_42_ANALYSIS
    return {"message": "Site operating within normal parameters."}