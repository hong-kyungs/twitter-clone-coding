# 트위터 클론 코딩

![](image/introduction.jpg)

[클론 사이트 바로가기](https://nodebird.store)

## 📋 Project

풀스택과정을 접해볼 수 있는 트위터 클론 코딩으로 트위터와 비슷하게 기능과 디자인을 구현했습니다.

- redux를 연습하며 이해하고, API호출과 응답에 대해 이해하며 작업했습니다.
- 프론드엔드와 더불어 전반적인 백엔드 서비스의 이해를 얻기 위해 풀스택 강의인 조현영(제로초)님의 "React로 NodeBird SNS 만들기"를 수강하고, 서비스 구현부터 배포까지 진행했습니다.

## 🌟 배포

해당 프로젝트는 AWS를 통해 배포했습니다.
회원가입을 생략하고 싶은 경우 테스트용 아이디를 사용하시면 됩니다.  
ID: 123@naver.com  
PASSWORD: 123

## ⚒️ 사용기술

- `React`
- `Redux`, `Redux-toolkit`
- `Ant Design`, `Styled Components`
- `Express`, `MySQL`, `Sequelize`
- `Next`, `SWR`
- `AWS`

## 📌 전체 기능 및 특징

- 회원가입 / 로그인 구현 및 실시간 업데이트
- 반응형 액션(댓글, 리트윗, 좋아요, 수정, 삭제, 이미지업로드)
- 다이나믹 라우팅
- 팔로우할 유저 추천(유저 팔로우, 언팔로우 가능)

## 🤔 What I learned

- 풀스택 과정을 구현해보며, 백엔드에 대한 이해를 얻었고, 잭엔드 개발자와의 소통 영역에 대해 알 수 있었다.
- `redux-saga` 로 진행한 프로젝트를 `redux-toolkit` 으로 전환해보며, 코드가 간결해짐을 경험하고 `createSlice`로 action과 reducer를 함께 관리하는 방법을 알게 되었다.
- `AntD` 는 처음 접해보는 디자인 프레임워크로 어려움이 있었지만, 원하는 컴포넌트를 자유 자재로 적용하는 법을 알게되었다.
- `Styled Component` 를 통해 CSS in JS 개념을 이해하고, 가벼운 기능은 컴포넌트 내에서 스타일을 적용하는 방법을 알게되었다.
- `Next.js` 를 적용하며, CSR과 SSR의 차이를 깊이 이해하고, `getServerSideProps` 로 서버 사이드 렌더링을 적용하는 방법을 알게되었다.
- `AWS` 를 통해 프론트엔드와 백엔드 서버를 구축하고 배포하는 방법을 알게되었다.

## 🗂️ 페이지별 기능 및 특징

<details>
<summary>회원가입/로그인</summary>
<div markdown="1">

- 회원가입

  - 회원가입시 이미 사용중인 아이디이면, 에러메세지를 보여준다.

  <img src="image/signup.gif"/>

- 로그인

  - 로그인시 사용자 프로필 보여준다. -> 유저 정보 확인(게시글 / 팔로우 / 팔로워 숫자 확인)

  <img src="image/login-logout.gif"/>

</div>
</details>

<details>
<summary>Home</summary>
<div markdown="1">

- 게시글 로딩
  - 인피니트 스크롤링 - 게시글이 10개씩 업로드되는데, 마지막 게시글까지 스크롤되면 다음 10개의 게시글이 업로드된다.
- 실시간 팔로우 추천 업데이트(팔로우, 언팔로우 가능)

<img src="image/home.gif" />

</div>
</details>

<details>
<summary>프로필</summary>
<div markdown="1">

- 닉네임 수정 및 팔로우 / 팔로워 목록 불러오기
- 목록내에 있는 🚫 버튼을 이용하여 언팔로우나 팔로워삭제 가능

<img src="image/profile.gif" />

</div>
</details>

<details>
<summary>게시글</summary>
<div markdown="1">

- 게시글 작성, 이미지 업로드
- 좋아요 버튼(토글)

<img src="image/postcard.gif" />

- 게시글 수정 및 삭제
  - 해당 유저의 게시글 : 수정 / 삭제 가능
  - 다른 유저의 게시글 : 신고 가능
  - 해당 유저가 리트윗한 게시글 : 삭제 가능

<img src="image/postcard-3.gif" />

- 댓글 작성
- 리트윗
  - 본인의 게시물은 리트윗하지 못하게 하고, 한번 리트윗한 게시글은 다시 리트윗하지 못하게 하고 에러메세지 보여준다.

<img src="image/postcard-2.gif" />

</div>
</details>

<details>
<summary>팔로우/언팔로우</summary>
<div markdown="1">

- 팔로우/언팔로우 실시간 반영

<img src="image/follow.gif" />

</div>
</details>

<details>
<summary>해시태그 검색</summary>
<div markdown="1">

- 다이나믹 라우팅을 사용하여, 해당 해시태그 검색시 또는 클릭시 관련 게시글만 불러온다.

<img src="image/hashtag.gif" />

</div>
</details>

<details>
<summary>특정 유저 프로필 / 게시글</summary>
<div markdown="1">

- 다이나믹 라우팅을 사용하여, 특정 유저 아바타 클릭시 해당 유저의 게시글/팔로우/팔로워 정보 가져오고, 해당 유저의 모든 게시글 불러오기

<img src="image/userInfo.gif" />

</div>
</details>

<details>
<summary>카카오톡 공유하기</summary>
<div markdown="1">

- 특정 게시글 카카토톡으로 공유하기
  - 검색엔진에 최적화되도록 Head에 title을 넣어준다.
  - 미리보기 형식 - 오픈그래프를 사용하여 해당 게시글 이미지, 제목, 설명, url을 보여주게 한다.
  - 해당 게시글에 이미지가 존재하면 이미지를 사용하고, 이미지 존재하지 않으면 기본이미지를 제공한다.

<img src="image/share.gif" />

</div>
</details>
