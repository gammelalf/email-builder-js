import { z } from 'zod';

const ChildrenSchema = z.array(z.string());

const IfContainerPropsSchema = z.object({
  props: z
    .object({
      if: z.string(),
      then: ChildrenSchema,
      elif: z.array(z.object({
        if: z.string(),
        then: ChildrenSchema,
      })),
      else: ChildrenSchema.nullable(),
    }),
});

export type IfContainerProps = z.infer<typeof IfContainerPropsSchema>;
export default IfContainerPropsSchema;
