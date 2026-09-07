type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [{ slug: "post" }];
}

export default async function Page({
  params,
  searchParams,
}: Props): Promise<unknown[]> {
  return [await params, await searchParams];
}
