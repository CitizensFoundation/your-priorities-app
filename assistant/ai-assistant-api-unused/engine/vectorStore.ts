import { Client } from 'weaviate';
import { generateUUID5 } from 'weaviate/util';
import { v4 as uuidv4 } from 'uuid';
import { Post } from 'models/post';
import { Community } from 'models/community';

async function upsertPostInVectorStore(post: Post): Promise<void> {
  const client = new Client('http://localhost:8080');

  console.log(post);

  const weaviateClass = post.language === 'is' || post.language === 'es' ? 'PostsIs' : 'Posts';

  const uuid = generateUUID5(`${post.cluster_id}-${post.post_id}`, weaviateClass);

  const dataProperties = {
    postId: post.post_id,
    name: post.name,
    description: post.description,
    language: post.language,
    counter_endorsements_up: post.counter_endorsements_up,
    counter_endorsements_down: post.counter_endorsements_down,
    status: post.status,
    imageUrl: post.image_url,
    group_id: post.group_id,
    community_id: post.community_id,
    domain_id: post.domain_id,
    cluster_id: post.cluster_id,
    created_at: post.date,
    updated_at: post.date,
    group_name: post.group_name,
    emojiSummary: await getEmojiSummary(post),
    oneWordSummary: await getOneWordSummary(post),
    shortName: await getShortPostName(post),
    shortSummary: await getShortPostSummary(post),
    fullSummary: await getFullPostSummary(post),
    shortSummaryWithPoints: await getShortPostSummaryWithPoints(post),
    fullSummaryWithPoints: await getFullPostSummaryWithPoints(post),
  };

  console.log(dataProperties);

  client.dataObject.create({
    dataObject: dataProperties,
    className: weaviateClass,
    uuid: uuid,
  });
}

async function upsertCommunityInVectorStore(community: Community): Promise<void> {
  const client = new Client('http://localhost:8080');

  console.log(community);

  const weaviateClass = 'Communities';

  const uuid = generateUUID5(`${community.cluster_id}-${community.community_id}`, weaviateClass);

  const dataProperties = {
    communityId: community.community_id,
    name: community.name,
    description: community.description,
    language: community.language,
    counter_posts: community.counter_posts,
    counter_points_for: community.counter_points_for,
    counter_points_against: community.counter_points_against,
    imageUrl: community.image_url,
    domain_id: community.domain_id,
    cluster_id: community.cluster_id,
    created_at: community.created_at,
    updated_at: community.updated_at,
    assistantConfiguration: community.assistantConfiguration,
  };

  console.log(dataProperties);

  client.dataObject.create({
    dataObject: dataProperties,
    className: weaviateClass,
    uuid: uuid,
  });
}