import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination, Navigation } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';



export default function Carousel({ images }) {
    return (
    <section className="my-16">
      {title && <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>}

        <Swiper
          modules={[Autoplay, Pagination, EffectCoverflow]}
          centeredSlides
          slidesPerView={1} // 👈 default for mobile
          breakpoints={{
            636: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="carousel-wrapper"
          pagination={true}
        >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
          <div className="carousel-slide">
            <img src={src} alt={`Slide ${i}`} />
          </div>
        </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

