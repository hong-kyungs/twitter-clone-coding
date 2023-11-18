import { useState, useCallback } from 'react';

export default (initialValue = null) => {
	const [value, setValue] = useState(initialValue);
	const handler = useCallback((e) => {
		setValue(e.target.value);
	}, []);
	return [value, handler, setValue];
};

/*
	const [id, setId] = useState('');
	const onChangeId = useCallback((e) => {
		setId(e.target.value);
	}, []);

	const [password, setPassword] = useState('');
	const onChangePassword = useCallback((e) => {
		setPassword(e.target.value);
	}, []);	
	*/
