import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, A11y, Keyboard } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Props {
  images: string[];
  title?: string;
}


export default function Carousel({ images, title }: Props) {
  return (
    <section className="my-16" aria-label={title ?? "Ontwerpvoorbeelden"}>


        <Swiper
          modules={[Pagination, Navigation, A11y, Keyboard]}
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
          pagination={images.length > 1 ? { clickable: true } : false}
          navigation={images.length > 1}
        >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
          <div className="carousel-slide">
            <img src={src} alt={`${title ?? "Ontwerp"} ${i + 1}`} width={1600} height={src.includes('/logos/') ? 1200 : 2400} loading="lazy" decoding="async" />
          </div>
        </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

