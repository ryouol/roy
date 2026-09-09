import { ImageResponse } from "next/og";
export const alt = "Roy Luo — software engineer. A little further.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#10282b",
        color: "#eee9df",
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
          fontFamily: "serif",
          fontSize: 112,
          lineHeight: 1,
        }}
      >
        A little further.
      </div>
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #7b9484",
          paddingTop: 30,
          fontSize: 24,
          color: "#c7ccb6",
        }}
      >
        Building systems. Following curiosity. Taking the scenic route.
      </div>
    </div>,
    size,
  );
}
