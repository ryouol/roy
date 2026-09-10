import Home from "../page";
import { pageMetadata } from "@/lib/site";
export const metadata = {
  ...pageMetadata(
    "Alpine motion",
    "Scroll-controlled alpine scene with depth and foreground clouds.",
    "/scroll-demo",
  ),
  robots: { index: false, follow: false },
};
export default Home;
