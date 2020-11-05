import React, { useState, useContext, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Card, Form, Grid, Icon, Image, Label } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';
import { FETCH_POST_QUERY } from '../graphql/query/fetchPost';
import { SUBMT_COMMENT_MUTATION } from '../graphql/mutation/createComment';


function SinglePost(props) {
    const [ comment, setComment ] = useState('');

    const postId = props.match.params.postId;

    const { user } = useContext(AuthContext);

    const commentInputRef = useRef(null);

    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    const [ submitComment ] = useMutation(SUBMT_COMMENT_MUTATION, {
        update() {
            setComment('');
            //commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    })

    function deletePostCallback() {
        props.history.push('/');
    }

    let postMarkup;

    if (!data) {
        postMarkup = <p>Loading post ...</p>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } =
            data.getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            size='small'
                            float='right'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{ username }</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{ body }</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={ user } post={{ id, likeCount, likes }} />
                                <MyPopup
                                    content='Comment on Post'
                                >
                                    <Button
                                        as='div'
                                        labelPosition='right'
                                        onClick={() => console.log('comment on post')}
                                    >
                                    <Button basic color='blue'>
                                        <Icon name='comments' />
                                    </Button>
                                        <Label basic color='blue' pointing='left'>
                                            { commentCount }
                                        </Label>
                                    </Button>
                                </MyPopup>
                                {
                                    user
                                    && user.username === username
                                    && (
                                        <DeleteButton 
                                            postId={ id }
                                            callback={ deletePostCallback }
                                        />
                                    )
                                }
                            </Card.Content>
                        </Card>
                        {
                            user && (
                                <Card fluid>
                                    <Card.Content>
                                        <p>Post a Comment</p>
                                        <Form>
                                            <div className='ui action input fluid'>
                                                <input
                                                    type='text'
                                                    placeholder='コメント'
                                                    name='comment'
                                                    value={comment}
                                                    onChange={event => setComment(event.target.value)}
                                                    ref={commentInputRef}
                                                />
                                                <button 
                                                    type='submit'
                                                    className='ui button teal'
                                                    disabled={ comment.trim() === ''}
                                                    onClick={submitComment}
                                                >投稿</button>
                                            </div>
                                        </Form>
                                    </Card.Content>
                                </Card>
                            )
                        }
                        {
                            comments.map(comment => (
                                <Card fluid key={comment.id}>
                                    <Card.Content>
                                        {
                                            user 
                                            && user.username === comment.username
                                            && (
                                                <DeleteButton postId={id} commentId={comment.id} />
                                            )
                                        }
                                        <Card.Header>{comment.username}</Card.Header>
                                        <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                        <Card.Description>{comment.body}</Card.Description>
                                    </Card.Content>
                                </Card>
                            ))
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )

    }
    return postMarkup;
}

export default SinglePost;