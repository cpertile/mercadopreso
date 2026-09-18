import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#333333",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            width: 20,
            height: 16,
            borderRadius: 3,
            backgroundColor: "#ffe600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 2, height: 12, backgroundColor: "#333333", marginRight: 2 }} />
          <div style={{ width: 2, height: 12, backgroundColor: "#333333", marginRight: 2 }} />
          <div style={{ width: 2, height: 12, backgroundColor: "#333333" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
