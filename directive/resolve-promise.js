import { AsyncDirective, directive } from 'lit/async-directive.js'

class ResolvePromise extends AsyncDirective {
  render (promise) {
    Promise.resolve(promise)
      .then(resolvedValue => {
        // Rendered Async
        this.setValue(resolvedValue)
      })
      // Do not print error when promise fail
      // .catch(err => {
      //   this.setValue(err)
      // })
    // Rendered Synchronously
    return ''
  }
}

export const resolvePromise = directive(ResolvePromise)
