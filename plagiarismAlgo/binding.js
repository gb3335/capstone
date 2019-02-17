var plagiarism

if (process.env.DEBUG) {
  plagiarism= require('./build/Debug/plagiarism.node')
} else {
  plagiarism= require('./build/Release/plagiarism.node')
}

module.exports = plagiarism