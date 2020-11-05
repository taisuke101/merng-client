import React from 'react'
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client' 

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../graphql/query/fetchPosts';
import { CREATE_POST_MUTATION } from '../graphql/mutation/createPost';

function PostForm() {

    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    })

    const [ createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            //↓のやり方だと読み取り専用のキャッシュが変更できずにエラーになる
            //data.getPosts = [result.data.createPost, ...newGetPosts];
            //proxy.writeQuery({ query: FETCH_POSTS_QUERY, data })
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: {
                getPosts: [
                    result.data.createPost,
                    ...data.getPosts,
                ]
            } });
            values.body = ''
        }
    })

    function createPostCallback(){
        createPost();
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a Post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder='Hi World!'
                        name='body'
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                    />
                    <Button type='submit' color='teal'>
                        Submit
                    </Button>
                </Form.Field>
            </Form>
        </>
    )
        
}

export default PostForm;
