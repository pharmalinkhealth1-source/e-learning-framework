
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
});

async function test() {
  try {
    const spotlights = await client.fetch(`*[_type == "memberSpotlight" && featured == true] | order(publishedAt desc)[0...10]`);
    console.log('Count:', spotlights.length);
    console.log('IDs:', spotlights.map(s => s._id));
  } catch (err) {
    console.error(err);
  }
}

test();
