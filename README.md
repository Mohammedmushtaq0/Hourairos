# Hourairos
for login it uses the aws cognito - which includes the email verification . And it have session and authentication using the jason and cookies.
the core working of this application = 
  #it provides the hosting for the static websites , users can upload there website using the zip format
    - it extracts the zip ans store in the awss s3 bucket .
    - using the url providede by the s3 buckets in uses the aws cloudfront and uses this s3 buckets as the origin .
    - the cloudfront provides the website gloabally accessble and provide the availability of between 95.99% to 99.99% and the       durability of 99.999999999% by using the s3 architecture for it.
    - along with the cloudfront it uses the aws route 53 for domain holding and hosting zone.
    - the application uses the node.js for it backend and core logic .
  #The ecs archtiecture =
    - it uses the ecs for deploying and orcoestrating of this application docker images.
    - it uses the ecr for docker image repository and 
    - the ecs cluster uses the fragate type provider for running of this application.
telemetry = 
  - it uses the opentelemetry for collecting of metrics ,logs and traces of the hourairos
  - by using the tools like prometheus , loki , tempo and grafana for visualizing
  -  it uses the cloud map for inner service communication from app to this tools
CICD =
  - it uses the git for version controling .
  - it uses the github repo and github action / workflow for cicd
  - it mainly have the two branches =
  - - 1) main(branch) 2) ci-cd (branch)
  - all the updatea are upload to the ci-cd branches and when merger pull reguest is done to verify the code
  -  when the coed or something is updated on the main branch the github actions runs , first it will check the code erros        and create an image then it upload to the aws using the role provide dedicately to this branch by using the OIDC             supported by the aws .
  -  the actions then upload the image to the ecr and then 
