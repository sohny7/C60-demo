import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import * as reviewsService from '../../../services/reviewsService'
import moment from 'moment'
import StarRatings from 'react-star-ratings'
import './ReviewForm.css'
import LoadingSpinner from '../../layout/LoadingSpinner'

const backdropStyle = {
    zIndex: 'auto',
    backgroundColor: '#000', 
    opacity: 0.3
  };  

class AllReviewsModal extends Component {
    constructor(props){
        super(props)
        this.state ={
            reviewsList: [{
                reviewId: 0
                , reviewerName: ''
                , profileImage: ''
                , reviewDate: ''
                , ratings: 0
                , comments:''
            }]
            , loading: false
        }
    }

    componentDidMount(){
        const userId = this.props.reviewId
        const isCoachOrMentor = this.props.isCoachOrMentor;
        if(userId && isCoachOrMentor){
            this.getReviews(userId)
        }
    }

    getReviews(id) {
        reviewsService.readById(id)
            .then(response => {
                this.showLoading()
                let temp = response.item;
                if (temp == undefined || temp == null || temp == '') {
                    this.setState({ reviewsList: null })
                }
                else {
                    let list = [];
                    temp.map(i => {
                        list.push({
                            reviewId: i.id
                            , reviewerName: `${i.firstName} ${i.lastName}`
                            , profileImage: i.imageUrl
                            , reviewDate: i.dateCreated
                            , rating: i.starRating
                            , comments: i.comments
                        })
                    })
                    this.setState({ reviewsList: list })
                }
            })
        this.showLoading()
    }

    showLoading(){
        this.setState({ loading: !this.state.loading })
    }

    render () {
        
        let reviewPreview = this.state.reviewsList ? 
        [...this.state.reviewsList].reverse().map (item => {
            return (
                <div className='row' key={item.reviewId}>
                <div className='listview__item listview_border'  >
                <div className='col-sm-4'>
                <figure>
                    <img src={item.profileImage} className='listview__img img_size' alt='profile_image' />
                    <figcaption className='caption'>{item.reviewerName}</figcaption>
                    </figure>
                    </div>
                    <div className='col-sm-8'>
                    <div className='listview__content listview_content_'>
                    <em>{`${moment(item.reviewDate).format('MMMM Do YYYY')}`}</em><br/><br/>
                        <StarRatings 
                            rating={item.rating !=null ? item.rating : 0}
                            starDimension='25px'
                            starSpacing='5px'
                            starRatedColor='#FFD700' /><br/>
                        { `"${item.comments}"` }<br />
                    </div>
                    </div>
                </div>
                </div>
            )
        })
        : <strong><em>No Reviews Available</em></strong>

        return(
            <React.Fragment>
                <LoadingSpinner loading={this.state.loading} />
                <Modal
                    show={this.props.show}
                    backdropStyle={backdropStyle}
                    animation={false}
                    onHide={this.props.close} >
                    <Modal.Header >
                        <div className='col-sm-12'>
                            <button className="btn btn-light float-right" style={{ backgroundColor: '#264057' }} onClick={this.props.close}>x</button>
                        </div>
                    </Modal.Header>

                    <Modal.Body>
                        <div className=' container listview listview_addOn'>
                            {reviewPreview}
                        </div>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        )
    }

}

export default AllReviewsModal;
