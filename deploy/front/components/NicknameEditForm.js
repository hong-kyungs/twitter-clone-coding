import React, { useCallback, useMemo } from 'react';
import { Form, Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import useInput from '../../hooks/useInput';
import { changeNickname } from '../reducers/userSlice';

const NicknameEditForm = () => {
	const style = useMemo(
		() => ({
			marginBottom: '20px',
			border: '1px solid #d9d9d9',
			padding: '20px',
		}),
		[]
	);

	const { me } = useSelector((state) => state.user);
	const [nickname, onChangeNickname] = useInput(me?.nickname || '');
	const dispatch = useDispatch();

	const onSubmit = useCallback(() => {
		dispatch(changeNickname(nickname));
	}, [nickname]);

	return (
		<Form style={style}>
			<Input.Search
				value={nickname}
				onChange={onChangeNickname}
				addonBefore='닉네임'
				enterButton='수정'
				onSearch={onSubmit}
			/>
		</Form>
	);
};

export default NicknameEditForm;
