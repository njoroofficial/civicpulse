export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed commit types for CivicPulse
    'type-enum': [
      2, 'always',
      ['feat', 'fix', 'docs', 'chore', 'refactor', 'test', 'perf', 'ci', 'build']
    ],
    // Scope should be one of our apps or packages
    'scope-enum': [
      1, 'always',
      ['web', 'api', 'shared', 'infra', 'ci', 'docs']
    ],
    'subject-max-length': [2, 'always', 72]
  }
}
