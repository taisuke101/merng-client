import React, { useState } from 'react';
import { useMutation } from '@apollo/client'

import { Button, Confirm, Icon } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../graphql/query/fetchPosts';
import { DELETE_POST_MUTATION } from '../graphql/mutation/deletePost';
import { DELETE_COMMENT_MUTATION } from '../graphql/mutation/deleteComment';
import MyPopup from '../util/MyPopup';

function DeleteButton({ postId, commentId, callback }) {

    const [ confirmOpen, setConfirmOpen ] = useState(false);

    const mutation = commentId 
    ? DELETE_COMMENT_MUTATION 
    : DELETE_POST_MUTATION

    const [ deletePostOrMutation ] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false);
            if (!commentId) {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                const RestPosts = data.getPosts.filter(p => p.id !== postId);
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: {
                    getPosts: [
                        ...RestPosts,
                    ]
                }});
            }
            if (callback) callback();
        },
        variables: {
            postId,
            commentId
        }
    })
    return ( 
        <>
            <MyPopup
                content={commentId ? 'Delete Comment' : 'Delete Post'}
            >
            <Button 
                as='div' 
                color='red'
                floated='right'
                onClick={() => setConfirmOpen(true) }
            >
            <Icon name='trash' style={{ margin: 0 }}/>
            </Button>
            </MyPopup>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrMutation}
            />
        </>
    )
}

export default DeleteButton;