import { gql } from '@apollo/client';

export const SUBMT_COMMENT_MUTATION = gql`
    mutation($postId: String!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id
            comments {
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`