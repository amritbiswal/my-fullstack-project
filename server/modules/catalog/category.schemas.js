const { z } = require("zod");

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

module.exports = { categorySchema };