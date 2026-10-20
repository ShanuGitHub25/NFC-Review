// Utility for validating Indian PIN codes and auto-detecting major cities and states
export interface PostalCodeInfo {
  valid: boolean;
  city?: string;
  state?: string;
  region?: string;
  isServiceable: boolean;
}

const PIN_DIRECTORY: Record<string, { city: string; state: string; region: string }> = {
  // Karnataka
  "560": { city: "Bengaluru", state: "Karnataka", region: "South" },
  "570": { city: "Mysuru", state: "Karnataka", region: "South" },
  "575": { city: "Mangaluru", state: "Karnataka", region: "South" },
  "580": { city: "Hubli-Dharwad", state: "Karnataka", region: "South" },

  // Maharashtra
  "400": { city: "Mumbai", state: "Maharashtra", region: "West" },
  "411": { city: "Pune", state: "Maharashtra", region: "West" },
  "440": { city: "Nagpur", state: "Maharashtra", region: "West" },
  "422": { city: "Nashik", state: "Maharashtra", region: "West" },

  // Delhi NCR
  "110": { city: "New Delhi", state: "Delhi", region: "North" },
  "122": { city: "Gurugram", state: "Haryana", region: "North" },
  "201": { city: "Noida / Ghaziabad", state: "Uttar Pradesh", region: "North" },
  "121": { city: "Faridabad", state: "Haryana", region: "North" },

  // Tamil Nadu
  "600": { city: "Chennai", state: "Tamil Nadu", region: "South" },
  "641": { city: "Coimbatore", state: "Tamil Nadu", region: "South" },
  "625": { city: "Madurai", state: "Tamil Nadu", region: "South" },

  // Telangana & Andhra Pradesh
  "500": { city: "Hyderabad", state: "Telangana", region: "South" },
  "530": { city: "Visakhapatnam", state: "Andhra Pradesh", region: "South" },
  "520": { city: "Vijayawada", state: "Andhra Pradesh", region: "South" },

  // Gujarat
  "380": { city: "Ahmedabad", state: "Gujarat", region: "West" },
  "395": { city: "Surat", state: "Gujarat", region: "West" },
  "390": { city: "Vadodara", state: "Gujarat", region: "West" },

  // West Bengal
  "700": { city: "Kolkata", state: "West Bengal", region: "East" },

  // Rajasthan
  "302": { city: "Jaipur", state: "Rajasthan", region: "North" },
  "342": { city: "Jodhpur", state: "Rajasthan", region: "North" },
  "313": { city: "Udaipur", state: "Rajasthan", region: "North" },

  // Kerala
  "682": { city: "Kochi", state: "Kerala", region: "South" },
  "695": { city: "Thiruvananthapuram", state: "Kerala", region: "South" },

  // Punjab & Chandigarh
  "160": { city: "Chandigarh", state: "Punjab / Chandigarh", region: "North" },
  "141": { city: "Ludhiana", state: "Punjab", region: "North" },
  "143": { city: "Amritsar", state: "Punjab", region: "North" },

  // Madhya Pradesh
  "452": { city: "Indore", state: "Madhya Pradesh", region: "Central" },
  "462": { city: "Bhopal", state: "Madhya Pradesh", region: "Central" },

  // Goa
  "403": { city: "Panaji / North Goa", state: "Goa", region: "West" },
};

export function lookupIndiaPostalCode(pin: string): PostalCodeInfo {
  const cleaned = pin.replace(/\s+/g, "");

  // Must be a 6 digit number and cannot begin with 0
  if (!/^[1-9][0-9]{5}$/.test(cleaned)) {
    return {
      valid: false,
      isServiceable: false,
    };
  }

  const prefix3 = cleaned.substring(0, 3);
  const found = PIN_DIRECTORY[prefix3];

  if (found) {
    return {
      valid: true,
      city: found.city,
      state: found.state,
      region: found.region,
      isServiceable: true,
    };
  }

  // Any valid 6-digit Indian PIN code is serviceable by Indian Speed Post & Blue Dart
  return {
    valid: true,
    city: "Standard Hub",
    state: "India Delivery Network",
    region: "Pan-India",
    isServiceable: true,
  };
}
