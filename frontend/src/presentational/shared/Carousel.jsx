import React, { Component } from 'react';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
//
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import './Carousel.scss'

SwiperCore.use([Navigation, Pagination, Autoplay]);

class Carousel extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    const {images} = this.props;
    
    return (
    <Swiper 
    wrapperTag='ul'
    effect={"slide"}
    navigation
    pagination={{
      type:'bullets',
      clickable:true
    }}
    autoplay={{display:3000}}
    centeredSlides={true}
    slidesPerView={1.2}
    >
        {
          images.map((image, key) => {
            return (
            <SwiperSlide key={key} tag='li'>
              <img className="swiper__img" src={image} alt={"image" + key}/>
            </SwiperSlide>
            )
          })
        }
      </Swiper>
    )
  }
}

export default Carousel;

