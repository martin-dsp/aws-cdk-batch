# AWS Batch for now not to forget what should be optional

blah blah --profile martin

# Prerequisite

- Existing VPC
- Existing ECS Cluster

# What must be considered

- `테스트 가능` 어떻게 테스트 환경을 구분하게 할 것인가??
- `템플릿` 사람들이 특정 파일에 소스코드만 넣으면 동작하도록 하려면 모든 매핑을 다 해놔야한다. -> constant name까지 주석으로 다 처리하여 가이드라인을 줘야할 듯
- `Multiple language compliance` 어떤 언어로 짜던, packagae를 설치할 수 있어야 한다. python -> requirements.txt, node -> npm install 등..
- `공통 모듈 삽입` Slack 등 -> 다른 언어들은 모듈 import를 어떻게 할 것인가?
- `환경변수` 공통 사항들 (DB, AWS configs etc)
- `config 파일은 어떻게 관리할 것인가?` 특정 환경변수 -> 주석은 얼마나 어떻게 달것인가..
- `Deploy 전략` github repo를 자동생성하여 배포하면 GitAction에서 cdk deploy를 하여 모든 게 동작! (취소하고 싶을 떈????)
- `Git Commands` to make repo and push
- `Secret Keys` Git Action 쓸 때 -> ECR에 어떻게 올리지? 필요한 정보는 어떻게 저장하지.. repo 만들 때 적용시킬 수 있을까? 그러면 커멘드를 따로 치지 않으면 또 저장해놔야 할텐데..
- ``
- ``
- ``
