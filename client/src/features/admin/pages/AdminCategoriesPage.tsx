import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";

import { useAdminCategories, useCreateAdminCategory } from "../hooks";
import { AdminListCard } from "../components/AdminListCard";
import { createCategorySchema, type CreateCategoryForm } from "../schemas";
import { toSlug } from "../../../utils/slug";

export function AdminCategoriesPage() {
  const { toast } = useToast();
  const q = useAdminCategories();
  const create = useCreateAdminCategory();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateCategoryForm>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: "", slug: "", icon: "" }
  });

  const slug = watch("slug");

  async function onSubmit(values: CreateCategoryForm) {
    try {
      await create.mutateAsync({
        name: values.name.trim(),
        slug: values.slug.trim(),
        icon: values.icon?.trim() || undefined
      });
      toast("Category created");
      reset({ name: "", slug: "", icon: "" });
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Create failed", "error");
    }
  }

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-lg font-semibold">Admin • Categories</div>
        <div className="mt-1 text-sm text-slate-600">Manage the main catalog categories.</div>
      </Card>

      <Card className="p-4">
        <div className="text-sm font-semibold">Create category</div>

        <form className="mt-3 space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            placeholder="Adventure gear"
            error={errors.name?.message}
            {...register("name", {
              onChange: (e) => {
                // auto-fill slug only when slug is empty
                const name = (e.target as HTMLInputElement).value;
                if (!slug) setValue("slug", toSlug(name), { shouldValidate: true });
              }
            })}
          />

          <Input
            label="Slug"
            placeholder="adventure-gear"
            error={errors.slug?.message}
            {...register("slug")}
          />

          <Input
            label="Icon (optional)"
            placeholder="e.g. backpack"
            error={errors.icon?.message}
            {...register("icon")}
          />

          <Button className="w-full" type="submit" disabled={isSubmitting || create.isPending}>
            {create.isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </Card>

      <div className="px-1 text-sm font-semibold text-slate-800">All categories</div>

      {q.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : (q.data?.length ?? 0) === 0 ? (
        <Card className="p-4 text-sm text-slate-600">No categories yet.</Card>
      ) : (
        <div className="space-y-2">
          {q.data!.map((c) => (
            <AdminListCard
              key={c._id}
              title={c.name}
              subtitle={`Slug: ${c.slug}`}
              rightBadge={c.icon ? { text: c.icon, tone: "slate" } : { text: "Category", tone: "teal" }}
              metaLines={[`ID: ${c._id}`]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
