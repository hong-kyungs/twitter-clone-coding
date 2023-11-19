import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { backUrl } from '../../config/config';

import {
	Overlay,
	Header,
	CloseBtn,
	SlickWrapper,
	ImgWrapper,
	Indicator,
	Global,
} from './styles';

const ImagesZoom = ({ images, onClose }) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	return (
		<Overlay>
			<Global />
			<Header>
				<h1>상세이미지</h1>
				<CloseBtn onClick={onClose}>X</CloseBtn>
			</Header>
			<SlickWrapper>
				<div>
					<Slick
						initialSlide={0} //시작하는 이미지의 번호
						afterChange={(slide) => setCurrentSlide(slide)}
						infinite //무한대로 되돌기
						arrows={false} // 화살표 없애기
						slidesToShow={1} // 이미지 하나씩만 보여주기
						slidesToScroll={1} // 이미지 하나씩만 넘기기
					>
						{/* Slick안에 이미지들 넣어주기 */}
						{images.map((v) => (
							<ImgWrapper key={v.src}>
								<img src={`${backUrl}/${v.src}`} alt={v.src} />
							</ImgWrapper>
						))}
					</Slick>
					<Indicator>
						<div>
							{currentSlide + 1} / {images.length}
						</div>
					</Indicator>
				</div>
			</SlickWrapper>
		</Overlay>
	);
};

ImagesZoom.propTypes = {
	images: PropTypes.arrayOf(PropTypes.object).isRequired,
	onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
