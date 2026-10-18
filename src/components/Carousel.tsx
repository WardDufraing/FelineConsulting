import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination, Navigation, A11y, Keyboard } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface Props {
  images: string[];
  title?: string;
}


export default function Carousel({ images, title }: Props) {
  return (
    <section className="my-16">


        <Swiper
          modules={[Autoplay, Pagination, EffectCoverflow, Navigation, A11y, Keyboard]}
          keyboard={{ enabled: true, onlyInViewport: true }}
          a11y={{ prevSlideMessage: "Vorig ontwerp", nextSlideMessage: "Volgend ontwerp", paginationBulletMessage: "Ga naar ontwerp {{index}}" }}
          watchOverflow
          centeredSlides
          initialSlide={images.length > 1 ? 1 : 0}
          slidesPerView={1} // 👈 default for mobile
          breakpoints={{
            636: {
              slidesPerView: Math.min(images.length, 2),
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: Math.min(images.length, 3),
              spaceBetween: 30,
            },
          }}
          className="carousel-wrapper"
          pagination={images.length > 1}
          navigation={images.length > 1}
        >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
          <div className="carousel-slide">
            <img src={src} alt={`${title ?? "Ontwerp"} ${i + 1}`} loading="lazy" decoding="async" />
          </div>
        </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

