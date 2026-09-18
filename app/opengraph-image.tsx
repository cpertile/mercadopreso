import { ImageResponse } from "next/og";

export const alt = "MercadoPreso — compras 100% simuladas";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffe600",
          color: "#333333",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 148,
              height: 148,
              borderRadius: 24,
              backgroundColor: "#333333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 36,
            }}
          >
            <div
              style={{
                width: 96,
                height: 76,
                borderRadius: 12,
                backgroundColor: "#ffe600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 12, height: 56, backgroundColor: "#333333", marginRight: 12 }} />
              <div style={{ width: 12, height: 56, backgroundColor: "#333333", marginRight: 12 }} />
              <div style={{ width: 12, height: 56, backgroundColor: "#333333" }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: 10,
              }}
            >
              MERCADO
            </div>
            <div
              style={{
                fontSize: 108,
                fontWeight: 900,
                lineHeight: 0.85,
                marginTop: -4,
              }}
            >
              preso
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 28,
            fontWeight: 500,
          }}
        >
          Compras 100% simuladas. Nada é cobrado.
        </div>
      </div>
    ),
    { ...size },
  );
}
