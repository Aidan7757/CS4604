export const TABLE_SCHEMAS = {
  ALERT: [
    { name: "alert_id", type: "text", required: true },
    { name: "title", type: "text", required: true },
    { name: "message", type: "text", required: true },
    { name: "park_id", type: "text", required: true },
  ],
  ORGANIZATION: [
    { name: "org_id", type: "text", required: true },
    { name: "phone_number", type: "text", required: true },
    { name: "contact_email", type: "email", required: true },
    { name: "name", type: "text", required: true },
    { name: "type", type: "text", required: true },
  ],
  PARK: [
    { name: "park_id", type: "text", required: true },
    { name: "first_name", type: "text", required: true },
    { name: "last_name", type: "text", required: true },
    { name: "status", type: "text", required: true },
    { name: "project_id", type: "text", required: false },
  ],
  POLLUTANT: [
    { name: "pollutant_id", type: "text", required: true },
    { name: "pollutant_name", type: "text", required: true },
    { name: "danger_level", type: "number", required: true },
    { name: "amount_within_park", type: "text", required: true },
    { name: "park_id", type: "text", required: true },
  ],
  PRESERVATION_PROJECT: [
    { name: "project_id", type: "text", required: true },
    { name: "project_name", type: "text", required: true },
    { name: "year_started", type: "text", required: true },
    { name: "species_id", type: "text", required: true },
  ],
  SPECIES: [
    { name: "species_id", type: "text", required: true },
    { name: "conservation_status", type: "text", required: true },
    { name: "scientific_name", type: "text", required: true },
    { name: "common_name", type: "text", required: true },
    { name: "species_count", type: "number", required: true },
  ],
  VISITOR: [
    { name: "visitor_id", type: "text", required: true },
    { name: "hour_entered", type: "datetime-local", required: true },
    { name: "hour_left", type: "datetime-local", required: false },
    { name: "age", type: "number", required: true },
    { name: "name", type: "text", required: true },
  ],
};

export const TABLE_ORDER = Object.keys(TABLE_SCHEMAS);

export const TABLE_PK = {
  ALERT: "alert_id",
  ORGANIZATION: "org_id",
  PARK: "park_id",
  POLLUTANT: "pollutant_id",
  PRESERVATION_PROJECT: "project_id",
  SPECIES: "species_id",
  VISITOR: "visitor_id",
};
