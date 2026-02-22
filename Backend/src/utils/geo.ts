export function isPrivateIp(ip: string): boolean {
  return /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip)
    || ip === "::1" || ip === "" || ip === "unknown";
}

export async function getGeoData(ip: string) {
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,regionName,city,country,org,hosting,timezone,isp,as`
    );
    const geo = await res.json() as {
      status: string; regionName?: string; city?: string; country?: string;
      org?: string; hosting?: boolean; timezone?: string; isp?: string; as?: string;
    };
    if (geo.status !== "success") return null;

    const org = geo.org || "";
    const orgLower = org.toLowerCase();
    const RESIDENTIAL_ISPS = [
      "telefonica", "movistar", "orange", "vodafone", "masmovil",
      "yoigo", "jazztel", "digi", "lowi", "euskaltel", "telecable", "r cable",
    ];
    const isResidential = RESIDENTIAL_ISPS.some((k) => orgLower.includes(k));
    const is_company = geo.hosting || !isResidential ? 1 : 0;

    return {
      city: geo.city || "",
      region: geo.regionName || "",
      country: geo.country || "",
      org,
      is_company,
      timezone: geo.timezone || "",
      isp: geo.isp || "",
      as_number: geo.as || "",
    };
  } catch {
    return null;
  }
}
