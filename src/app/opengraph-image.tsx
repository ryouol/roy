import { ImageResponse } from "next/og";
export const alt = "Roy Luo — Software engineer.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#edf2f7",
        color: "#182331",
        flexDirection: "column",
        padding: 70,
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
        }}
      >
        <span>roy luo.</span>
        <span>SOFTWARE ENGINEER</span>
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: 112,
          lineHeight: 1,
        }}
      >
        Roy Luo
      </div>
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #b3c4d4",
          paddingTop: 30,
          fontSize: 24,
          color: "#57677a",
        }}
      >
        Software engineer · Electrical Engineering at Waterloo
      </div>
    </div>,
    size,
  );
}
