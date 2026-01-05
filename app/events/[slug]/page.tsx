export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div style={{ padding: 40 }}>
      <h1>EVENT ROUTE OK</h1>
      <p>slug: {params.slug}</p>
    </div>
  );
}
