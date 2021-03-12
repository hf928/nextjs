const POST_GRAPHQL_FIELDS = `
title
content {
    json
}
`;

async function fetchGraphQL(query, preview = false) {
    return fetch(
        `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${
                    preview
                    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
                    : process.env.CONTENTFUL_ACCESS_TOKEN
                }`,
            },
            body: JSON.stringify({
                query
            }),
        }
    ).then((response) => response.json())
}


function extractPost(fetchResponse) {
    console.log('extractPost', fetchResponse);
    return fetchResponse?.data?.articleCollection?.items?.[0]
  }
  
  function extractPostEntries(fetchResponse) {
    return fetchResponse?.data?.articleCollection?.items
  }
  

export async function getAllPostsWithSlug() {
    const entries = await fetchGraphQL(
      `query {
        articleCollection(where: { slug_exists: true }, order: date_DESC) {
          items {
            ${POST_GRAPHQL_FIELDS}
          }
        }
      }`
    )
    return extractPostEntries(entries)
  }

export async function getAllPostsForHome(preview) {
    const entries = await fetchGraphQL(
        `query {
            articleCollection(order: date_DESC, preview: ${preview ? 'true' : 'false'}) {
                items {
                    ${POST_GRAPHQL_FIELDS}
                }
            }
        }`,
        preview
    )
    return extractPostEntries(entries)
}

export async function getPost(slug, preview) {
    const entry = await fetchGraphQL(
        `query {
            articleCollection(where: { slug: "${slug}" }, preview: ${
        preview ? 'true' : 'false'
      }, limit: 1) {
          items {
            ${POST_GRAPHQL_FIELDS}
          }
        }
      }`,
        preview
    )
   
    return {
        post: extractPost(entry),
    }
}