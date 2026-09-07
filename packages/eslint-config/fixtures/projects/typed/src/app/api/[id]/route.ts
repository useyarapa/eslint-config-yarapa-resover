type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return [{ id: "1" }];
}

export async function GET(
  req: Request,
  { params }: RouteContext,
): Promise<Response> {
  return Response.json([req.url, await params]);
}
