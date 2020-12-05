import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {CardWrapper, MovieCardWrapper} from '../../StyledComponents'
import ShareMovie from '../ShareMovie';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import ReactStars from "react-rating-stars-component";

function Results (props) {

    return (
        <div>
            {props.data && props.data.map(result => <ResultCard key={result.id} data={result}/>)}
        </div>
    )
}

function ResultCard(props) {
    const imgurl = `https://image.tmdb.org/t/p/w500/${props.data.poster_path}`

    const firestore = firebase.firestore();
    const watchlists = firestore.collection('watchlist');
    const userratings = firestore.collection('userratings');
    const watched = firestore.collection('watched');
    const auth = firebase.auth();
    const [user] = useAuthState(auth);
    const uid = auth.currentUser.uid

    const handleSubmit = async(e) => {
        e.preventDefault();
        await watchlists.add({
            movieid: props.data.id,
            title: props.data.original_title,
            date: props.data.release_date,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            poster: imgurl,
            uid,
        });
    }

    const handleWatch = async(e) => {
        e.preventDefault();
        await watched.add({
            movieid: props.data.id,
            title: props.data.original_title,
            date: props.data.release_date,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            poster: imgurl,
            uid,
        });
    }

    const ratingChanged = (newRating) => {
            userratings.add({
            movieid: props.data.id,
            title: props.data.original_title,
            date: props.data.release_date,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            rating: newRating,
            uid,
        });
      };

    return (
        <Card style={{ width: '100%', marginBottom: '5%'}} id="admin-card">
            <CardWrapper>
                <MovieCardWrapper>
                    <div>
                    <Form onClick={handleWatch}><Button type="submit" variant="danger" style={{width: '100%'}}>+ watched</Button></Form>
                        { props.data.poster_path!=null ? <img src={imgurl} style={{width: '300px', padding: '1%'}}></img> : <img src='https://user-images.githubusercontent.com/10515204/56117400-9a911800-5f85-11e9-878b-3f998609a6c8.jpg' style={{width: '300px', padding: '1%', height: '400px', objectFit: 'cover'}}></img>}
                            <Form onClick={handleSubmit}><Button type="submit" variant="danger" style={{width: '100%'}}>+ watchlist</Button></Form>
                        </div>
                    <div style={{padding: '1%', textAlign: 'left'}}>
                        <h4>{props.data.original_title}</h4>
                        <h6>Release Date: {props.data.release_date}</h6>
                        <p>Overview: {props.data.overview}</p>
                        <p>Average Rating: {props.data.vote_average}</p>
                        <ReactStars
                        count={5}
                        size={25}
                        value={props.data.vote_average/2}
                        isHalf={true}
                        activeColor="#ffd700"/>
                        <p>Your Rating:</p>
                        <ReactStars
                        count={5}
                        onChange={ratingChanged}
                        size={25}
                        // value={}
                        isHalf={true}
                        activeColor="#ffd700"/>
                        <ShareMovie
                            poster={props.data.poster_path}
                            title={props.data.original_title}
                            release={props.data.release_date}
                            synopsis={props.data.overview}
                        />
                    </div>
                </MovieCardWrapper>
            </CardWrapper>
        </Card>
    )
}


export default Results;
