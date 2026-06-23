/**
 * Ensures special characters in MongoDB credentials are URL-encoded.
 * Passwords like T!cketApp_Pass2026 must use %21 for "!" or Atlas auth fails.
 */
export function normalizeMongoUri(uri: string): string {
  const trimmed = uri.trim();
  if (!trimmed.startsWith("mongodb")) return trimmed;

  const withoutScheme = trimmed.replace(/^mongodb(\+srv)?:\/\//, "");
  const atIndex = withoutScheme.lastIndexOf("@");
  if (atIndex === -1) return trimmed;

  const credentials = withoutScheme.slice(0, atIndex);
  const hostAndRest = withoutScheme.slice(atIndex + 1);
  const colonIndex = credentials.indexOf(":");

  if (colonIndex === -1) return trimmed;

  const username = credentials.slice(0, colonIndex);
  const password = credentials.slice(colonIndex + 1);
  const scheme = trimmed.startsWith("mongodb+srv://")
    ? "mongodb+srv://"
    : "mongodb://";

  const encodedPassword = encodeURIComponent(decodeURIComponent(password));
  return `${scheme}${username}:${encodedPassword}@${hostAndRest}`;
}

export function getMongoErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("bad auth") || error.message.includes("Authentication failed")) {
      return "Database authentication failed. Check your MongoDB username, password (URL-encode special characters like ! as %21), and Atlas IP whitelist.";
    }
    if (error.message.includes("MONGODB_URI")) {
      return "Database is not configured. Add MONGODB_URI to your .env file.";
    }
    if (error.message.includes("ENOTFOUND") || error.message.includes("querySrv")) {
      return "Cannot reach MongoDB cluster. Check your connection string and network.";
    }
  }
  return "Database operation failed. Please try again later.";
}
