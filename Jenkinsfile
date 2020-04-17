node {
    try{
        notifyBuild('STARTED')
        
        ws("${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_ID}/") {
            withEnv([
                "PROJECT_DIR=${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_ID}",
                "ARCHIVE_DIR=/usr/local/data/${JOB_NAME}/builds/${BUILD_ID}/archive",
            ]) {
                
                stage('Checkout'){
                    echo 'Checking out SCM'
                    checkout scm
                }
                
                stage('Archive'){
                    archiveArtifacts artifacts: '**', fingerprint: false, onlyIfSuccessful: true
                }
            }
        }
    }catch (e) {
        // If there was an exception thrown, the build failed
        currentBuild.result = "FAILED"
    } finally {
        // Success or failure, always send notifications
        notifyBuild(currentBuild.result)
        
        def bs = currentBuild.result ?: 'SUCCESSFUL'
        if(bs == 'SUCCESSFUL'){
        }
    }
}

def notifyBuild(String buildStatus = 'STARTED') {
  // build status of null means successful
  buildStatus =  buildStatus ?: 'SUCCESSFUL'

  // Default values
  def colorName = 'RED'
  def colorCode = '#FF0000'
  def subject = "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
  def summary = "${subject} <${env.BUILD_URL}|Job URL> - <${env.BUILD_URL}/console|Console Output>"

  // Override default values based on build status
  if (buildStatus == 'STARTED') {
    color = 'YELLOW'
    colorCode = '#FFFF00'
  } else if (buildStatus == 'SUCCESSFUL') {
    color = 'GREEN'
    colorCode = '#00FF00'
  } else {
    color = 'RED'
    colorCode = '#FF0000'
  }

}