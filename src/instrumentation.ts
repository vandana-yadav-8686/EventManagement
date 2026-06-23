export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { connectDB } = await import("./lib/db");
    connectDB().catch(() => {
      // DB may be unavailable during build; ignore here
    });
  }
}
