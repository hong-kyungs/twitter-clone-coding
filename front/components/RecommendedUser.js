import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Card, Avatar, Button, FloatButton } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

const Followbox = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
`;
const CardWrapper = styled(Card)`
	.cardWrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.ant-card-meta {
		align-items: center;
	}
	.ant-card-meta-avatar {
		padding-right: 5px;
	}
	.ant-card-body {
		padding: 12px 16px;
	}
`;

const RecommendedUser = () => {
	// const onRefresh = () => {
	// 	console.log('다시');
	// };

	return (
		<div>
			<Followbox>
				<h3 style={{ margin: '0px' }}>팔로우 추천</h3>
				<Button type='text' shape='circle' icon={<RedoOutlined />} />
			</Followbox>
			<CardWrapper>
				<div className='cardWrapper'>
					<Card.Meta
						avatar={
							<Avatar src='https://xsgames.co/randomusers/avatar.php?g=pixel&key=1' />
						}
						title='아이디'
					/>
					<Button type='primary'>팔로우</Button>
				</div>
			</CardWrapper>
		</div>
	);
};

export default RecommendedUser;
