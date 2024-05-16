# Factorio ModPack Generator

팩토리오에서 여러 편의성 모드를 의존 모드로 지정해 모드 하나로 여러 모드를 쉽게 관리하기 위한 프로젝트입니다.

[여기](https://hve4638.github.io/deploy/factorio-modpack-generator/)에서 호스팅되고 있습니다.

## 사용법

**Export로 추출한 모드팩 위치**

zip 파일을 `%appdata%\Factorio\mods` 디렉토리에 넣으면 인게임에서 설치한 모드로 나타납니다.

## 기여

기여에 감사드립니다!

**모드 목록 갱신**

모드 목록을 추가하기 위한 경로
- `\public\data\mods.json` : 모드 목록 정보가 담긴 파일 경로
- `\public\thumbnails` : 썸네일 이미지의 저장 경로

모드 정보 추가를 위해 필요한 필드
- `name` : 모드 이름
- `mod` : 모드의 고유 명칭입니다. 모드 페이지 주소에서 `mods.factorio.com/mod/<모드 고유명칭>`를 확인하세요. ('%20' 등 인코딩된 문자는 적절하게 변환해야 합니다.)
- `site` : 모드 페이지
- `author` : 모드의 제작자
- `short_description` : 모드 목록에서 볼 수 있는 한줄 설명입니다.
- `thumnail` : 썸네일 이미지 이름. `\public\thumbnails\<이미지>` 에서 이미지를 찾습니다.
- `tags` : 모드의 특징을 나타내는 태그. 여러개 지정할 수 있습니다.
- `version` : 현재 사용하지 않음. 추후 모드 버전을 지정하기 위해 사용할 예정입니다.

## 빌드

*node.js* 가 필요합니다

```bash
git clone https://github.com/hve4638/factorio-modpack-generator.git
```

1. 저장소 클론

```bash
npm i
```

2. 빌드를 위한 종속성 설치

```bash
npm run build
```

3. 빌드 수행. 빌드 결과는 build 디렉토리에 저장됩니다
