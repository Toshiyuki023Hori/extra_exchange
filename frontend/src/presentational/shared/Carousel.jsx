import React, { Component } from 'react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
//
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

class Carousel extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    const {images} = this.props;
    
    return (
      <Swiper wrapperTag="ul">
        {
          images.map((image, key) => {
            return (
            <SwiperSlide key={key} tag="li">
              <img src={image} alt={"image" + key}/>
            </SwiperSlide>
            )
          })
        }
      </Swiper>
    )
  }
}

export default Carousel;