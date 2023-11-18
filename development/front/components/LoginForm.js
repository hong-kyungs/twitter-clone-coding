import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import useInput from '../../hooks/useInput';

import { logIn } from '../reducers/userSlice';

const ButtonWrapper = styled.div`
	margin-top: 10px;
`;

const LoginForm = () => {
	const dispatch = useDispatch();
	const { logInLoading, logInError } = useSelector((state) => state.user);

	//반복되는 부분 custom hook 만들어주기
	const [email, onChangeEmail] = useInput('');
	const [password, onChangePassword] = useInput('');

	useEffect(() => {
		if (logInError) {
			alert(logInError);
		}
	}, [logInError]);

	/*
	const [id, setId] = useState('');
	const [password, setPassword] = useState('');
	const onChangeId = useCallback((e) => {
		setId(e.target.value);
	}, []);
	const onChangePassword = useCallback((e) => {
		setPassword(e.target.value);
	}, []);	
	*/

	const onSubmitForm = useCallback(() => {
		console.log(email, password);
		dispatch(logIn({ email, password }));
	}, [email, password]);

	return (
		<Form onFinish={onSubmitForm}>
			<div>
				<label htmlFor='user-email'>이메일</label>
				<br />
				<Input
					name='user-email'
					type='email'
					value={email}
					onChange={onChangeEmail}
					required
				/>
			</div>
			<div>
				<label htmlFor='user-password'>비밀번호</label>
				<br />
				<Input
					name='user-password'
					type='password'
					value={password}
					onChange={onChangePassword}
					required
				/>
			</div>
			<ButtonWrapper>
				<Button type='primary' htmlType='submit' loading={logInLoading}>
					로그인
				</Button>
				<Link href='/signup'>
					<a>
						<Button>회원가입</Button>
					</a>
				</Link>
			</ButtonWrapper>
		</Form>
	);
};

export default LoginForm;
