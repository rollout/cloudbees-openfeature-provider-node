pipeline {
  agent none

  options {
    timeout(time: 5, unit: 'MINUTES')
  }
  stages {
    stage("Build code") {
      // this stage is meant to be the caching entry point of the pipeline as it will allow us to
      // implement parallel stages w cache for unit testing and integration testing.
      // it also calculates global var env.BUILDNUM
      agent {
        kubernetes {
          label 'build-' + UUID.randomUUID().toString()
          inheritFrom 'default'
          yamlFile './cbci-templates/fmforci.yaml'
        }
      }
      steps{
        container(name: "server", shell: 'sh') {
              sh script : """
                yarn --frozen-lockfile
                yarn lint
                yarn build
                yarn test
              """, label: "yarn lint, build and test"
        } //end container
      } //end step
      post {
        always {
          junit checksName: 'Jest Tests', testResults: 'junit.xml'
        }
      }
    } // end stage("End Build code")
  } // end stages
} // end pipeline
