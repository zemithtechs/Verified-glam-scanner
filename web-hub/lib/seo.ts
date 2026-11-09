/** Local previews are never indexable. Enable only in the production deployment. */
export const SITE_INDEXABLE = process.env.SITE_INDEXABLE === "true";
