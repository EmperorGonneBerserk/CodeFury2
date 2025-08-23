// services/otxService.js
const OTX_API_KEY = "8379c307313c4945557abc7ded7db8783d6703eecb52c68703c67c1ac26b1b44"; // replace with your key
const OTX_BASE_URL = "https://otx.alienvault.com/api/v1";

export const fetchLatestPulses = async () => {
  try {
    const response = await fetch(`${OTX_BASE_URL}/pulses/subscribed`, {
      headers: {
        "X-OTX-API-KEY": OTX_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch OTX pulses");
    }

    const data = await response.json();
    return data.results; // returns list of recent threat intel pulses
  } catch (error) {
    console.error("Error fetching OTX data:", error);
    return [];
  }
};
