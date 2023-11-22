import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';

import ImagesZoom from './ImagesZoom';

const PostImages = ({ images }) => {
	const [showImageZoom, setShowImageZoom] = useState(false);

	const onZoom = useCallback(() => {
		setShowImageZoom(true);
	}, []);

	const onClose = useCallback(() => {
		setShowImageZoom(false);
	}, []);

	//이미지가 1개만 있을 때
	if (images.length === 1) {
		return (
			<>
				{/* 시각장애인들 위한 screen reader가 role="presentation"로 사진을 굳이 클릭할 필요가 없다고 알려줌*/}
				<img
					role='presentation'
					src={`${images[0].src}`}
					alt={images[0].src}
					onClick={onZoom}
				/>
				{showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
			</>
		);
	}
	//이미지가 2개 있을 때
	if (images.length === 2) {
		return (
			<>
				<img
					role='presentation'
					style={{ display: 'inline-block', width: '50%' }}
					src={`${images[0].src}`}
					alt={images[0].src}
					onClick={onZoom}
				/>
				<img
					role='presentation'
					style={{ display: 'inline-block', width: '50%' }}
					src={`${images[1].src}`}
					alt={images[1].src}
					onClick={onZoom}
				/>
				{showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
			</>
		);
	}
	//이미지가 3개 이상일때 - 이미지 하나 보여주고, 더보기 칸 보여주기
	return (
		<>
			<img
				role='presentation'
				style={{ display: 'inline-block', width: '50%' }}
				src={`${images[0].src}`}
				alt={images[0].src}
				onClick={onZoom}
			/>
			<div
				role='presentation'
				style={{
					display: 'inline-block',
					width: '50%',
					textAlign: 'center',
					verticalAlign: 'middle',
				}}
				onClick={onZoom}
			>
				<PlusOutlined />
				<br />
				{images.length - 1}
				개의 사진 더보기
			</div>
			{showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
		</>
	);
};

PostImages.propTypes = {
	images: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PostImages;
