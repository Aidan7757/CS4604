'''
Verifies the payload given for a certain command.
'''


def alert_table_insert_verification(payload: dict) -> bool:
    if payload.get("alert_id") and payload.get("message") and payload.get("park_id") and payload.get("title"):
        return True
    return False


def org_table_insert_verification(payload: dict) -> bool:
    if payload.get("contact_email") and payload.get("name") and payload.get("org_id") and payload.get("phone_number") \
            and payload.get("type"):
        return True
    return False


def park_table_insert_verification(payload: dict) -> bool:
    if payload.get("park_name") and payload.get("status"):
        return True
    return False


def visitor_table_insert_verification(payload: dict) -> bool:
    if payload.get("visitor_id") and payload.get("hour_entered") and payload.get("age") and payload.get("name"):
        return True
    return False


def pollutant_table_insert_verification(payload: dict) -> bool:
    if payload.get("amount_within_park") and payload.get("danger_level") and payload.get("park_id") and payload.get(
            "pollutant_id") and payload.get("pollutant_name"):
        return True
    return False


def preservation_project_table_insert_verification(payload: dict) -> bool:
    if payload.get("project_id") and payload.get("project_name") and payload.get("species_id") and payload.get(
            "year_started"):
        return True
    return False


def species_table_insert_verification(payload: dict) -> bool:
    if payload.get("common_name") and payload.get("conservation_status") and payload.get(
            "scientific_name") and payload.get(
        "species_count") and payload.get("species_id"):
        return True
    return False


def payload_verification(table_name: str, payload: dict) -> bool:
    match table_name:
        case "alert":
            return alert_table_insert_verification(payload)
        case "organization":
            return org_table_insert_verification(payload)
        case "park":
            return park_table_insert_verification(payload)
        case "visitor":
            return visitor_table_insert_verification(payload)
        case "pollutant":
            return pollutant_table_insert_verification(payload)
        case "species":
            return species_table_insert_verification(payload)
        case "preservation_project":
            return preservation_project_table_insert_verification(payload)
