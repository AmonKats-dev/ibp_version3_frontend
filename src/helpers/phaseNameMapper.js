/**
 * Maps phase names to ensure "Project Concept" and "Project Profile" are displayed as "Profile"
 * This is a temporary frontend fix until the backend database is updated
 */
export const mapPhaseName = (phaseName) => {
  if (!phaseName) return phaseName;
  
  // Map "Project Concept" and "Project Profile" to "Profile"
  if (phaseName === "Project Concept" || phaseName === "Concept" || phaseName === "Project Profile") {
    return "Profile";
  }
  
  return phaseName;
};

/**
 * Maps phase object to ensure name is transformed
 */
export const mapPhase = (phase) => {
  if (!phase) return phase;
  
  return {
    ...phase,
    name: mapPhaseName(phase.name)
  };
};

