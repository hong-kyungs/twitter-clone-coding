const AWS = require('aws-sdk');
const sharp = require('sharp');

const s3 = new AWS.S3();

//handler라는 함수 만들어줌. 함수 이름은 마음대로 정해도 되고, 반드시 기억해야 함
exports.handler = async (event, context, callback) => {
	//multer로 s3에 이미지 업로드시, lambda 함수도 같이 실행되게 하기
	const Bucket = event.Records[0].s3.bucket.name; // twitter-clone-coding, 내 버킷 이름이 들어간다
	//decodeURIComponent는 파일명이 한글일때 에러 해결가능
	const Key = decodeURIComponent(event.Records[0].s3.object.key); // 1. 파일명, 예를 들어 original/12312312_abc.png 라면
	console.log(Bucket, Key);
	const filename = Key.split('/')[Key.split('/').length - 1]; // 2. filename에 12312312_abc.png만 추출된다.
	const ext = Key.split('.')[Key.split('.').length - 1].toLowerCase(); // 3. ext에 확장자 png만 추출된다. toLowerCase로 바꿔준다.
	const requiredFormat = ext === 'jpg' ? 'jpeg' : ext; //4. 확장자가 jpg인 경우엔 sharp에 jpeg로 넣어줘야 한다.
	console.log('filename', filename, 'ext', ext);

	try {
		const s3Object = await s3.getObject({ Bucket, Key }).promise(); // 1. 이미지 가져와서
		console.log('original', s3Object.Body.length); //Body에 이미지들이 저장되어 있다.
		const resizedImage = await sharp(s3Object.Body) // 2. 리사이징해서
			.resize(400, 400, { fit: 'inside' })
			.toFormat(requiredFormat)
			.toBuffer();
		await s3
			.putObject({
				//3. 다시 업로드하기
				Bucket,
				Key: `thumb/${filename}`, // original 폴더가 아니라 thumb(썸네일) 폴더에 업로드하기
				Body: resizedImage,
			})
			.promise();
		console.log('put', resizedImage.length);
		return callback(null, `thumb/${filename}`); //다시 업로드까지 하면 성공. 성공결과로 어떤 이미지가 만들어졌는지 `thumb/${filename}` 넣어줌
	} catch (error) {
		console.error(error);
		return callback(error); //lambda가 끝날때는 callback을 넣어줌 - passport에 done과 같은 역할
	}
};
