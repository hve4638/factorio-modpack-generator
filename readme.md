# Factorio ModPack Generator

팩토리오에서 여러 편의성 모드를 의존 모드로 지정해 모드 하나로 여러 모드를 쉽게 관리하기 위한 프로젝트입니다.

[여기](https://hve4638.github.io/deploy/factorio-modpack-generator/)에서 호스팅되고 있습니다.

## 사용법

**Export로 추출한 모드팩 위치**

zip 파일을 `%appdata%\Factorio\mods` 디렉토리에 넣으면 인게임의 설치한 모드 창에서 확인할 수 있습니다.

*WIP*

## 모드 목록 선별 기준

편의 모드 및 범용성 있는 모드를 선별합니다.

추가되었으면 하는 모드가 있다면 기여를 통해 추가할 수 있습니다. 언제나 기여는 환영입니다!

## 기여

기여에 감사드립니다!



관련 정보는 [contributing.md](/contributing.md)를 참고하세요

## 빌드

이 프로젝트가 향후 관리되지 않거나, 이 프로젝트의 방향성과 맞지 않아 추가되지 않은 모드를 추가 또는 제거하고 싶거나, 직접 호스팅하고 싶다면 아래 방법으로 빌드 후 로컬 환경에서 열거나, 정적 웹 호스팅 서비스에 올릴 수 있습니다.

종속성 : *node.js* 설치가 필요합니다.

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

3. 빌드 수행. 빌드 결과는 `build` 디렉토리에 저장됩니다.

