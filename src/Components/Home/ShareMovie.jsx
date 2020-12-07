import { firestore } from '../../firebase.js';
import { useState } from 'react';
import { CommentDiv, CommentForm, CommentInput } from '../../Components/StyledComponents';
import { Button } from 'react-bootstrap';
import firebase from 'firebase/app';

const ShareMovie = (props) => {

    const [text, setContent] = useState('');

    const auth = firebase.auth();
    const uid = auth.currentUser.uid

    const handleCommentSubmission = async (e) => {
        e.preventDefault();

        async function shareMovie() {
            let newComment = {
                text: text,
                title: props.title,
                poster: props.poster,
                release: props.release,
                synopsis: props.synopsis,
                uid,
            }
            await firestore.collection('post')
            .add(newComment)
            .catch(err => {
                console.error('error adding comment: ', err)
            })
            setContent("")
        }
        shareMovie()
    }

    return (
        <CommentDiv>
        <CommentForm onSubmit={handleCommentSubmission}>
            <CommentInput
                id="text"
                label="Share"
                name="text"
                value={text}
                onChange={(e) => setContent(e.target.value)}
            />
            <Button variant="danger" type="submit">Share</Button>
        </CommentForm>
        </CommentDiv>
    );
}

export default ShareMovie;
