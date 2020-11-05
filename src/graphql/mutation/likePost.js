import { gql } from '@apollo/client';

export const LIKE_POST_MUTATION = gql`
mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
        id
        likes {
            id
            username
        }
        likeCount
    }
}
`