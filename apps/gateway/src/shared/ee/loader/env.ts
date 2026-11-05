import { AtriumMode } from "../licensing/policy";

const DEFAULT_MODE: AtriumMode = "self-host";

/**
 * Reads `ATRIUM_MODE` from the environment and normalises it.
 * Defaults to `"self-host"` if the variable is absent or unrecognised.
 */
export const getAtriumMode = (): AtriumMode => {
  const raw = (process.env.ATRIUM_MODE || "").toLowerCase();
  return raw === "cloud" ? "cloud" : DEFAULT_MODE;
};

/**
 * Returns `true` when the Enterprise Edition feature set is allowed to activate.
 *
 * The real gate is the presence of the EE module: `getEeStatus()` only reports
 * availability when this returns true AND the module is on disk. This flag is
 * the operator's switch — set `ATRIUM_EE_ENABLED=false` to refuse enterprise
 * features even if an EE module is later installed.
 *
 * This distribution ships without the EE module, so enterprise capabilities are
 * reported as unavailable rather than failing at runtime.
 */
export const isEeEnabledByEnv = (): boolean => {
  return (process.env.ATRIUM_EE_ENABLED || "true").toLowerCase() !== "false";
};
