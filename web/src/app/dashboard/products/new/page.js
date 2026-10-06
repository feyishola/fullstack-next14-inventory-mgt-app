import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { requireUser } from "@/lib/dal";
import { listProducts } from "@/lib/queries";
import { ProductForm } from "@/components/ProductForm";

export const metadata = { title: "Add product" };

export default async function NewProductPage() {
  const user = await requireUser();
  const { categories } = await listProducts(user.workspaceId, { page: 1 });
  return (
    <>
      <Link href="/dashboard/products" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ChevronLeft className="size-4" /> Products
      </Link>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Add product</h1>
      <ProductForm categories={categories} currency={user.workspace.currency} />
    </>
  );
}
