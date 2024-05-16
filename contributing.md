# 프로젝트 기여

기여에 감사드립니다!

## 기여가 처음이라면

다음 지식이 필요합니다.

- [fork 및 pull request 방법](https://docs.github.com/ko/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
- json 파일 구조의 이해

## 모드 목록 갱신

모드 목록을 추가하기 위한 경로는 다음과 같습니다.

- `\public\thumbnails` : 썸네일 이미지의 저장 경로
- `\public\data\mods.json` : 모드 목록 정보가 담긴 파일 경로
- `\public\data\tags.json` : 태그의 추가 정보가 담긴 파일 경로

### mods.json 정보

mods.json은 필요한 모드 정보가 담긴 객체의 배열 형태입니다.

```json
{
    "name" : "",
    "mod" : "",
    "site" : "",
    "author" : "",
    "short_description" : "",
    "thumnail" : "",
    "tags" : [],
    "version" : "",
    "descriptions" : [""]
}
```

모드 정보 추가를 위해 필요한 필드
- `name` : 모드 이름
- `mod` : 모드의 고유 명칭입니다. 모드 페이지 주소에서 `mods.factorio.com/mod/<모드 고유명칭>`를 확인하세요. ('%20' 등 인코딩된 문자는 적절하게 변환해야 합니다.)
- `site` : 모드 페이지
- `author` : 모드의 제작자
- `short_description` : 모드 목록에서 볼 수 있는 한줄 설명입니다.
- `thumnail` : 썸네일 이미지 이름. `\public\thumbnails\<이미지>` 에서 이미지를 찾습니다.
- `tags` : 모드의 특징을 나타내는 태그. 여러개 지정할 수 있습니다.
- `version` : 현재 사용하지 않음. 추후 모드 버전을 지정하기 위해 사용할 예정입니다.
- `descriptions` : 모드 설명. 아래 색상 코드를 사용할 수 있습니다.

descripitons 에 사용가능한 색상 코드
- `#W` : 흰색 (기본값)
- `#R` : 빨간색
- `#Y` : 노란색
- `#B` : 파란색