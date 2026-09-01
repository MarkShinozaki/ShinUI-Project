import type { Metadata } from "next";

import { UserResourcePage } from "@/components/user-resource-view";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: "Your site",
  robots: { index: false, follow: false },
};

export default async function AddedResourcePage({ params }: Props) {
  const { slug } = await params;
  return <UserResourcePage slug={slug} />;
}
