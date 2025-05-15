interface Movie {
  Title: string;
  Plot: string;
}

export default async function MovieDetails({
  params, // 동적 세그먼트
  searchParams, // 쿼리스트링
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ plot?: 'short' | 'full' }>;
}) {
  const { slug } = await params;
  const { plot } = await searchParams;
  //   const movie: Movie = await res.json();
  //   return (
  //     <>
  //       <h1>{movie.Title}</h1>
  //       <p>{movie.Plot}</p>
  //     </>
  //   );
}
