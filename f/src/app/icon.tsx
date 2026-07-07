import { ImageResponse } from "next/og";
import { getSiteAvatarPath, resolveAvatarFetchUrl } from "@/lib/site-branding";

export const dynamic = "force-dynamic";
export const revalidate = 300;
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

function fallbackIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fafafa",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        CV
      </div>
    ),
    { ...size },
  );
}

export default async function Icon() {
  const path = await getSiteAvatarPath();
  if (!path) return fallbackIcon();

  const fetchUrl = resolveAvatarFetchUrl(path);

  return new ImageResponse(
    (
      <img
        src={fetchUrl}
        alt=""
        width={32}
        height={32}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    ),
    { ...size },
  );
}
