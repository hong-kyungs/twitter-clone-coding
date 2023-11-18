const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class User extends Model {
	static init(sequelize) {
		return super.init(
			{
				// 'User'가 MySQL에는 users로 table에 생성된다.
				//id는 기본적으로 들어있다. MySQL에서 자동으로 1,2,3,4... 순서대로 올라간다.
				//email, nickname, password와 같은 column에 조건을 적어줘야 한다.
				email: {
					type: DataTypes.STRING(30), // 문자열이고 30글자 이내
					allowNull: false, // 필수, true면 선택적,
					unique: true, // 고유한 값, 중복되면 안되기 때문에
				},
				nickname: {
					type: DataTypes.STRING(30),
					allowNull: false,
				},
				password: {
					type: DataTypes.STRING(100), // 비밀번호는 암호화를 하면 길이가 길어지기 때문에 100으로 넣어줌.
					allowNull: false,
				},
			},
			{
				modelName: 'User',
				tableName: 'users',
				charset: 'utf8',
				collate: 'utf8_general_ci', // 한글 저장
				sequelize,
			}
		);
	}

	static associate(db) {
		db.User.hasMany(db.Post);
		db.User.hasMany(db.Comment);
		//through로 중간테이블 이름을 정하고, as로 별칭을 붙여서 구분한다.
		//Liked가 있으면 내가 좋아요를 누른 게시글들
		db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
		//foreignkey로 key이름을 바꿔준다.
		db.User.belongsToMany(db.User, {
			through: 'Follow',
			as: 'Followers',
			foreignKey: 'FollowingId',
		});
		db.User.belongsToMany(db.User, {
			through: 'Follow',
			as: 'Followings',
			foreignKey: 'FollowerId',
		});
	}
};
