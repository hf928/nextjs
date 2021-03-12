
import { useRouter } from 'next/router'
import Head from 'next/head'
import ErrorPage from 'next/error'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import { getAllPostsWithSlug, getPost } from '../../lib/api'

export default function Post({ post }) {
    const router = useRouter()
  console.log(post);
    if (!router.isFallback && !post) {
      return <ErrorPage statusCode={404} />
    }
  
    return (
      <main>
          {router.isFallback ? (
            <div>Loading…</div>
          ) : (
            <>
              <article>
                <Head>
                  <title>
                    {post.title}
                  </title>
                  {/* <meta property="og:image" content={post.coverImage.url} /> */}
                </Head>

                <h1>{post.title}</h1>
                <div>{documentToReactComponents(post.content.json)}</div>
                
              </article>
            </>
          )}
      </main>
    )
  }
  
  export async function getStaticProps({ params, preview = false }) {
      console.log(params.slug);
    const data = await getPost(params.slug, preview)
  console.log(data);
    return {
      props: {
        post: data?.post ?? null,
      },
    }
  }
  
  export async function getStaticPaths() {
    const allPosts = await getAllPostsWithSlug()
    return {
      paths: allPosts?.map(({ slug }) => `/posts/${slug}`) ?? [],
      fallback: true,
    }
  }